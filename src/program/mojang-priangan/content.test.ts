import { describe, expect, it } from "vitest";
import { MOJANG_SLIDES } from "./content";
import { cariProgram, geserSlideProgram } from "@/data/program";
describe("Mojang Priangan proposal", () => {
  it("registers a locked deck with the actual slide count", () => {
    const program = cariProgram("mojang-priangan");
    expect(program?.terkunci).toBe(true);
    expect(program?.jumlahSlide).toBe(MOJANG_SLIDES.length);
    expect(MOJANG_SLIDES.length).toBe(24);
  });
  it("keeps navigation within the new deck", () => {
    expect(geserSlideProgram(0, -1, MOJANG_SLIDES.length)).toBe(0);
    expect(geserSlideProgram(23, 1, MOJANG_SLIDES.length)).toBe(23);
    expect(geserSlideProgram(0, 1, MOJANG_SLIDES.length)).toBe(1);
  });
});