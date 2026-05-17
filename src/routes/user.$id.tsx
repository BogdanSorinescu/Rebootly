import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/user/$id")({
  component: UserPage,
});

function UserPage() {
  const { id } = Route.useParams();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <SignedOut>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">Sign in required</h1>
          <p className="text-slate-300">
            The /user/{id} route is protected and only shows its content to
            signed-in users.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-950">
              Sign in
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <SignedInUser id={id} />
      </SignedIn>
    </section>
  );
}

function SignedInUser({ id }: { id: string }) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      const token = await getToken();
      const response = await fetch("/api/me", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = (await response.json()) as {
        userId?: string;
        error?: string;
      };

      if (!cancelled) {
        setBackendStatus(
          response.ok
            ? `authenticated as ${data.userId}`
            : (data.error ?? "failed"),
        );
      }
    }

    loadMe().catch(() => {
      if (!cancelled) setBackendStatus("failed");
    });

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">User {id}</h1>
      <p className="text-slate-300">
        You are signed in as{" "}
        {user?.primaryEmailAddress?.emailAddress ?? user?.id}.
      </p>
      <p className="rounded-xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-300">
        Backend auth check: <span className="text-white">{backendStatus}</span>
      </p>
    </div>
  );
}
