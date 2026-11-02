# Contributing

This document owns the work sequence and verification process. Read [DESIGN.md](DESIGN.md) for coding conventions and
[docs/game-data.md](docs/game-data.md) when changing planner data or stored progress. Coding agents also follow
[AGENTS.md](AGENTS.md).

## Before making changes

1. Read [README.md](README.md), confirm the tool versions in `package.json` and use pnpm.
2. Run `git status --short` and inspect the existing diff. Preserve work already present in the checkout.
3. Read the nearest implementation and its call sites. Search for an existing component, token, recipe, type or helper
   before adding one.
4. Choose the owner using [DESIGN.md](DESIGN.md#logic-ownership). Keep feature behavior local; shared UI must remain
   domain-neutral.
5. Identify the behavior, persistence and UI contracts affected by the change. Keep the implementation and verification
   proportional to that scope.

## Implementation workflow

### Feature and data changes

- Add routes through `src/routes/` and `src/App.tsx`; reuse `AppLayout` and `PageHeader`.
- Keep planner definitions in their feature's `data.ts`, outside JSX. Derive counts and filtered results from those
  definitions instead of creating a second list.
- Treat stored identifiers as persistent data contracts. A copy edit must not silently rename keys or discard progress.
- For game-data changes, record the source, region/client version when known, verification date and uncertainty in
  [docs/game-data.md](docs/game-data.md). Separate source facts from planner preferences.
- Update the documentation that owns the changed contract; keep setup instructions and historical game evidence separate.

### UI and theme changes

1. Reuse a Chakra primitive or existing shared control.
2. For visual-only reuse, update a semantic token, layer style or recipe under `src/components/theme/`.
3. Create a shared component only when it owns reusable behavior or a stable composition; follow the public API and
   accessibility requirements in [DESIGN.md](DESIGN.md#props-and-component-dx).
4. Add or update a representative `/components` example for changed shared APIs and states.
5. Run `pnpm chakra-typegen` after the theme edit, before type-checking or building. Never patch generated types by hand.
6. Check the real feature as well as the guide. Use both themes and a narrow viewport when the changed surface supports
   them. Preserve keyboard operation, visible focus, reduced motion and control geometry.

For formatting, run `pnpm exec prettier --write <changed-paths>` on the files you edited. Use `pnpm lint:fix` when helpful
and inspect the resulting diff. Avoid unrelated formatting churn.

## Verification

Always run:

```sh
pnpm check
git diff --check
```

`pnpm check` runs format validation, ESLint, theme contrast checks, TypeScript and a production build in that order.
Some lint rules report warnings rather than failing the command; fix new warnings in the changed surface instead of
treating an exit code of zero as proof that every convention is satisfied.

Additional checks depend on the change:

| Change                                             | Additional verification                                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Theme tokens, text styles, layer styles or recipes | Run `pnpm chakra-typegen` before `pnpm check`; inspect affected states in light and dark mode.                                  |
| Soul Binding progress parser or migrations         | Run `pnpm test:matrix`; cover the changed migration or input boundary.                                                          |
| Stored keys, counts or planner data                | Verify independent selections, reload persistence and compatibility with existing keys; run progress tests when affected.       |
| Shared component API or behavior                   | Update `/components`; check supported keyboard, focus, disabled and controlled/uncontrolled states.                             |
| Layout or navigation                               | Check both planners, the guide, narrow-screen overflow, active tabs and direct route reloads.                                   |
| Filtering or checklist interaction                 | Check matching and empty results, toggling, live counts and reload persistence.                                                 |
| Interactive Map logic, data or progress            | Run `pnpm test:map`; check map tiles, type-wide completion, partial clusters, backups, direct links, zoom limits and Full size. |
| Documentation or editor configuration              | Check referenced local paths, commands and anchors; run the standard gate without changing application behavior.                |

Use the existing Node test setup for logic regressions under `scripts/`. The current `test:matrix` suite covers
Soul Binding progress parsing and migrations; it does not validate the complete stat pool or Genus recommendations.
Write tests for meaningful behavioral boundaries. Presentation-only changes do not need implementation-mirroring tests.

When checking progress in a browser, restore any checklist selections or theme preferences changed during verification.
Do not clear a user's localStorage to simplify a test. An isolated browser profile can be used when available.

Do not bypass hooks, silence diagnostics or weaken tools to make a check pass. Report a blocked check and its exact
reason. State browser, visual and accessibility coverage separately from static checks.

## Review checklist

- The change has one coherent purpose and preserves unrelated work.
- Ownership, naming, imports, Props and state management follow `DESIGN.md`.
- Shared visuals come from the theme; raw colors, copied control geometry and one-off global CSS were not introduced.
- Product copy is concise English, in-game stat names remain intact and stored keys stay compatible.
- Replaced code, stale imports, dead exports, temporary scaffolding and debug output are removed.
- Relevant documentation and Component Guide examples match the final implementation.
- Checks passed and any manual verification limits are recorded accurately.

## Git and delivery

Keep commits focused on the requested change. Describe the concrete behavior or rule that changed, then report the
checks performed and remaining limitations in the handoff or PR description.

Agents must not stage, unstage, commit, push, create a PR or deploy unless the user requested that action. Existing
uncommitted work remains intact. Do not use `--no-verify` to bypass the repository gate.
