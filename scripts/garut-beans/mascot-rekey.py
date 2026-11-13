# Re-cuts the dancing sheep mascot from the original white-backdrop frames.
# The repo's cut-out video lost parts of the white wool and keeps a white box on
# browsers without transparent-video support (Safari/iOS), so the home page uses
# the animated WebP in assets/ made with this script instead. To redo it:
#   ffmpeg -i kopi-menari-home-cutout.webm -vf fps=15 base/%03d.png   (plain decoder = white backdrop)
#   python3 mascot-rekey.py   -> clean/*.png, then save as animated WebP 420x438, 67 ms per frame.
import glob, sys, numpy as np
from PIL import Image
from scipy import ndimage
def key(path):
    rgb = np.array(Image.open(path).convert('RGB')).astype(np.float32)
    mn = rgb.min(-1); mx = rgb.max(-1)
    whiteish = (mn > 228) & (mx - mn < 18)
    lab, n = ndimage.label(whiteish)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:,0], lab[:,-1]]))) - {0}
    bg = np.isin(lab, list(border))
    # enclosed gaps (between arm and body, cup and head) are pure white backdrop too
    pure = (mn > 238) & (mx - mn < 10)
    lab3, n3 = ndimage.label(pure)
    if n3:
        sz = ndimage.sum(pure, lab3, range(1, n3+1))
        big = np.zeros(n3+1, bool); big[1:] = sz >= 120
        gaps = big[lab3]
        gaps = ndimage.binary_dilation(gaps, iterations=2) & whiteish
        bg |= gaps
    # tiny specks of non-bg inside bg (compression noise) -> bg
    fg = ~bg
    fg = ndimage.binary_opening(fg, iterations=1)
    lab2, n2 = ndimage.label(fg)
    if n2:
        sizes = ndimage.sum(fg, lab2, range(1, n2+1))
        keep = np.zeros(n2+1, bool); keep[1:] = sizes >= 400
        fg = keep[lab2]
    # soft edge: ring of 1px outside fg gets partial alpha by darkness
    alpha = fg.astype(np.float32)
    ring = ndimage.binary_dilation(fg, iterations=1) & ~fg
    alpha[ring] = np.clip((250 - mn[ring]) / 70, 0, 1)
    inner = fg & ~ndimage.binary_erosion(fg, iterations=1)
    alpha[inner] = np.clip(0.35 + (250 - mn[inner]) / 60, 0, 1)
    alpha = ndimage.gaussian_filter(alpha, 0.5) * (alpha > 0)
    m = alpha[...,None]
    edge = (alpha > 0) & (alpha < 0.999)
    un = np.clip((rgb - (1 - m) * 250) / np.maximum(m, 1e-3), 0, 255)
    rgb = np.where(edge[...,None], un, rgb)
    return Image.fromarray(np.dstack([rgb, alpha*255]).astype(np.uint8), 'RGBA')
for f in sorted(glob.glob('base/*.png')):
    key(f).save(f.replace('base/','clean/'))
