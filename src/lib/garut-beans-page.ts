import { GARUT_BEANS_HTML } from "@/lib/garut-beans-shell";

/** Serves the Garut Beans sub-site page; its own router then shows the right screen for any /garut-beans/* path. */
export function garutBeansPage(): Response {
  return new Response(GARUT_BEANS_HTML, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
  });
}
