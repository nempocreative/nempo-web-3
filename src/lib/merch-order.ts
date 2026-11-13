import { NEMPO_WA_URL } from "@/lib/contact";

// Pesan WhatsApp untuk memesan merchandise yang sudah punya harga.
// Pesan terisi otomatis supaya admin langsung tahu barang, warna dan harganya.
export function pesanMerchText(p: { nama: string; harga: string; warna?: string }): string {
  return [
    "Halo Nempo, saya mau pesan merchandise:",
    `• Produk: ${p.nama}`,
    ...(p.warna ? [`• Warna: ${p.warna}`] : []),
    `• Harga: ${p.harga} / buah`,
    "• Jumlah: 1",
    "",
    "Mohon info cara pembayaran dan pengirimannya. Terima kasih!",
  ].join("\n");
}

export function pesanMerchWaUrl(p: { nama: string; harga: string; warna?: string }): string {
  return `${NEMPO_WA_URL}?text=${encodeURIComponent(pesanMerchText(p))}`;
}
