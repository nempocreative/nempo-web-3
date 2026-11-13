import { describe, expect, it } from "vitest";
import { MOJANG_PLAN, MOJANG_SLIDES, MOJANG_SUBTOTAL, MOJANG_RESERVE, MOJANG_TOTAL, MOJANG_SPONSOR_TARGET } from "./content";
import { cariProgram, geserSlideProgram } from "@/data/program";
describe("Mojang Priangan proposal", () => {
  it("registers a locked deck with the actual slide count", () => {
    const program = cariProgram("mojang-priangan");
    expect(program?.terkunci).toBe(true);
    expect(program?.jumlahSlide).toBe(MOJANG_SLIDES.length);
    expect(MOJANG_SLIDES.length).toBe(42);
  });
  it("keeps navigation within the new deck", () => {
    expect(geserSlideProgram(0, -1, MOJANG_SLIDES.length)).toBe(0);
    expect(geserSlideProgram(41, 1, MOJANG_SLIDES.length)).toBe(41);
    expect(geserSlideProgram(0, 1, MOJANG_SLIDES.length)).toBe(1);
  });
  it("plans the dance competition for 2027", () => {
    expect(MOJANG_PLAN.year).toBe(2027);
    expect(cariProgram("mojang-priangan")?.tahun).toBe(String(MOJANG_PLAN.year));
  });
  it("adds all nine estimated budget lines and the ten-percent reserve", () => {
    expect(MOJANG_SUBTOTAL).toBe(80_000_000);
    expect(MOJANG_RESERVE).toBe(8_000_000);
    expect(MOJANG_TOTAL).toBe(88_000_000);
  });
  it("balances proposed sponsorship slots and other funding against the estimated budget", () => {
    expect(MOJANG_PLAN.sponsors.map(p => p.slots)).toEqual([1, 2, 3]);
    expect(MOJANG_SPONSOR_TARGET).toBe(80_000_000);
    expect(MOJANG_SPONSOR_TARGET + MOJANG_PLAN.otherFunding).toBe(MOJANG_TOTAL);
  });
});