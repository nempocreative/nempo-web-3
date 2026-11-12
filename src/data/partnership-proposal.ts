import { z } from "zod";
import { NEMPO_WA_URL } from "@/lib/contact";

/**
 * Pilihan formulir "Ajukan Kerja Sama" di halaman /program.
 * Satu sumber untuk formulir, validasi, dan aturan di database
 * (docs/schema-baseline/0004_partnership_proposals.sql) — dijaga
 * src/data/partnership-proposal.test.ts supaya tidak pernah beda.
 */

export const brandCategoryOptions = [
  "Kuliner & F&B",
  "Kopi & Cafe",
  "Fashion & Apparel",
  "Kosmetik & Perawatan",
  "Ritel & UMKM",
  "Teknologi & Aplikasi",
  "Pendidikan & Sekolah",
  "Instansi & Pemerintah",
  "Media & Televisi",
  "Lainnya",
] as const;

export const collaborationOptions = [
  "Sponsorship acara",
  "Sponsorship produk",
  "Booth & stand",
  "Kerja sama konten",
  "Media partner",
  "Hadiah & doorprize",
  "Lainnya",
] as const;

export const budgetOptions = [
  "Belum ditentukan",
  "Barter produk / jasa",
  "Di bawah Rp 5 juta",
  "Rp 5 – 15 juta",
  "Rp 15 – 30 juta",
  "Di atas Rp 30 juta",
] as const;

export const proposalStatusOptions = ["diajukan", "diproses", "diterima", "ditolak"] as const;

export const partnershipProposalSchema = z
  .object({
    brand_name: z
      .string()
      .trim()
      .min(2, "Nama brand minimal 2 huruf")
      .max(120, "Nama brand maksimal 120 huruf"),
    contact_name: z
      .string()
      .trim()
      .min(2, "Nama PIC minimal 2 huruf")
      .max(100, "Nama PIC maksimal 100 huruf"),
    whatsapp: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s]{9,16}$/, "Nomor WhatsApp belum benar"),
    email: z
      .string()
      .trim()
      .email("Alamat email belum benar")
      .max(255, "Email terlalu panjang"),
    brand_category: z.string().min(1, "Pilih kategori brand"),
    collaboration_types: z
      .array(z.string())
      .min(1, "Pilih minimal satu bentuk kerja sama")
      .max(7, "Terlalu banyak bentuk kerja sama dipilih"),
    budget_range: z.string().optional(),
    message: z
      .string()
      .trim()
      .max(1500, "Usulan maksimal 1500 huruf")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!brandCategoryOptions.includes(data.brand_category as (typeof brandCategoryOptions)[number])) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["brand_category"], message: "Kategori brand belum benar" });
    }
    for (const picked of data.collaboration_types) {
      if (!collaborationOptions.includes(picked as (typeof collaborationOptions)[number])) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["collaboration_types"],
          message: "Bentuk kerja sama belum benar",
        });
        break;
      }
    }
    if (data.budget_range && !budgetOptions.includes(data.budget_range as (typeof budgetOptions)[number])) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["budget_range"], message: "Kisaran anggaran belum benar" });
    }
  });

export type PartnershipProposalForm = z.infer<typeof partnershipProposalSchema>;

export const emptyPartnershipProposal: PartnershipProposalForm = {
  brand_name: "",
  contact_name: "",
  whatsapp: "",
  email: "",
  brand_category: "",
  collaboration_types: [],
  budget_range: "",
  message: "",
};

export type PartnershipProposal = {
  brand_name: string;
  contact_name: string;
  whatsapp: string;
  email: string;
  brand_category: string;
  collaboration_types: string;
  budget_range?: string;
  message?: string;
};

/** Isi pesan WhatsApp yang disiapkan setelah formulir diisi. */
export function buildPartnershipMessage(p: PartnershipProposal) {
  const lines = [
    "Halo Nempo! Saya mau ajukan kerja sama untuk program Nempo (Pasar Seni Garut 2027).",
    "",
    `Brand: ${p.brand_name}`,
    `PIC: ${p.contact_name}`,
    `WhatsApp: ${p.whatsapp}`,
    `Email: ${p.email}`,
    `Kategori brand: ${p.brand_category}`,
    `Bentuk kerja sama: ${p.collaboration_types}`,
  ];
  if (p.budget_range) lines.push(`Kisaran anggaran: ${p.budget_range}`);
  if (p.message) lines.push(`Usulan: ${p.message}`);
  return lines.join("\n");
}

/** Tautan WhatsApp resmi Nempo dengan isian formulir sudah terisi. */
export function partnershipWaUrl(p: PartnershipProposal) {
  return `${NEMPO_WA_URL}?text=${encodeURIComponent(buildPartnershipMessage(p))}`;
}
