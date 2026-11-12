import { createFileRoute } from "@tanstack/react-router";
import { garutBeansPage } from "@/lib/garut-beans-page";

// Garut Beans (G-Beans) is a separate static web app built into public/garut-beans/.
export const Route = createFileRoute("/garut-beans")({
  server: { handlers: { GET: async () => garutBeansPage() } },
});
