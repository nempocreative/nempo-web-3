import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  cocokkanKodeGarutBeans,
  cocokkanTokenGarutBeans,
  tokenGarutBeans,
} from "./garut-beans-access.server";
import { NAMA_KUKI, bacaKuki, halamanKataSandi, jalurAman } from "./garut-beans-gate";

describe("Garut Beans sub-site password", () => {
  it("opens the web with 161616", () => {
    expect(cocokkanKodeGarutBeans("161616")).toBe(true);
  });
  it("ignores spaces typed around the code", () => {
    expect(cocokkanKodeGarutBeans(" 161616 ")).toBe(true);
  });
  it("rejects a wrong, partial or empty code", () => {
    expect(cocokkanKodeGarutBeans("161617")).toBe(false);
    expect(cocokkanKodeGarutBeans("16161")).toBe(false);
    expect(cocokkanKodeGarutBeans("1616161")).toBe(false);
    expect(cocokkanKodeGarutBeans("")).toBe(false);
    expect(cocokkanKodeGarutBeans("pilih")).toBe(false);
  });
  it("remembers an unlocked visit with a cookie token, and nothing else", async () => {
    const token = await tokenGarutBeans();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(await cocokkanTokenGarutBeans(token)).toBe(true);
    expect(await cocokkanTokenGarutBeans("0".repeat(64))).toBe(false);
    expect(await cocokkanTokenGarutBeans("bukan-token")).toBe(false);
    expect(await cocokkanTokenGarutBeans("")).toBe(false);
  });
  it("reads the cookie back out of a request header", () => {
    const header = `lain=1; ${NAMA_KUKI}=abc123; lainnya=2`;
    expect(bacaKuki(header, NAMA_KUKI)).toBe("abc123");
    expect(bacaKuki("lain=1", NAMA_KUKI)).toBe("");
  });
  it("only sends visitors back inside the sub-site", () => {
    expect(jalurAman("/garut-beans/catalog")).toBe("/garut-beans/catalog");
    expect(jalurAman("/garut-beans")).toBe("/garut-beans");
    expect(jalurAman("/beranda")).toBe("/garut-beans");
    expect(jalurAman("//contoh.com")).toBe("/garut-beans");
    expect(jalurAman("")).toBe("/garut-beans");
  });
  it("shows a password screen that never carries the code itself", () => {
    const html = halamanKataSandi("/garut-beans/catalog");
    expect(html).toContain('action="/api/public/garut-beans-unlock"');
    expect(html).toContain('name="kode"');
    expect(html).toContain('value="/garut-beans/catalog"');
    expect(html).not.toContain("161616");
  });
});

describe("Garut Beans after publishing", () => {
  it("has no public start page that would skip the password", () => {
    expect(existsSync("public/garut-beans/index.html")).toBe(false);
  });
});
