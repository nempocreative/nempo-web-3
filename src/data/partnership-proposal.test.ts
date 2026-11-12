import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  budgetOptions,
  brandCategoryOptions,
  buildPartnershipMessage,
  collaborationOptions,
  emptyPartnershipProposal,
  partnershipProposalSchema,
  partnershipWaUrl,
} from "./partnership-proposal";
import { NEMPO_WA_URL } from "@/lib/contact";

const valid = {
  ...emptyPartnershipProposal,
  brand_name: "Kopi Sunda",
  contact_name: "Asep",
  whatsapp: "085724981356",
  email: "asep@kopusunda.id",
  brand_category: "Kopi & Cafe",
  collaboration_types: ["Sponsorship acara", "Booth & stand"],
  budget_range: "Rp 5 – 15 juta",
  message: "Mau jadi sponsor utama dan buka booth dua hari.",
};

const migration = readFileSync(
  resolve(process.cwd(), "docs/schema-baseline/0004_partnership_proposals.sql"),
  "utf8",
);

describe("formulir ajukan kerja sama", () => {
  it("menerima pengajuan brand yang lengkap", () => {
    const parsed = partnershipProposalSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("menolak isian yang belum benar", () => {
    for (const patch of [
      { brand_name: "K" },
      { contact_name: "A" },
      { email: "bukan-email" },
      { whatsapp: "123" },
      { brand_category: "" },
      { brand_category: "Kategori Ajaib" },
      { collaboration_types: [] },
      { collaboration_types: ["Cuci uang"] },
      { budget_range: "Rp 99 – 100 juta" },
      { message: "x".repeat(1501) },
    ]) {
      const parsed = partnershipProposalSchema.safeParse({ ...valid, ...patch });
      expect(parsed.success, JSON.stringify(patch)).toBe(false);
    }
  });

  it("menyertakan semua isian saat membuka WhatsApp", () => {
    const text = buildPartnershipMessage({
      brand_name: valid.brand_name,
      contact_name: valid.contact_name,
      whatsapp: valid.whatsapp,
      email: valid.email,
      brand_category: valid.brand_category,
      collaboration_types: valid.collaboration_types.join(","),
      budget_range: valid.budget_range,
      message: valid.message,
    });
    for (const part of ["Kopi Sunda", "Asep", "085724981356", "asep@kopusunda.id", "Kopi & Cafe", "Sponsorship acara", "Rp 5 – 15 juta"]) {
      expect(text).toContain(part);
    }
    const url = partnershipWaUrl({
      brand_name: valid.brand_name,
      contact_name: valid.contact_name,
      whatsapp: valid.whatsapp,
      email: valid.email,
      brand_category: valid.brand_category,
      collaboration_types: valid.collaboration_types.join(","),
    });
    expect(url.startsWith(`${NEMPO_WA_URL}?text=`)).toBe(true);
  });

  it("aturan di database sama dengan pilihan di formulir", () => {
    expect(migration).toContain("CREATE TABLE public.partnership_proposals");
    expect(migration).toContain("GRANT INSERT ON public.partnership_proposals TO anon");
    expect(migration).toContain('CREATE POLICY "Admins manage partnership proposals"');
    for (const option of brandCategoryOptions) expect(migration).toContain(`'${option}'`);
    for (const option of collaborationOptions) expect(migration).toContain(`'${option}'`);
    for (const option of budgetOptions) expect(migration).toContain(`'${option}'`);
    expect(migration).toContain("char_length(btrim(brand_name)) BETWEEN 2 AND 120");
    expect(migration).toContain("char_length(coalesce(message, '')) <= 1500");
    expect(migration).toContain("status = 'diajukan'");
    expect(migration).not.toMatch(/WITH CHECK\s*\(true\)/i);
    expect(migration).not.toContain("GRANT SELECT ON public.partnership_proposals TO anon");
  });
});
