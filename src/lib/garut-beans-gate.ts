/** Browser-safe pieces of the Garut Beans password screen (strings only, no secrets). */
export const NAMA_KUKI = "gb_izin";
export const ALAMAT_BUKA = "/api/public/garut-beans-unlock";

/** Reads one cookie value out of a Cookie header. */
export function bacaKuki(header: string, nama: string): string {
  for (const bagian of header.split(";")) {
    const [kunci, ...sisa] = bagian.trim().split("=");
    if (kunci === nama) return sisa.join("=");
  }
  return "";
}

/** Only paths inside the sub-site may be used as the place to go after unlocking. */
export function jalurAman(next: string): string {
  const bersih = (next || "").trim();
  if (!bersih.startsWith("/garut-beans")) return "/garut-beans";
  if (bersih.startsWith("//") || bersih.includes("\\") || bersih.includes("?")) return "/garut-beans";
  return bersih;
}

/** The screen a visitor sees before the sub-site opens. It never contains the code. */
export function halamanKataSandi(next: string, pesan = ""): string {
  const tujuan = jalurAman(next).replace(/"/g, "%22");
  const peringatan = pesan
    ? `<p class="salah">${pesan.replace(/[<>&]/g, "")}</p>`
    : "";
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Kata sandi — Garut Beans</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
    background:#f6efe6;color:#3a2417;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
  .kotak{width:100%;max-width:380px;background:#fffdf9;border:1px solid #e4d5c2;
    border-radius:18px;padding:28px 26px;box-shadow:0 10px 30px rgba(58,36,23,.09)}
  .merek{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#8a6a4f;margin:0 0 6px}
  h1{font-size:22px;margin:0 0 10px}
  p{font-size:14px;line-height:1.55;color:#5c4635;margin:0 0 18px}
  label{display:block;font-size:13px;font-weight:600;margin:0 0 6px}
  input{width:100%;padding:12px 14px;font-size:16px;border:1px solid #cbb69c;border-radius:11px;
    background:#fff;letter-spacing:.18em}
  input:focus{outline:2px solid #7a4a24;outline-offset:1px}
  button{width:100%;margin-top:16px;padding:13px 16px;font-size:15px;font-weight:700;color:#fff;
    background:#7a4a24;border:0;border-radius:11px;cursor:pointer}
  button:hover{background:#653c1c}
  .salah{color:#a3341f;font-weight:600}
  .kecil{font-size:12px;color:#8a6a4f;margin:16px 0 0}
</style>
</head>
<body>
  <form class="kotak" method="POST" action="${ALAMAT_BUKA}">
    <p class="merek">Garut Beans</p>
    <h1>Masukkan kata sandi</h1>
    <p>Web ini sedang dibuka terbatas. Isi kata sandi yang diberikan pemilik usaha untuk masuk.</p>
    ${peringatan}
    <label for="kode">Kata sandi</label>
    <input id="kode" name="kode" type="password" inputmode="numeric" autocomplete="current-password" required autofocus>
    <input type="hidden" name="next" value="${tujuan}">
    <button type="submit">Masuk</button>
    <p class="kecil">Sekali masuk, webnya tetap terbuka di perangkat ini selama 30 hari.</p>
  </form>
</body>
</html>`;
}
