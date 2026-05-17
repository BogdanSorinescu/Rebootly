import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  // TanStack Query keeps one QueryClient per app tree for shared cache state.
  // Docs: https://tanstack.com/query/latest/docs/framework/react/quick-start
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
          },
        },
      }),
  );

  // QueryClientProvider makes the query cache available to useQuery/useMutation.
  // Docs: https://tanstack.com/query/latest/docs/framework/react/quick-start
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
