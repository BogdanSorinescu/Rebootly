import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getServerProducts = createServerFn({ method: "GET" }).handler(
  async () => {
    const [{ desc }, { db }, { products }] = await Promise.all([
      import("drizzle-orm"),
      import("#/db/index"),
      import("#/db/schema"),
    ]);

    const rows = await db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
    });

    return rows.map((product) => ({
      id: product.id,
      name: product.name,
      createdAt: product.createdAt?.toISOString() ?? null,
    }));
  },
);

// This route demonstrates server-side data fetching via a route loader.
export const Route = createFileRoute("/view-products")({
  loader: () => getServerProducts(),
  component: ViewProductsPage,
});

function ViewProductsPage() {
  const products = Route.useLoaderData();

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8">
      <div>
        <h1 className="mb-3 text-3xl font-semibold">View products</h1>
        <p className="text-slate-300">
          This page loads products in the route loader through a server
          function, so the initial product list is fetched on the server.
        </p>
      </div>

      <ul className="space-y-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="rounded-lg border border-white/10 px-4 py-3"
          >
            <div className="font-medium">{product.name}</div>
            {product.createdAt ? (
              <div className="mt-1 text-sm text-slate-400">
                Created {new Date(product.createdAt).toLocaleString()}
              </div>
            ) : null}
          </li>
        ))}
        {products.length === 0 ? (
          <li className="text-slate-400">No products yet.</li>
        ) : null}
      </ul>
    </section>
  );
}
