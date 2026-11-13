import { createFileRoute } from "@tanstack/react-router";
import { garutBeansPage } from "@/lib/garut-beans-page";

// Deep links like /garut-beans/catalog load the same page so a refresh never 404s.
export const Route = createFileRoute("/garut-beans/$")({
  server: { handlers: { GET: async ({ request }) => garutBeansPage(request) } },
});
