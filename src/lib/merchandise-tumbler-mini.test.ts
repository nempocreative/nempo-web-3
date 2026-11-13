import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Owner rules for the mini tumbler card on /merchandise:
// price Rp70.000, the six spec lines exactly as the owner wrote them, and
// seven body colors that each have a real photo for both printed sides.

const page = readFileSync(resolve(process.cwd(), "src/pages/merchandise.tsx"), "utf8");

const WARNA = [
  "biru-dongkal",
  "putih",
  "hitam",
  "hijau-sage",
  "merah",
  "merah-muda",
  "silver",
];

describe("Merchandise tumbler mini Nempo", () => {
  it("shows the owner's price of Rp70.000", () => {
    expect(page).toContain('harga: "Rp70.000"');
  });

  it.each(["330 ml", "UV Print", "2 Sisi", "Premium Stainless", "Tutup motif kayu elegan", "Tali pegangan"])(
    "lists the spec line %s",
    (line) => {
      expect(page).toContain(`"${line}"`);
    },
  );

  it("offers all seven body colors", () => {
    for (const w of WARNA) expect(page).toContain(`slug: "${w}"`);
  });

  it("has a photo for every color on both printed sides", () => {
    for (const w of WARNA) {
      for (const sisi of ["tulisan", "logo"]) {
        const file = resolve(process.cwd(), `src/assets/tumbler-mini-nempo-${w}-sisi-${sisi}.webp`);
        expect(existsSync(file), `${w} / ${sisi}`).toBe(true);
      }
    }
  });

  it("prints light bodies in Nempo blue so the logo stays readable", () => {
    for (const w of ["putih", "silver"]) {
      expect(page).toMatch(new RegExp(`slug: "${w}".*cetak: "biru"`));
    }
    for (const w of ["biru-dongkal", "hitam", "merah"]) {
      expect(page).toMatch(new RegExp(`slug: "${w}".*cetak: "putih"`));
    }
  });
});
