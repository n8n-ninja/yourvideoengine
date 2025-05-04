# Your Video Engine

**Your Video Engine** is a modular monorepo architecture built to support dozens of client projects, each with isolated frontends and a shared core of logic and tools.
Each client gets its own Remix-based frontend for full safety and deploy independence, while the shared logic lives in a central package, avoiding code duplication and simplifying updates.

---

## 🧠 Architecture Overview

```
/
├── scripts/              → Utility CLI scripts (deploy, launch client, etc.)
├── packages/
│   └── shared/           → Shared codebase: types, Supabase helpers, env tools
├── studios/
│   ├── client1/          → Independent Remix app for client1
│   ├── client2/          → ...
│   └── ...
├── connect/              → Central authentication/login project
├── remotion/             → Video rendering engine
├── frontend/             → Public landing page
└── pnpm-workspace.yaml   → Monorepo configuration
```

## 🌍 Local and Production URLs

**Production URLs:**

- Frontend: https://yourvideoengine.com
- Connect: https://connect.yourvideoengine.com
- Clients: https://client1.studio.yourvideoengine.com

**Local Development URLs:**

- Frontend: http://frontend.local:5000
- Connect: http://connect.local:3000
- Client1: http://client1.local:4000

---

## 🚀 Dev Shortcuts

These commands are defined via scripts in `scripts/` and aliased via `package.json`.

### ▶️ Start a studio (client frontend)

```bash
pnpm sc client1
```

> Starts the dev server for `/studios/client1`.
> Replace `client1` with your desired client slug.
> This will start the client, the connect project and watch the shared scripts.

---

### 🚀 Deploy a project

```bash
pnpm d client1
```

> Deploys a specific project (e.g. `connect`, `client1`, etc.)

---

### 🔁 Git add / commit / push

```bash
pnpm p "my commit message"
```

> Adds everything, commits with your message and pushes.
> If no message is given, defaults to current date.

---

## 📦 `@monorepo/shared` package

This is the heart of your architecture. It contains:

- ✅ Supabase server/client helpers (with cookie/session support)
- 🌐 Environment resolution (`getClientUrl`, `getConnectUrl`)
- 🧠 Shared types (`Database`, `Client`, etc.)
- 🧪 Testable and runtime-separated (`index.client.ts`, `index.server.ts`)
- 🌍 Cross-runtime compatible (Node + Edge)

### Build the shared package

```bash
pnpm --filter @monorepo/shared build
```

> This generates a compiled `dist/` folder from `src/`.

---

## 🛠️ Notes

- Uses **PNPM** as package manager
- **Remix** with `runtime: edge` where possible
- All **environment-aware** logic is runtime-safe (no `process.env` on client)
- Clear separation of server vs client files via `.server.ts` / `.client.ts`
- Uses **Vite** with **TypeScript paths** like `@monorepo/*` and `~/*`
- **ESLint and Prettier** compatible across all packages

---

## ✅ Why This Setup?

This architecture enables you to:

- Develop, build and deploy multiple client apps without risk of conflict
- Share logic between apps in a safe, type-checked way
- Scale to 10–100+ clients with minimal overhead
- Avoid redeveloping things like auth or Supabase config

> "Build once. Scale safely."
