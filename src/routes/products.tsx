import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { db } from "#/db/index";
import { products } from "#/db/schema";

const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  return await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
  });
});

export const Route = createFileRoute("/products")({
  loader: async () => await getProducts(),
  component: ProductsPage,
});

function ProductsPage() {
  const router = useRouter();
  const productRows = Route.useLoaderData();
  const [apiStatus, setApiStatus] = useState("checking");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/health")
      .then((response) => response.json())
      .then((data: { ok: boolean }) => {
        if (!cancelled) setApiStatus(data.ok ? "online" : "offline");
      })
      .catch(() => {
        if (!cancelled) setApiStatus("offline");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      setMessage("Product name is required.");
      return;
    }

    form.reset();
    setMessage("Product created.");
    await router.invalidate();
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8">
      <div>
        <h1 className="mb-3 text-3xl font-semibold">Products</h1>
        <p className="text-slate-300">
          This page demonstrates server-side data loading and client-side API
          calls.
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
        <button className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950">
          Add product
        </button>
      </form>

      {message ? <p className="text-sm text-slate-300">{message}</p> : null}

      <ul className="space-y-2">
        {productRows.map((product) => (
          <li
            key={product.id}
            className="rounded-lg border border-white/10 px-4 py-3"
          >
            {product.name}
          </li>
        ))}
        {productRows.length === 0 ? (
          <li className="text-slate-400">No products yet.</li>
        ) : null}
      </ul>
    </section>
  );
}
