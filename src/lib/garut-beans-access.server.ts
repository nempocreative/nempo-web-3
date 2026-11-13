/** Server-only access code for the Garut Beans sub-site. Never import from browser code. */
const KODE_GARUT_BEANS = "161616";
const LAMBANG = "nempo-garut-beans-v1";

/** Compares a typed code without leaking how many characters were right. */
export function cocokkanKodeGarutBeans(kode: string): boolean {
  const dicoba = kode.trim();
  if (dicoba.length !== KODE_GARUT_BEANS.length) return false;
  let beda = 0;
  for (let i = 0; i < dicoba.length; i++) beda |= KODE_GARUT_BEANS.charCodeAt(i) ^ dicoba.charCodeAt(i);
  return beda === 0;
}

async function sha256(teks: string): Promise<string> {
  const bytes = new TextEncoder().encode(teks);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Value kept in the visitor's cookie; derived from the code so the code itself never ships. */
export async function tokenGarutBeans(): Promise<string> {
  return sha256(`${LAMBANG}:${KODE_GARUT_BEANS}`);
}

export async function cocokkanTokenGarutBeans(token: string): Promise<boolean> {
  if (!/^[0-9a-f]{64}$/.test(token)) return false;
  return token === (await tokenGarutBeans());
}
