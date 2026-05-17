import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  // createRouter turns the generated route tree into the runtime router instance.
  // Docs: https://github.com/TanStack/router/blob/main/docs/router/api/router/createRouterFunction.md
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });
}

declare module "@tanstack/react-router" {
  // This module augmentation teaches TanStack Router this app's route types.
  // Docs: https://github.com/TanStack/router/blob/main/docs/router/routing/file-based-routing.md
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
