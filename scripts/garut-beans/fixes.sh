#!/usr/bin/env bash
# Small layout fixes for the original Garut Beans source, applied before every build.
# Usage: bash scripts/garut-beans/fixes.sh <path to artifacts/kopi-garut-web>
set -euo pipefail
APP="$1"
HOME_CSS="$APP/src/pages/home-page.css"
# `.gb-home button { font: inherit; border: 0 }` outranks every button class on the home page,
# so buttons like "Tambah", "Delivery" and "Racik paket" lost their designed size, weight and border.
# :where() keeps the reset but lets the button classes win again.
sed -i 's/^\.gb-home button {$/.gb-home :where(button) {/' "$HOME_CSS"
grep -q '^\.gb-home :where(button) {$' "$HOME_CSS" || { echo "fixes.sh: home button reset not found" >&2; exit 1; }
# The upstream footer leaves a dangling selector immediately before @media.
sed -i '/^\.gb-footer-logo:focus-visible,$/d' "$HOME_CSS"

# Shadow room for sideways card rows and smaller floating buttons on phones.
# Re-running drops the previously appended block first, so edits to tidy.css always land.
# (The original file has no final newline, so an earlier block may sit right after a closing brace.)
sed -i 's#}/\* NEMPO tidy fixes#}\n/* NEMPO tidy fixes#' "$HOME_CSS"
sed -i '/^\/\* NEMPO tidy fixes/,$d' "$HOME_CSS"
[ -z "$(tail -c1 "$HOME_CSS")" ] || echo >> "$HOME_CSS"
cat "$(dirname "$0")/tidy.css" >> "$HOME_CSS"

# The home page hides the Mini Games / Live Chat buttons above the menu only on very narrow phones
# (<= 420px), so on most phones they cover the menu icons. Hide them there on every phone width.
APP_TSX="$APP/src/App.tsx"
sed -i "s/route === '\/' \&\& window.innerWidth <= 420 \&\& window.scrollY < 480/route === '\/' \&\& window.innerWidth < 700 \&\& window.scrollY < 480/" "$APP_TSX"
grep -q "window.innerWidth < 700 && window.scrollY < 480" "$APP_TSX" || { echo "fixes.sh: floating button rule not found" >&2; exit 1; }

# The dancing sheep mascot: the original cut-out video shows a white box on Safari/iOS (no transparent
# video there) and has white wool holes. Use the re-cut animated WebP instead (see mascot-rekey.py);
# a still frame shows when the visitor prefers reduced motion.
cp "$(dirname "$0")/assets/kopi-menari-home-mascot.webp" "$(dirname "$0")/assets/kopi-menari-home-mascot-still.webp" "$(dirname "$0")/assets/domba-garut-ipad-v2.png" "$APP/public/assets/"

# The upstream favicon is a plain orange square; use the Garut Beans bean logo instead.
cp "$(dirname "$0")/assets/favicon.svg" "$APP/public/favicon.svg"
HOME_TSX="$APP/src/pages/home-page.tsx"
python3 - "$HOME_TSX" <<'PY'
import re, sys
p = sys.argv[1]; s = open(p).read()
if 'kopi-menari-home-mascot.webp' not in s:
    pat = re.compile(r"<video\s+className=\"gb-home-mascot-video\".*?</video>", re.S)
    new = ('<img\n          className="gb-home-mascot-video"\n'
           "          src={asset(CSS.supports('-webkit-touch-callout', 'none') ? 'domba-garut-ipad-v2.png' : reducedMotion ? 'kopi-menari-home-mascot-still.webp' : 'kopi-menari-home-mascot.webp')}\n"
           '          width={420}\n          height={438}\n          loading="lazy"\n          decoding="async"\n'
           '          alt="Domba Garut Beans menari sambil memegang secangkir kopi"\n        />')
    s, n = pat.subn(new, s)
    if n != 1: sys.exit("fixes.sh: mascot video not found")
s = s.replace("src={asset(reducedMotion ? 'kopi-menari-home-mascot-still.webp' : 'kopi-menari-home-mascot.webp')}",
              "src={asset(CSS.supports('-webkit-touch-callout', 'none') ? 'domba-garut-ipad-v2.png' : reducedMotion ? 'kopi-menari-home-mascot-still.webp' : 'kopi-menari-home-mascot.webp')}")
open(p, 'w').write(s)
PY
sed -i 's#aspect-ratio: 640 / 668;#aspect-ratio: 420 / 438;#' "$HOME_CSS"
python3 "$(dirname "$0")/presentation-fixes.py" "$APP"
