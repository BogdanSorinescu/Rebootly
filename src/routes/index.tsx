import { createFileRoute } from "@tanstack/react-router";

// createFileRoute maps this file to the app's index route (/).
// Docs: https://github.com/TanStack/router/blob/main/docs/router/api/router/createFileRouteFunction.md
export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
      <h1 className="text-4xl font-bold tracking-tight">hello world</h1>
    </section>
  );
}
