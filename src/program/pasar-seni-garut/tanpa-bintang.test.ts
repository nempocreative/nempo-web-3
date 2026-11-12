import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Owner rule: the Pasar Seni Garut deck must not show any star mark or star logo.
// Banned: star glyphs (★ ☆ ✦ ✧) and the lucide star-drawing icons (Star, Sparkles).
const dir = resolve(process.cwd(), "src/program/pasar-seni-garut");
const files = [
  "manifest.json",
  "deck.tsx",
  ...readdirSync(resolve(dir, "components")).map((f) => `components/${f}`),
  ...readdirSync(resolve(dir, "slides")).map((f) => `slides/${f}`),
];

const STAR_GLYPHS = /[\u2605\u2606\u2726\u2727]/;
const STAR_ICON = /\b(Star|Sparkles)\b/;

describe("Pasar Seni Garut deck has no star marks", () => {
  it.each(files)("%s has no star glyph", (file) => {
    const text = readFileSync(resolve(dir, file), "utf8");
    expect(text).not.toMatch(STAR_GLYPHS);
  });

  it.each(files)("%s does not import a star-drawing icon", (file) => {
    const text = readFileSync(resolve(dir, file), "utf8");
    const imports = text.match(/import\s*\{[^}]*\}\s*from\s*['"]lucide-react['"]/g) ?? [];
    for (const line of imports) expect(line).not.toMatch(STAR_ICON);
  });
});
