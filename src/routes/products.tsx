import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";

import { apiClient } from "#/integrations/hono/client";

async function getProducts() {
  const response = await apiClient.api.products.$get();

  if (!response.ok) {
    throw new Error("Failed to load products.");
  }

  const data = await response.json();
  return data.products;
}

async function getApiHealth() {
  const response = await apiClient.api.health.$get();

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as { ok: boolean };
  return data.ok;
}

async function createProduct(name: string) {
  const response = await apiClient.api.products.$post({
    json: { name },
  });

  if (!response.ok) {
    throw new Error("Product name is required.");
  }
}

// createFileRoute registers this file as the /products route in TanStack Router.
// Docs: https://github.com/TanStack/router/blob/main/docs/router/api/router/createFileRouteFunction.md
export const Route = createFileRoute("/products")({
  component: ProductsPage,
});

function ProductsPage() {
  // useQueryClient exposes the shared cache so mutations can invalidate queries.
  // Docs: https://tanstack.com/query/latest/docs/framework/react/quick-start
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  // useQuery runs async reads and stores loading/error/data state in the cache.
  // Docs: https://tanstack.com/query/latest/docs/framework/react/quick-start
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  const healthQuery = useQuery({
    queryKey: ["api-health"],
    queryFn: getApiHealth,
  });
  // useMutation is for writes; onSuccess refreshes the affected query data.
  // Docs: https://tanstack.com/query/latest/docs/framework/react/quick-start
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      setMessage("Product created.");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const productRows = productsQuery.data ?? [];
  const apiStatus = healthQuery.isPending
    ? "checking"
    : healthQuery.data
      ? "online"
      : "offline";

  async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");

    try {
      await createProductMutation.mutateAsync(name);
    } catch {
      return;
    }

    form.reset();
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8">
      <div>
        <h1 className="mb-3 text-3xl font-semibold">Products</h1>
        <p className="text-slate-300">
          This page demonstrates TanStack Query data loading and mutations.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-300">
        Client-side fetch status:{" "}
        <span className="text-white">{apiStatus}</span>
      </div>

      <form
        onSubmit={handleCreateProduct}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          name="name"
          placeholder="New product name"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-400"
        />
        <button
          disabled={createProductMutation.isPending}
          className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createProductMutation.isPending ? "Adding..." : "Add product"}
        </button>
      </form>

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      {productsQuery.isError ? (
        <p className="text-sm text-red-300">Failed to load products.</p>
      ) : null}

      <ul className="space-y-2">
        {productRows.map((product) => (
          <li
            key={product.id}
            className="rounded-lg border border-white/10 px-4 py-3"
          >
            {product.name}
          </li>
        ))}
        {productsQuery.isPending ? (
          <li className="text-slate-400">Loading products...</li>
        ) : null}
        {!productsQuery.isPending && productRows.length === 0 ? (
          <li className="text-slate-400">No products yet.</li>
        ) : null}
      </ul>
    </section>
  );
}
