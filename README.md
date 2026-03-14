# Whitelabel car dealership software

A React + TypeScript car dealership application built with Vite, Tailwind CSS, and shadcn/ui.

## Prerequisites

- [Node.js](https://nodejs.org/) (v22.x)
- [Bun](https://bun.sh/) (package manager)

## Environment variables

Create your local env file from the template:

```sh
cp .env.example .env
```

Required values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Getting started

### 1. Install dependencies

```sh
bun install
```

### 2. Start the dev server

```sh
bun run dev
```

The app will be available at [http://localhost:8080](http://localhost:8080).

### 3. Build for production

This project uses Node version 22.22.1, make sure you are using the correct version (see `.nvmrc`):

```sh
nvm use
```

```sh
bun run build
```

Preview the production build:

```sh
bun run preview
```

## Testing

### Unit tests (Vitest)

```sh
bun run test
```

Watch mode:

```sh
bun run test:watch
```

### End-to-end tests (Playwright)

```sh
bunx playwright install   # first time only
bunx playwright test
```

## Linting

```sh
bun run lint
```

## Tech stack

- **Framework:** React 18 + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Routing:** React Router
- **State/data:** TanStack React Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Testing:** Vitest + Testing Library, Playwright
