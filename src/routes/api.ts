import { createFileRoute } from "@tanstack/react-router";

import { api } from "#/server/api";

// app.fetch lets TanStack Start hand matching server requests to the Hono app.
// Docs: https://hono.dev/docs/api/hono
const handle = ({ request }: { request: Request }) => api.fetch(request);

// createFileRoute exposes the /api route as a server route in TanStack Router.
// Docs: https://github.com/TanStack/router/blob/main/docs/router/api/router/createFileRouteFunction.md
export const Route = createFileRoute("/api")({
  server: {
    handlers: {
      DELETE: handle,
      GET: handle,
      HEAD: handle,
      OPTIONS: handle,
      PATCH: handle,
      POST: handle,
      PUT: handle,
    },
  },
});
