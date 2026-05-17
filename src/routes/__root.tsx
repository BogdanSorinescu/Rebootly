import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import type { ReactNode } from "react";

import ClerkProvider from "#/integrations/clerk/provider";
import QueryProvider from "#/integrations/query/provider";
import appCss from "#/styles.css?url";

// createRootRoute defines the top-level shell shared by every child route.
// Docs: https://github.com/TanStack/router/blob/main/docs/router/api/router/createRootRouteFunction.md
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rebootly Template" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <QueryProvider>
            <div className="min-h-screen bg-slate-950 text-slate-100">
              <header className="border-b border-white/10 bg-slate-950/80">
                <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                  <Link to="/" className="text-lg font-semibold">
                    Rebootly
                  </Link>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                    <Link to="/" activeProps={{ className: "text-white" }}>
                      Home
                    </Link>
                    <Link to="/about" activeProps={{ className: "text-white" }}>
                      About
                    </Link>
                    <Link
                      to="/products"
                      activeProps={{ className: "text-white" }}
                    >
                      Products
                    </Link>
                    <Link
                      to="/user/$id"
                      params={{ id: "me" }}
                      activeProps={{ className: "text-white" }}
                    >
                      User
                    </Link>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-950">
                          Sign in
                        </button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </nav>
              </header>
              <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
            </div>
          </QueryProvider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}
