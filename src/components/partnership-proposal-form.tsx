import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Handshake, Loader2, MessageCircle, Send } from "lucide-react";
import { NEMPO_WA_NUMBER } from "@/lib/contact";
import {
  budgetOptions,
  brandCategoryOptions,
  collaborationOptions,
  emptyPartnershipProposal,
  partnershipProposalSchema,
  partnershipWaUrl,
  type PartnershipProposalForm,
} from "@/data/partnership-proposal";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17233a] outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500";
const optionClass = (active: boolean) =>
  `rounded-2xl border px-3 py-3 text-center text-xs font-bold transition sm:text-sm ${
    active
      ? "border-[#0F766E] bg-[#0F766E] text-white shadow-md shadow-[#0F766E]/20"
      : "border-slate-200 bg-slate-50 text-[#17233a] hover:border-[#0F766E]/40"
  }`;

type FieldErrors = Partial<Record<keyof PartnershipProposalForm, string>>;

/**
 * Formulir "Ajukan Kerja Sama" untuk brand dan mitra di halaman /program.
 * Isian divalidasi, salinannya disimpan ke database, lalu WhatsApp resmi
 * Nempo dibuka dengan pesan terisi otomatis.
 */
export function PartnershipProposalForm() {
  const [form, setForm] = useState<PartnershipProposalForm>(emptyPartnershipProposal);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [archived, setArchived] = useState(true);

  const updateField = <K extends keyof PartnershipProposalForm>(field: K, value: PartnershipProposalForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleCollaboration = (option: string) => {
    const picked = form.collaboration_types.includes(option)
      ? form.collaboration_types.filter((c) => c !== option)
      : [...form.collaboration_types, option];
    updateField("collaboration_types", picked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = partnershipProposalSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof PartnershipProposalForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const collaborationTypes = parsed.data.collaboration_types.join(",");
    const url = partnershipWaUrl({
      brand_name: parsed.data.brand_name,
      contact_name: parsed.data.contact_name,
      whatsapp: parsed.data.whatsapp,
      email: parsed.data.email,
      brand_category: parsed.data.brand_category,
      collaboration_types: collaborationTypes,
      budget_range: parsed.data.budget_range || undefined,
      message: parsed.data.message || undefined,
    });
    setWaUrl(url);
    // Dibuka di sini, masih dalam gestur klik, supaya tidak diblokir peramban.
    window.open(url, "_blank", "noopener,noreferrer");

    setSubmitting(true);
    const { error } = await supabase.from("partnership_proposals" as never).insert({
      brand_name: parsed.data.brand_name,
      contact_name: parsed.data.contact_name,
      whatsapp: parsed.data.whatsapp,
      email: parsed.data.email,
      brand_category: parsed.data.brand_category,
      collaboration_types: collaborationTypes,
      budget_range: parsed.data.budget_range || null,
      message: parsed.data.message || null,
    } as never);
    setSubmitting(false);
    setArchived(!error);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-[#0F766E]/15 bg-white p-6 text-center sm:p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F766E]/10">
          <CheckCircle2 className="h-8 w-8 text-[#0F766E]" />
        </div>
        <h3 className="mt-5 text-xl font-black text-[#17233a]">Pengajuan kerja sama sudah masuk!</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
          Terima kasih, {form.brand_name}. Isianmu sudah dibuka di WhatsApp Nempo — tinggal tekan kirim di
          sana supaya tim kami langsung membacanya.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0F766E]/25 transition hover:-translate-y-0.5 hover:bg-[#0d6560]"
        >
          <MessageCircle className="h-4 w-4" />
          Buka WhatsApp lagi
        </a>
        {!archived && (
          <p className="mt-3 max-w-sm text-[11px] leading-5 text-[#c2274f]">
            Salinan pengajuanmu belum tersimpan di arsip kami, tapi pesan WhatsApp-nya sudah terbuka.
            Kirimkan saja lewat WhatsApp.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setForm(emptyPartnershipProposal);
            setSubmitted(false);
            setWaUrl("");
            setArchived(true);
          }}
          className="mt-5 text-sm font-bold text-[#0F766E] underline-offset-4 hover:underline"
        >
          Kirim pengajuan lain
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#0F766E]/15 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0F766E]/10 text-[#0F766E]">
          <Handshake className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-black text-[#17233a]">Ajukan Kerja Sama</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Brand atau usaha kamu mau ikut Pasar Seni Garut 2027? Isi formulir ini — pengajuanmu langsung
            tersimpan dan dibuka di WhatsApp tim Nempo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="brand_name" className={labelClass}>
              Nama brand / usaha
            </label>
            <input
              id="brand_name"
              type="text"
              value={form.brand_name}
              onChange={(e) => updateField("brand_name", e.target.value)}
              placeholder="Contoh: Kopi Sunda"
              className={inputClass}
              maxLength={120}
            />
            {errors.brand_name && <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">{errors.brand_name}</p>}
          </div>
          <div>
            <label htmlFor="contact_name" className={labelClass}>
              Nama PIC
            </label>
            <input
              id="contact_name"
              type="text"
              value={form.contact_name}
              onChange={(e) => updateField("contact_name", e.target.value)}
              placeholder="Nama orang yang kami hubungi"
              className={inputClass}
              maxLength={100}
            />
            {errors.contact_name && (
              <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">{errors.contact_name}</p>
            )}
          </div>
          <div>
            <label htmlFor="whatsapp" className={labelClass}>
              Nomor WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              placeholder="08xxxxxxxxxx"
              className={inputClass}
              maxLength={16}
            />
            {errors.whatsapp && <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">{errors.whatsapp}</p>}
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="nama@email.com"
              className={inputClass}
              maxLength={255}
            />
            {errors.email && <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">{errors.email}</p>}
          </div>

          <div className="sm:col-span-2">
            <span className={labelClass}>Kategori brand</span>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {brandCategoryOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={form.brand_category === option}
                  onClick={() => updateField("brand_category", option)}
                  className={optionClass(form.brand_category === option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.brand_category && (
              <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">{errors.brand_category}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <span className={labelClass}>
              Bentuk kerja sama <span className="font-medium normal-case text-slate-400">(boleh lebih dari satu)</span>
            </span>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {collaborationOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={form.collaboration_types.includes(option)}
                  onClick={() => toggleCollaboration(option)}
                  className={optionClass(form.collaboration_types.includes(option))}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.collaboration_types && (
              <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">{errors.collaboration_types}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <span className={labelClass}>
              Kisaran anggaran <span className="font-medium normal-case text-slate-400">(opsional)</span>
            </span>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {budgetOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={form.budget_range === option}
                  onClick={() => updateField("budget_range", form.budget_range === option ? "" : option)}
                  className={optionClass(form.budget_range === option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.budget_range && <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">{errors.budget_range}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="message" className={labelClass}>
              Usulan kerja sama <span className="font-medium normal-case text-slate-400">(opsional)</span>
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Ceritakan yang kamu bayangkan: booth, logo di panggung, konten bareng, atau bentuk lain."
              rows={4}
              className={`${inputClass} resize-none`}
              maxLength={1500}
            />
            {errors.message && <p className="mt-1.5 text-xs font-semibold text-[#c2274f]">{errors.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F766E] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0F766E]/25 transition hover:-translate-y-0.5 hover:bg-[#0d6560] disabled:translate-y-0 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              Kirim pengajuan kerja sama
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
        <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
          Isianmu dibuka di WhatsApp resmi Nempo {NEMPO_WA_NUMBER} — tinggal tekan kirim. Datanya hanya
          dipakai untuk menghubungimu soal kerja sama.
        </p>
      </form>
    </div>
  );
}
