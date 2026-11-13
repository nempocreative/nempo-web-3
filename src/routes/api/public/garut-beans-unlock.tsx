import { createFileRoute } from "@tanstack/react-router";
import { NAMA_KUKI, halamanKataSandi, jalurAman } from "@/lib/garut-beans-gate";

/**
 * Opens the Garut Beans sub-site for a visitor who types the right code.
 * The code is compared on the server and never sent to the browser; a cookie
 * then remembers the visit for 30 days.
 */
export const Route = createFileRoute("/api/public/garut-beans-unlock")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const data = await request.formData().catch(() => null);
        const kode = String(data?.get("kode") ?? "");
        const next = jalurAman(String(data?.get("next") ?? "/garut-beans"));
        const { cocokkanKodeGarutBeans, tokenGarutBeans } = await import(
          "@/lib/garut-beans-access.server"
        );

        if (!cocokkanKodeGarutBeans(kode)) {
          await new Promise((r) => setTimeout(r, 500)); // slow down guessing
          return new Response(halamanKataSandi(next, "Kata sandi belum tepat. Coba lagi."), {
            status: 401,
            headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
          });
        }

        const token = await tokenGarutBeans();
        const https = new URL(request.url).protocol === "https:";
        const kuki =
          `${NAMA_KUKI}=${token}; Path=/garut-beans; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}` +
          (https ? "; Secure" : "");
        return new Response(null, {
          status: 303,
          headers: { Location: next, "Set-Cookie": kuki },
        });
      },
    },
  },
});
