import { GARUT_BEANS_HTML } from "@/lib/garut-beans-shell";
import { NAMA_KUKI, bacaKuki, halamanKataSandi, jalurAman } from "@/lib/garut-beans-gate";

/**
 * Serves the Garut Beans sub-site page; its own router then shows the right screen for
 * any /garut-beans/* path. The page only opens for visitors who entered the code, which
 * is checked on the server and remembered in a cookie.
 */
export async function garutBeansPage(request: Request): Promise<Response> {
  const token = bacaKuki(request.headers.get("cookie") ?? "", NAMA_KUKI);
  const { cocokkanTokenGarutBeans } = await import("./garut-beans-access.server");
  if (token && (await cocokkanTokenGarutBeans(token))) {
    return new Response(GARUT_BEANS_HTML, {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
    });
  }
  return new Response(halamanKataSandi(jalurAman(new URL(request.url).pathname)), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
