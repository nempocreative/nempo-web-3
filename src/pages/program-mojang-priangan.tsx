import { Suspense, useEffect, useState, type FormEvent } from "react";
import { ChevronLeft, Lock, Loader2, CalendarDays, MapPin } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/wouter";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { bukaProposalProgram } from "@/lib/program-access.functions";
import photo from "@/assets/mojang-priangan-dance.jpg";
const Deck = lazyWithRetry(() => import("@/program/mojang-priangan/deck"));
const SESSION_KEY = "nempo-program-terbuka:mojang-priangan";

export default function ProgramMojangPage() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const check = useServerFn(bukaProposalProgram);
  useEffect(() => { try { setOpen(sessionStorage.getItem(SESSION_KEY) === "1"); } catch { /* private browsing */ } }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const result = await check({ data: { program: "mojang-priangan", kode: code } });
      if (result.ok) { setOpen(true); setCode(""); try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* private browsing */ } }
      else setError("Kata sandi salah. Coba lagi.");
    } catch { setError("Tidak bisa membuka proposal. Periksa koneksi lalu coba lagi."); }
    finally { setBusy(false); }
  };
  const lock = () => { setOpen(false); try { sessionStorage.removeItem(SESSION_KEY); } catch { /* private browsing */ } if (document.fullscreenElement) void document.exitFullscreen(); };
  return <Layout minimalChrome hideBottomNav><div className="mp-deck">
    {open ? <Suspense fallback={<div className="grid min-h-[100dvh] place-items-center">Memuat proposal…</div>}><Deck onKunci={lock} /></Suspense> : <div className="mp-gate -mb-20 lg:mb-0">
      <img src={photo} alt="Ilustrasi penari Sunda dengan sampur merah muda" width={1536} height={1024} className="mp-gate-photo" />
      <div className="mp-gate-shade" />
      <div className="relative mx-auto max-w-7xl px-6 py-6 sm:px-10">
        <Button asChild variant="outline"><Link href="/program"><ChevronLeft />Program</Link></Button>
        <div className="mp-gate-content"><p className="text-sm font-semibold text-primary">NEMPO GARUT · PROPOSAL KOLABORASI</p>
          <h1 className="mt-5 font-psg-display text-4xl font-bold leading-tight sm:text-6xl">Pasanggiri<br />Mojang Priangan</h1>
          <p className="mt-4 text-xl font-semibold text-primary sm:text-2xl">Wirahma Wanoja</p>
          <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">Menari, Merawat Tradisi, Menginspirasi Generasi</p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm"><span className="flex items-center gap-2"><CalendarDays size={16} />2027 · Tanggal menyusul</span><span className="flex items-center gap-2"><MapPin size={16} />Priangan · Lokasi opsional</span></div>
          <form onSubmit={submit} className="mt-8 max-w-sm border-t border-border pt-6"><label htmlFor="mp-code" className="mb-2 flex items-center gap-2 text-sm font-semibold"><Lock size={16} />Kata sandi proposal</label><div className="flex gap-2"><input id="mp-code" required type="password" maxLength={40} autoComplete="off" value={code} onChange={e => setCode(e.target.value)} aria-invalid={!!error} aria-describedby={error ? "mp-error" : undefined} className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-foreground" /><Button type="submit" disabled={busy} className="h-11">{busy ? <Loader2 className="animate-spin" /> : <Lock />}Buka proposal</Button></div>{error && <p id="mp-error" role="alert" className="mt-3 text-sm text-primary">{error}</p>}</form>
        </div><p className="pb-4 text-xs text-muted-foreground">24 slide · Rancangan program · Visual ilustrasi AI</p>
      </div>
    </div>}
  </div></Layout>;
}