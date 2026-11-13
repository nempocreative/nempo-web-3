import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/wouter";
import { geserSlideProgram } from "@/data/program";
import photo from "@/assets/mojang-priangan-dance.jpg";
import { MOJANG_SLIDES } from "./content";

export default function MojangDeck({ onKunci }: { onKunci: () => void }) {
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const [canFull, setCanFull] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const move = useCallback((direction: number) => setIndex(i => geserSlideProgram(i, direction, MOJANG_SLIDES.length)), []);
  useEffect(() => {
    setCanFull(!!document.documentElement.requestFullscreen);
    const changed = () => setFull(document.fullscreenElement === container.current);
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,select,textarea,button,a")) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); move(1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); move(-1); }
      if (e.key === "Home") setIndex(0);
      if (e.key === "End") setIndex(MOJANG_SLIDES.length - 1);
    };
    document.addEventListener("fullscreenchange", changed);
    window.addEventListener("keydown", key);
    return () => { document.removeEventListener("fullscreenchange", changed); window.removeEventListener("keydown", key); };
  }, [move]);
  const toggle = () => { if (document.fullscreenElement) void document.exitFullscreen(); else void container.current?.requestFullscreen?.(); };
  const slide = MOJANG_SLIDES[index];
  if (!slide) return null;
  return <div ref={container} className="mp-deck psg-deck -mb-20 min-h-[100dvh] px-3 pb-6 pt-4 sm:px-6 lg:mb-0">
    <div className="psg-chrome mx-auto mb-4 flex max-w-[1600px] items-center gap-3">
      <Button asChild variant="outline"><Link href="/program"><ChevronLeft /> <span className="hidden sm:inline">Program</span></Link></Button>
      <div className="min-w-0 flex-1"><p className="truncate font-semibold">Mojang Priangan 2027</p><p className="truncate text-xs text-muted-foreground">Wirahma Wanoja · Nempo Garut</p></div>
      {canFull && <Button variant="outline" size="icon" title="Layar penuh" aria-label="Layar penuh" onClick={toggle}>{full ? <Minimize2 /> : <Maximize2 />}</Button>}
      <Button variant="outline" size="icon" title="Kunci proposal" aria-label="Kunci proposal" onClick={onKunci}><Lock /></Button>
    </div>
    <div className={`psg-stage mp-stage ${slide.photo ? "mp-photo-slide" : ""}`} role="region" aria-roledescription="slide" aria-label={`Slide ${index + 1} dari ${MOJANG_SLIDES.length}: ${slide.title.replaceAll("\n", " ")}`}
      onTouchStart={e => { const t = e.touches[0]; if (t) touch.current = { x: t.clientX, y: t.clientY }; }}
      onTouchEnd={e => { const t = e.changedTouches[0]; const start = touch.current; touch.current = null; if (t && start && Math.abs(t.clientX - start.x) > 45 && Math.abs(t.clientX - start.x) > Math.abs(t.clientY - start.y)) move(t.clientX < start.x ? 1 : -1); }}>
      {slide.photo && <><img src={photo} alt="Ilustrasi tari Sunda dengan busana hijau dan sampur merah muda" width={1536} height={1024} className="mp-slide-photo" /><div className="mp-photo-shade" /></>}
      <div className="mp-slide-body">
        <p className="mp-eyebrow">{slide.label}</p>
        <h1 className={index === 0 ? "mp-slide-title mp-cover-title" : "mp-slide-title"}>{slide.title}</h1>
        <p className="mp-slide-intro">{slide.intro}</p>
        <div className="mp-items">{slide.items.map((item, i) => <section key={item.title} className="mp-item"><span className="mp-item-number">{String(i + 1).padStart(2, "0")}</span><h2>{item.title}</h2><p>{item.text}</p></section>)}</div>
      </div>
      <footer className="mp-slide-footer"><span>NEMPO GARUT / WIRAHMA WANOJA</span><span>{slide.photo ? "Visual ilustrasi AI · Konsep proposal" : "Rancangan program · Detail final menyusul"}</span><span>{String(index + 1).padStart(2, "0")} / {MOJANG_SLIDES.length}</span></footer>
    </div>
    <div className="psg-chrome mx-auto mt-4 flex max-w-[1600px] items-center gap-3">
      <Button size="icon" aria-label="Slide sebelumnya" title="Slide sebelumnya" onClick={() => move(-1)} disabled={index === 0}><ChevronLeft /></Button>
      <label className="sr-only" htmlFor="mp-slide-select">Pilih slide</label>
      <select id="mp-slide-select" value={index} onChange={e => setIndex(Number(e.target.value))} className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground">{MOJANG_SLIDES.map((s, i) => <option key={s.label} value={i}>{String(i + 1).padStart(2, "0")} · {i === 0 ? "Cover · Lomba Tari 2027" : s.label.split(" / ")[1]}</option>)}</select>
      <span className="shrink-0 text-xs text-muted-foreground">{index + 1} / {MOJANG_SLIDES.length}</span>
      <Button size="icon" aria-label="Slide berikutnya" title="Slide berikutnya" onClick={() => move(1)} disabled={index === MOJANG_SLIDES.length - 1}><ChevronRight /></Button>
    </div>
    <nav aria-label="Bagian proposal" className="psg-chrome mx-auto mt-3 flex max-w-[1600px] flex-wrap gap-2">
      {[{ label: "Aturan peserta", section: "Kategori & kelayakan" }, { label: "Anggaran", section: "RAB · produksi" }, { label: "Paket sponsor", section: "Paket · Mitra Utama" }].map(part => <Button key={part.section} variant="outline" size="sm" onClick={() => { const target = MOJANG_SLIDES.findIndex(s => s.label.endsWith(` / ${part.section}`)); if (target >= 0) setIndex(target); }}>{part.label}<ChevronRight /></Button>)}
    </nav>
    {full && <div className="mp-full-controls"><Button size="icon" variant="outline" aria-label="Slide sebelumnya" disabled={index === 0} onClick={() => move(-1)}><ChevronLeft /></Button><Button size="icon" variant="outline" aria-label="Slide berikutnya" disabled={index === MOJANG_SLIDES.length - 1} onClick={() => move(1)}><ChevronRight /></Button><Button size="icon" variant="outline" aria-label="Keluar layar penuh" onClick={toggle}><Minimize2 /></Button></div>}
  </div>;
}