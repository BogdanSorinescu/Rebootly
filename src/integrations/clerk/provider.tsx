import { ClerkProvider } from "@clerk/clerk-react";
import type { ReactNode } from "react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env.local file");
}

export default function AppClerkProvider({
  children,
}: {
  children: ReactNode;
}) {
  // ClerkProvider supplies auth/session context to Clerk hooks and components.
  // Docs: https://clerk.com/docs/react/reference/components/clerk-provider
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
}
