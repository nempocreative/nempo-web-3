import { Layout } from "@/components/layout";
import { PartnershipProposalForm } from "@/components/partnership-proposal-form";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { ArrowRight, CalendarDays, Check, ExternalLink, Globe, Lock, MapPin, Presentation } from "lucide-react";
import { PROGRAM_NEMPO, type ProgramNempo } from "@/data/program";

function InfoProgram({ p }: { p: ProgramNempo }) {
  const info = [
    { Icon: CalendarDays, label: "Tahun", value: p.tahun },
    { Icon: MapPin, label: "Lokasi", value: p.lokasi },
    p.tautanWeb
      ? { Icon: Globe, label: "Isi", value: p.jenis ?? "Situs web" }
      : { Icon: Presentation, label: "Isi", value: `${p.jumlahSlide} slide` },
  ];
  return (
    <dl className="grid grid-cols-3 gap-2">
      {info.map(({ Icon, label, value }) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <dt className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            <Icon className="h-3 w-3" /> {label}
          </dt>
          <dd className="mt-1 truncate text-[13px] font-semibold text-[#17233a]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

const kelasKartu =
  "group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl md:grid-cols-[1.05fr_1fr]";

function KartuProgramUtama({ p }: { p: ProgramNempo }) {
  if (p.tautanWeb) {
    // Website programs open in a new tab so the Nempo program page stays where it was.
    return (
      <a href={p.tautanWeb} target="_blank" rel="noopener noreferrer" className={kelasKartu}>
        <IsiKartuProgram p={p} />
      </a>
    );
  }
  return (
    <Link href={`/program/${p.slug}`} className={kelasKartu}>
      <IsiKartuProgram p={p} />
    </Link>
  );
}

function IsiKartuProgram({ p }: { p: ProgramNempo }) {
  return (
    <>
      <div className="relative aspect-video overflow-hidden bg-psg-bg md:aspect-auto md:min-h-full">
        <img
          src={p.sampul}
          alt={p.judul}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-psg-bg/90 via-psg-bg/25 to-transparent" />
        {p.terkunci && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-psg-bg/80 px-3 py-1.5 text-[11px] font-semibold text-psg-text backdrop-blur">
            <Lock className="h-3 w-3" /> Pakai kata sandi
          </span>
        )}
        <div className="absolute bottom-4 left-5 right-5 md:bottom-6 md:left-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-psg-accent">{p.mitra}</p>
          <p className="mt-1 font-psg-display text-2xl font-black leading-tight text-psg-text sm:text-3xl">{p.judul}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-7">
        <div>
          <p className="font-psg-display text-base italic leading-snug text-[#0F766E]">{p.tagline}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{p.ringkas}</p>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {p.sorotan.map((s) => (
            <li key={s} className="flex items-start gap-2 text-[13px] font-medium leading-5 text-slate-700">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E]">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {s}
            </li>
          ))}
        </ul>

        <InfoProgram p={p} />

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white transition group-hover:bg-[#0d6560]">
            {p.tautanWeb ? (
              <>
                Buka web <ExternalLink className="h-4 w-4" />
              </>
            ) : (
              <>
                Buka proposal <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </>
            )}
          </span>
          {p.terkunci && <span className="text-xs text-slate-500">Kata sandi diberikan oleh tim Nempo</span>}
          {p.tautanWeb && <span className="text-xs text-slate-500">Terbuka di tab baru</span>}
        </div>
      </div>
    </>
  );
}

export default function ProgramPage() {
  const [utama, ...lainnya] = PROGRAM_NEMPO;
  return (
    <Layout>
      <SEO
        title="Program Nempo Organizer"
        description="Program dan proposal kolaborasi Nempo Organizer, mulai dari Pasar Seni Garut 2027. Brand bisa langsung mengajukan kerja sama."
        keywords="program Nempo, Pasar Seni Garut, proposal kolaborasi Nempo, ajukan kerja sama sponsor Garut"
        path="/program"
      />
      <main className="min-h-screen bg-slate-50/60 pb-24 text-[#17233a]">
        <section className="text-white" style={{ background: "linear-gradient(145deg, #0F766E 0%, #14B8A6 100%)" }}>
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Nempo Organizer</p>
            <h1 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">Program</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Program yang sedang kami siapkan bersama mitra. Proposal lengkap bisa dibuka dengan kata sandi
              dari tim Nempo, dan brand bisa langsung mengajukan kerja sama lewat formulir di bawah.
            </p>
          </div>
        </section>

        <section className="mx-auto -mt-12 max-w-6xl px-4 sm:-mt-14 sm:px-6 lg:px-8">
          {utama && <KartuProgramUtama p={utama} />}

          {lainnya.length > 0 && (
            <div className="mt-6 grid gap-6">
              {lainnya.map((p) => (
                <KartuProgramUtama key={p.slug} p={p} />
              ))}
            </div>
          )}

          <div className="mt-10">
            <PartnershipProposalForm />
          </div>
        </section>
      </main>
    </Layout>
  );
}
