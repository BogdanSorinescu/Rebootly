import { createFileRoute } from "@tanstack/react-router";

// createFileRoute maps this file to the /about route.
// Docs: https://github.com/TanStack/router/blob/main/docs/router/api/router/createFileRouteFunction.md
export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <h1 className="mb-3 text-3xl font-semibold">About</h1>
      <p className="text-slate-300">
        This is a small example app showing the project structure.
      </p>
    </section>
  );
}
