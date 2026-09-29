# Contributing

Thanks for helping maintain Mega Monorepo. Keep changes focused on a user-facing improvement, a defect, or a concrete maintenance need. A small verified fix is more useful than a commit made only to increase activity.

## Before changing code

1. Check the relevant app and existing tests before editing.
2. Keep changes within the affected app when possible; both frontends share the backend.
3. Never commit credentials, production data, or generated `build` output.

## Local workflow

Install dependencies from the repository root with `pnpm install --frozen-lockfile`. Use the scripts in the root `package.json` for workspace-wide checks:

```sh
pnpm test
pnpm build
```

You can run an app command directly with pnpm filters; see the root README for the app names and ports. Backend changes may require MongoDB, Supabase, or MQTT configuration. Do not put service secrets in code or test fixtures.

## Pull requests

- Explain the problem and the behavior that changed.
- List the app or API areas affected.
- Include steps to verify the change, and note checks you could not run.
- Add or update focused tests when behavior changes.
- Keep unrelated formatting or generated files out of the diff.

## Long-term maintenance priorities

Useful next steps for this repository include adding backend tests, documenting and validating environment configuration, removing stale Create React App boilerplate, and reviewing dependency/security alerts. Tackle these as separate changes so each can be reviewed and reverted independently.
