import { ClerkProvider } from "@clerk/clerk-react";
import type { ReactNode } from "react";

import { env } from "#/env";

export default function AppClerkProvider({
  children,
}: {
  children: ReactNode;
}) {
  // ClerkProvider supplies auth/session context to Clerk hooks and components.
  // Docs: https://clerk.com/docs/react/reference/components/clerk-provider
  return (
    <ClerkProvider
      publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
