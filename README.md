# Whitelabel car dealership software

A React + TypeScript car dealership application built with Vite, Tailwind CSS, and shadcn/ui.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (package manager)

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
