import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PROGRAM_NEMPO } from "@/data/program";

// Owner rule: the Pasar Seni Garut deck must not mention "ESSE" or "Juara" anywhere.
const dir = resolve(process.cwd(), "src/program/pasar-seni-garut");
const files = [
  "manifest.json",
  "deck.tsx",
  ...readdirSync(resolve(dir, "components")).map((f) => `components/${f}`),
  ...readdirSync(resolve(dir, "slides")).map((f) => `slides/${f}`),
];

describe("Pasar Seni Garut deck brand words", () => {
  it.each(files)("%s has no ESSE or Juara", (file) => {
    const text = readFileSync(resolve(dir, file), "utf8");
    expect(text).not.toMatch(/esse|juara/i);
  });

  it("program listing and page metadata have no ESSE or Juara", () => {
    const route = readFileSync(resolve(process.cwd(), "src/routes/program.pasar-seni-garut.tsx"), "utf8");
    expect(route).not.toMatch(/esse|juara/i);
    expect(JSON.stringify(PROGRAM_NEMPO)).not.toMatch(/esse|juara/i);
  });
});
