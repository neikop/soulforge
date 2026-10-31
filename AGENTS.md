# Repository Instructions

These instructions apply to the entire repository.

## Before editing

- Read `README.md` and `DESIGN.md`.
- Inspect the nearest implementation and run `git status --short`.
- Search for an existing component, hook, service, token, type, or helper before adding one.
- Keep feature logic local and shared code domain-neutral.

## While editing

- Use pnpm; do not switch package managers.
- Follow the ownership, naming, Props, React, TypeScript, and source-hygiene rules in `DESIGN.md`.
- Reuse Chakra primitives, semantic tokens, and existing shared components.
- Keep changes scoped and remove replaced code, stale imports, dead exports, debug output, and temporary scaffolding.
- Do not edit generated output, `dist/`, `node_modules/`, or `pnpm-lock.yaml` manually.
- Do not stage, unstage, commit, or push unless explicitly requested.

## Verification

- Theme changes: run `pnpm chakra-typegen` first.
- Run `pnpm check` before handoff; the pre-commit hook runs the same gate, so fix rather than bypass failures.
- Report any command that could not run and the exact reason.
