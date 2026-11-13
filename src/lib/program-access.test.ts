import { describe, expect, it } from "vitest";
import { cocokkanKodeProgram } from "./program-access.server";

describe("program proposal access code", () => {
  it("opens Mojang Priangan with the shared proposal code and rejects other codes", () => {
    expect(cocokkanKodeProgram("mojang-priangan", "121212")).toBe(true);
    expect(cocokkanKodeProgram("mojang-priangan", "121213")).toBe(false);
    expect(cocokkanKodeProgram("mojang-priangan", "")).toBe(false);
  });
  it("opens Pasar Seni Garut with 121212", () => {
    expect(cocokkanKodeProgram("pasar-seni-garut", "121212")).toBe(true);
  });
  it("ignores spaces typed around the code", () => {
    expect(cocokkanKodeProgram("pasar-seni-garut", " 121212 ")).toBe(true);
  });
  it("rejects a wrong or partial code", () => {
    expect(cocokkanKodeProgram("pasar-seni-garut", "121213")).toBe(false);
    expect(cocokkanKodeProgram("pasar-seni-garut", "12121")).toBe(false);
    expect(cocokkanKodeProgram("pasar-seni-garut", "")).toBe(false);
  });
  it("rejects programs that have no code", () => {
    expect(cocokkanKodeProgram("lainnya", "121212")).toBe(false);
  });
});
