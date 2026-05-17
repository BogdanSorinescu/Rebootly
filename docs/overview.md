## Setup

- Install [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
- Optional: install [opencode](https://opencode.ai/) if you want to use an AI coding agent.
- Copy the variables from [`.env.example`](../.env.example) into `.env.local` and fill in the Clerk and database values.
- Environment variables are validated in [`src/env.ts`](../src/env.ts); import
  `env` from there instead of reading `process.env` or `import.meta.env`
  directly.
- Run `npm install` from the project root to install dependencies.
- Run `npm run dev` to start the app on `http://localhost:3000`.

## Useful Commands

- `npm run dev` - start the development server - _this is the most important one_
- `npm run build` - build the app for production.
- `npm run test` - run tests.
- `npm run lint` - run ESLint.
- `npm run format` - format and fix lint issues.
- `npm run db:generate` - generate Drizzle migrations from the schema.
- `npm run db:migrate` - run database migrations.

[skim read docs on "npm run"](https://docs.npmjs.com/cli/v11/commands/npm-run). (essentially it acts as a shortcut for the commands in package.json.scripts)

## Files You Usually Do Not Need To Edit

- [`.gitignore`](../.gitignore) - tells Git which files to ignore.
- [`.prettierrc`](../.prettierrc) - Prettier formatting config.
- [`.prettierignore`](../.prettierignore) - files ignored by Prettier.
- [`eslint.config.js`](../eslint.config.js) - ESLint config.
- [`src/routeTree.gen.ts`](../src/routeTree.gen.ts) - generated TanStack Router file. Commit it, but do not edit it directly.
- [`drizzle.config.ts`](../drizzle.config.ts) - Drizzle ORM config, this saves us from having write raw SQL
- [`package-lock.json`](../package-lock.json) - generated dependency lockfile.

## Files We Actually Work In

- [`src/routes`](../src/routes) - page routes for the app.
- [`src/routes/__root.tsx`](../src/routes/__root.tsx) - root layout, navigation, global styles, and Clerk provider setup.
- [`src/routes/index.tsx`](../src/routes/index.tsx) - home page.
- [`src/routes/about.tsx`](../src/routes/about.tsx) - about page.
- [`src/routes/products.tsx`](../src/routes/products.tsx) - products page.
- [`src/routes/user.$id.tsx`](../src/routes/user.$id.tsx) - user page route with a dynamic `id` parameter.
- [`src/routes/api.$.ts`](../src/routes/api.$.ts) - forwards `/api/*` requests to the Hono API.
- [`src/server/api.ts`](../src/server/api.ts) - Hono API routes.
- [`src/db/schema.ts`](../src/db/schema.ts) - database table definitions.
- [`src/db/index.ts`](../src/db/index.ts) - database connection.
- [`src/integrations/clerk/provider.tsx`](../src/integrations/clerk/provider.tsx) - Clerk provider integration.
- [`src/env.ts`](../src/env.ts) - environment variable validation.
- [`src/styles.css`](../src/styles.css) - global styles.
- [`src/router.tsx`](../src/router.tsx) - TanStack Router setup.

## Project Structure

- Frontend pages are in [`src/routes`](../src/routes).
  - Note: we call it "the frontend", but it is atually initially ran and rendered on the server
- API logic is in [`src/server/api.ts`](../src/server/api.ts).
  - Think of this as a "traditional" backend service, but we use [Hono RPC](https://hono.dev/docs/guides/rpc) to call endpoints to ensure typesafety
- Database schema and connection code are in [`src/db`](../src/db).
- Generated database migrations are in [`drizzle`](../drizzle).

## Main Technologies

- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/) for the web app.
- [TanStack Router](https://tanstack.com/router/latest) and [TanStack Start](https://tanstack.com/start/latest) for routing and app structure.
- [Hono](https://hono.dev/) for API routes.
- [Drizzle ORM](https://orm.drizzle.team/) and [PostgreSQL](https://www.postgresql.org/) for the database.
- [Clerk](https://clerk.com/) for authentication.
- [Tailwind CSS](https://tailwindcss.com/) greatly simplifies styling.
