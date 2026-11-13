import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";
export const Route = createFileRoute("/program/mojang-priangan")({
  head: () => ({ meta: [
    { title: "Pasanggiri Mojang Priangan 2027 — Wirahma Wanoja | Nempo Garut" },
    { name: "description", content: "Proposal lomba tari Sunda Pasanggiri Mojang Priangan: Wirahma Wanoja — Menari, Merawat Tradisi, Menginspirasi Generasi." },
    { property: "og:title", content: "Pasanggiri Mojang Priangan — Wirahma Wanoja" },
    { property: "og:description", content: "Rancangan program tari Sunda 2027: konsep, kategori, panggung, publikasi, dan peluang kolaborasi bersama Nempo Garut." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" },
  ], links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@400;600;700&display=swap" }] }),
  component: NempoShell,
});