import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { apiClient } from "#/integrations/hono/client";

// createFileRoute registers this file as the dynamic /user/$id route.
// Docs: https://github.com/TanStack/router/blob/main/docs/router/api/router/createFileRouteFunction.md
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
  // useQuery handles the async backend auth check plus loading/error state.
  // Docs: https://tanstack.com/query/latest/docs/framework/react/quick-start
  const backendAuthQuery = useQuery({
    queryKey: ["backend-auth", user?.id],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.api.me.$get({
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error("error" in data ? data.error : "failed");
      }

      return data.userId;
    },
    enabled: Boolean(user?.id),
  });

  const backendStatus = backendAuthQuery.isPending
    ? "checking"
    : backendAuthQuery.isError
      ? backendAuthQuery.error.message
      : `authenticated as ${backendAuthQuery.data}`;

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
