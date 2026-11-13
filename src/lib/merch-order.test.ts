import { describe, expect, it } from "vitest";
import { pesanMerchText, pesanMerchWaUrl } from "./merch-order";

describe("Pesan merchandise lewat WhatsApp", () => {
  it("opens the official Nempo WhatsApp number", () => {
    expect(pesanMerchWaUrl({ nama: "Tumbler", harga: "Rp70.000" })).toMatch(/^https:\/\/wa\.me\/6285724981356\?text=/);
  });

  it("fills in the product, chosen color and price", () => {
    const text = pesanMerchText({ nama: "Tumbler Mini Nempo — Dua Sisi", harga: "Rp70.000", warna: "Hijau Sage" });
    expect(text).toContain("Produk: Tumbler Mini Nempo — Dua Sisi");
    expect(text).toContain("Warna: Hijau Sage");
    expect(text).toContain("Harga: Rp70.000 / buah");
  });

  it("carries the message intact inside the link", () => {
    const url = pesanMerchWaUrl({ nama: "Tumbler", harga: "Rp70.000", warna: "Merah Muda" });
    const text = decodeURIComponent(url.split("?text=")[1]);
    expect(text).toBe(pesanMerchText({ nama: "Tumbler", harga: "Rp70.000", warna: "Merah Muda" }));
  });
});
