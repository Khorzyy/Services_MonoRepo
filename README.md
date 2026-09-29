# Mega Monorepo

This repository contains two web applications and a shared Express API:

- **Parkiren** (`apps/ParkirenFE`): parking operations interface for admins, owners, and staff.
- **OpenData** (`apps/OpenDataFE`): public data portal with admin tools for managing datasets.
- **Backend** (`apps/Backend`): API used by both frontends, with MongoDB, Supabase, MQTT, and Socket.IO integrations.

The apps are managed as a pnpm workspace and use Turborepo for common commands.

## Requirements

- Node.js 22
- pnpm 12.4.2 (the version is pinned in `package.json`)
- Credentials for the services needed by the backend when running it locally

## Install

From the repository root:

```sh
pnpm install --frozen-lockfile
```

## Run locally

Start the backend and frontends in separate terminals from the repository root:

```sh
pnpm --filter Backend dev
pnpm --filter parkirent dev
pnpm --filter my-app dev
```

The frontends use Create React App and run on ports 3001 (Parkiren) and 3000 (OpenData). The backend listens on port 5000 by default. Both frontends expect API URLs through `REACT_APP_BASE_URL` (Parkiren) and `REACT_APP_API_URL` (OpenData).

The backend reads its configuration from environment variables. Its source currently uses `MONGOURI`, `JWT_SECRET`, `FRONTEND_URL`, `PARKIRENTFRONTEND_URL`, `OPENDATAFRONTEND_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `MQTT_HOST`, `MQTT_PORT`, `MQTT_USER`, and `MQTT_PASS`. Create a local `apps/Backend/.env` with the credentials and frontend origins required by your setup; do not commit real credentials. MQTT connectivity is initialized by the backend, so local startup requires valid MQTT settings.

## Checks

```sh
pnpm test
pnpm build
```

These are the same test and production build checks run by the pull request workflow. The backend currently does not define its own test or build script, so prioritize the frontend test suites and builds; backend coverage is an ongoing maintenance area.

## Repository layout

```text
apps/
  Backend/      Express API and integrations
  OpenDataFE/   OpenData React application
  ParkirenFE/   Parkiren React application
.github/
  workflows/    Pull request checks
```

For contribution expectations and maintenance priorities, see [CONTRIBUTING.md](CONTRIBUTING.md).
