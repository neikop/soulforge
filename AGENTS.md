# Repository Instructions

These instructions apply to the entire repository.

## Documentation map

- `README.md`: product overview, setup, routes, commands and source map.
- `CONTRIBUTING.md`: work sequence, verification matrix and review checklist.
- `DESIGN.md`: authoritative coding, ownership, Props, React, TypeScript, theme and accessibility conventions.
- `docs/game-data.md`: planner data, stored progress and source provenance.
- `/components`: live examples of the shared UI contract.

Keep each rule in its owning document and link to it instead of copying a competing version. Verify commands against
`package.json` and visual values against `src/components/theme/` before documenting them.

## Before editing

- Read `README.md`, `CONTRIBUTING.md` and the relevant sections of `DESIGN.md`.
- Run `git status --short`, inspect the existing diff and preserve work already present.
- Inspect the nearest implementation and its call sites.
- Search for an existing component, hook, service, token, type, or helper before adding one.
- Keep feature logic local and shared code domain-neutral.

## While editing

- Use pnpm; do not switch package managers.
- Follow the ownership, naming, Props, React, TypeScript, and source-hygiene rules in `DESIGN.md`.
- Reuse Chakra primitives, semantic tokens, and existing shared components.
- Reuse the common app shell and page header. Shared surface and interaction styling belongs in the theme.
- Keep product wording concise and in English; preserve in-game stat names.
- Read `docs/game-data.md` before changing planner data or progress. Keep stored keys stable and document intentional migrations.
- Update the owning documentation and `/components` examples when their contract changes.
- Keep changes scoped and remove replaced code, stale imports, dead exports, debug output, and temporary scaffolding.
- Do not edit generated output, `dist/`, `node_modules/`, or `pnpm-lock.yaml` manually.
- Do not stage, unstage, commit, push, create a PR or deploy unless explicitly requested.

## Verification

- After changing tokens, text styles, layer styles or recipes, run `pnpm chakra-typegen` before static checks.
- Run `pnpm check` before handoff; the pre-commit hook runs the same gate, so fix rather than bypass failures.
- Run `git diff --check` and the additional checks required by `CONTRIBUTING.md` for the changed behavior.
- Do not add tests that only mirror presentation; cover meaningful logic or persistence boundaries when affected.
- Review the final diff for scope, stale code, new warnings and documentation drift.
- Report what changed, which checks ran and any command that could not run with its exact reason. Distinguish static
  verification from browser, visual, keyboard and deployment verification.
