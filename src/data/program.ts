/** Browser-safe list of Nempo programs shown on /program. No access codes live here. */
export type ProgramNempo = {
  slug: string;
  judul: string;
  tagline: string;
  ringkas: string;
  mitra: string;
  tahun: string;
  lokasi: string;
  sampul: string;
  jumlahSlide: number;
  terkunci: boolean;
  sorotan: string[];
  /** When set, the card opens this web address in a new tab instead of a slide deck. */
  tautanWeb?: string;
  /** Short label for the third info box when the program is a website, e.g. "Situs web". */
  jenis?: string;
};

export const PROGRAM_NEMPO: ProgramNempo[] = [
  {
    slug: "pasar-seni-garut",
    judul: "Pasar Seni Garut 2027",
    tagline: "Karya dari Pasar Rakyat — Dari Tradisi Lahir Karya",
    ringkas:
      "Festival UMKM, budaya, dan komunitas yang menghidupkan lagi suasana pasar rakyat tempo dulu: kuliner tradisional, kaulinan barudak, panggung seni, dan produk kreatif lokal Garut.",
    mitra: "Nempo Garut",
    tahun: "2027",
    lokasi: "Garut, Jawa Barat",
    sampul: "/media/pasar-seni-garut/cover-hero.webp",
    jumlahSlide: 38,
    terkunci: true,
    sorotan: ["Pasar UMKM & Kampung Kuliner", "Heritage Stage & Kaulinan", "Duta Pasar Seni & Koin Nempo", "Rundown 3 hari"],
  },
  {
    slug: "garut-beans",
    judul: "Garut Beans (G-Beans)",
    tagline: "Kopi spesialti dari lereng gunung Garut",
    ringkas:
      "Situs web Garut Beans: katalog kopi Garut, cerita petani dan wilayah asal, paket hadiah, serta wisata kopi yang menghubungkan petani, mitra, dan pembeli.",
    mitra: "Garut Beans",
    tahun: "2026",
    lokasi: "Garut, Jawa Barat",
    sampul: "/garut-beans/assets/garut-beans-header.webp",
    jumlahSlide: 0,
    terkunci: false,
    sorotan: ["Katalog kopi Garut", "Cerita petani & wilayah", "Paket hadiah kopi", "Wisata kopi"],
    tautanWeb: "/garut-beans/",
    jenis: "Situs web",
  },
];

export function cariProgram(slug: string): ProgramNempo | undefined {
  return PROGRAM_NEMPO.find((p) => p.slug === slug);
}

/** Moves between slides without wrapping: the deck stops at the cover and the closing slide. */
export function geserSlideProgram(sekarang: number, arah: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(total - 1, Math.max(0, sekarang + arah));
}
