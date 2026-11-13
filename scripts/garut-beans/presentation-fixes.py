"""Repeatable presentation-only patches for the imported Garut Beans app."""
from pathlib import Path
import sys

app = Path(sys.argv[1])


def replace(path, old, new):
    text = path.read_text()
    if new in text:
        return
    if old not in text:
        raise SystemExit(f"Presentation patch missing in {path.name}: {old[:65]}")
    path.write_text(text.replace(old, new))


source = app / "src/App.tsx"
replace(source, "           <FloatingActions />", "          {/* Quick access lives in the footer, never over the page. */}")
replace(source, "Poin dan voucher pribadi tersimpan di akun Web yang terhubung.", "Akun pribadi, penyimpanan poin, dan penukaran voucher belum tersedia di versi ini.")
replace(source, "<span>Daftar akun pembeli</span>", "<span>Info akun pembeli</span>")
replace(source, "Sudah punya akun? Masuk", "Lihat status layanan akun")
replace(source, "Akses petani dan penyuluh di demo ini masih lokal di perangkat. Akun pembeli memakai login G-Beans yang terhubung.", "Akses demo petani dan penyuluh tersimpan di perangkat ini. Akun pribadi pembeli belum tersedia.")
replace(source, "<h3>Mulai kumpulkan poin</h3>", "<h3>Program poin segera hadir</h3>")
replace(source, "<p>Masuk untuk menyimpan 10 PT setiap panen dan menukar poin dengan voucher.</p>", "<p>Aturan poin dan hadiah dapat dilihat. Penyimpanan poin serta penukaran voucher belum tersedia.</p>")
replace(source, ": 'Tamu dapat melihat aturan dan pilihan hadiah; poin hanya terkumpul dan tersimpan setelah masuk.'", ": 'Ini pratinjau program poin. Belum ada saldo pribadi atau voucher yang dapat ditukar.'")
replace(source, "<h1>{mode === 'sign-up' ? 'Satu akun untuk ritual kopi pilihanmu.' : 'Selamat datang kembali.'}</h1>", "<h1>Akun pembeli segera hadir.</h1>")
replace(source, "<p>Masuk untuk menyimpan poin panen, voucher, dan aktivitas belanja pada akun Web-mu.</p>", "<p>Jelajahi kopi Garut, simpan favorit, dan susun keranjang tanpa akun.</p>")
replace(source, "Saldo lama dari browser ini dapat disalin satu kali ke akun. Saldo awal tidak dapat diverifikasi. Poin Web tetap terpisah dari aplikasi HP.", "Penyimpanan poin dan penukaran voucher belum tersedia. Favorit dan keranjang hanya tersimpan di perangkat ini.")

footer = app / "src/components/site-footer.tsx"
replace(footer, '      <div className="gb-footer-bottom">', '''      <div className="gb-footer-shortcuts" aria-label="Akses cepat">
        <button className="gb-footer-shortcut" onClick={() => onNavigate('/coffee-game')} aria-label="Buka Mini Games">
          <img src={asset('mini-games-icon.webp')} alt="" />
          <span>Mini Games</span>
        </button>
        <button className="gb-footer-shortcut" onClick={() => onNavigate('/support')} aria-label="Buka pusat bantuan">
          <img src={asset('faq-live-chat.webp')} alt="" />
          <span>Pusat bantuan</span>
        </button>
      </div>
      <div className="gb-footer-bottom">''')