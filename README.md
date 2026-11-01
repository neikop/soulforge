# Soulforge

A browser-based AION 2 PvE planner built with React, TypeScript and Chakra UI. Track Soul Binding stats for Gladiator
and rolls worth keeping across the five Genus Insight boards, and explore a native interactive map with pet farming progress. Data is bundled with the app; no account or
backend is required.

## Get started

Use Node.js 22.x and pnpm 8.9.2, as declared in [package.json](package.json).

```sh
pnpm install
pnpm dev
```

Open [localhost:3008](http://localhost:3008). Installation also generates Chakra types through `postinstall`.
The planners do not require environment variables. If adding API-backed features, start with [.env.example](.env.example)
and the existing configuration under `src/config/`.

## Pages

| Route              | Page            | Purpose                                                                                    |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------ |
| `/`                | Soul Binding    | DPS Matrix, per-item Gear List checklist and Bracelet recommendations for Gladiator.       |
| `/genus-insight`   | Genus Insight   | Five boards with nine independent targets each, roll priorities and level 9 lock guidance. |
| `/interactive-map` | Interactive Map | Five zones, local map tiles, filters, spawn points, 10× zoom and progress by pet type.     |
| `/components`      | Component Guide | Interactive examples of shared UI, typography, theme tokens and component states.          |

All routes share a compact header, navigation, theme controls and workspace. The app defaults to dark mode and remembers
the selected mode. Wide tables scroll within their container on smaller screens. Tab indicators respect reduced motion.
UI copy uses English and preserves in-game stat names.

Checklists save to this browser's localStorage. Each ring, earring and Genus board is tracked independently. Storage is
specific to the origin: a different hostname, port or deployment has separate progress. See the
[data and progress contract](docs/game-data.md#browser-progress) before changing identifiers or migrating progress.

## Documentation

| Document                                            | Owns                                                                               |
| --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)                  | Development workflow, verification by change type and review checklist.            |
| [DESIGN.md](DESIGN.md)                              | Coding conventions, architecture, component APIs, styling and accessibility rules. |
| [AGENTS.md](AGENTS.md)                              | Repository-wide execution instructions for coding agents.                          |
| [docs/game-data.md](docs/game-data.md)              | Game-data ownership, display rules, persistence contracts and source provenance.   |
| [Component Guide](http://localhost:3008/components) | Live examples of the shared UI contract.                                           |

Runtime configuration remains authoritative for actual values: `package.json` owns commands and tool versions,
`src/components/theme/` owns styles, and feature data modules own planner targets. Update the relevant documentation
alongside changes instead of maintaining competing definitions.

## Source map

| Location                                       | Responsibility                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `src/App.tsx`, `src/routes/`                   | Route composition and route identifiers.                           |
| `src/views/Soulforge/`                         | Soul Binding data, rendering, search and checklist state.          |
| `src/views/GenusInsight/`                      | Genus targets, board matrix and independent progress.              |
| `src/views/InteractiveMap/`                    | Camera, clustering, filters, details, timers and map progress.     |
| `public/map/`                                  | Map snapshot, tiles, portraits and source manifest.                |
| `src/views/Component/`                         | Shared UI reference examples.                                      |
| `src/components/layouts/`                      | App shell and route headings.                                      |
| `src/components/theme/`                        | Semantic colors, typography, surface styles and Chakra recipes.    |
| `src/components/ui/`, `src/components/select/` | Domain-neutral controls and third-party adapters.                  |
| `src/components/app/`                          | Providers, global feedback and theme controls.                     |
| `src/services/`, `src/config/`, `src/store/`   | HTTP boundary, runtime configuration and cross-route client state. |
| `scripts/`                                     | Theme contrast checks and progress regression tests.               |
| `public/`                                      | Brand assets, favicons, home-screen icons and web manifest.        |

See [DESIGN.md](DESIGN.md#logic-ownership) before placing new logic or promoting a feature component to shared UI.

## Commands

| Command                          | Purpose                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm dev`                       | Start the local server on port 3008.                                                        |
| `pnpm chakra-typegen`            | Regenerate Chakra types after changing theme tokens, text styles or recipes.                |
| `pnpm check`                     | Run formatting, ESLint, contrast checks, TypeScript and the production build.               |
| `pnpm test:matrix`               | Run the existing browser-progress parsing and migration regression tests.                   |
| `pnpm test:map`                  | Test map camera, clustering, progress/import boundaries, timers and local image references. |
| `node scripts/sync-map-data.mjs` | Update map data and restore missing images; add `--refresh` to redownload all images.       |
| `pnpm format:check`              | Check repository formatting without modifying files.                                        |
| `pnpm lint:fix`                  | Apply safe ESLint fixes; review the diff afterward.                                         |
| `pnpm build`                     | Type-check and produce a production bundle in `dist/`.                                      |
| `pnpm preview`                   | Serve an existing production build locally.                                                 |

The pre-commit hook runs `pnpm check`. See [CONTRIBUTING.md](CONTRIBUTING.md#verification) for additional checks and browser
coverage required by the changed behavior. Static checks do not establish visual or keyboard accessibility correctness.

## Deployment

The repository uses Vercel's Git integration: pushes to the configured production branch `main` trigger production
builds; eligible branches and PRs receive preview deployments.

- Repository: [neikop/soulforge](https://github.com/neikop/soulforge)
- Production: [soulforge-eta.vercel.app](https://soulforge-eta.vercel.app)
- Build configuration: [vercel.json](vercel.json)

The SPA fallback supports direct navigation to the planners, Interactive Map and Component Guide while preserving asset and
API requests. Local project linkage lives in ignored `.vercel/`. Publishing and Git actions require an explicit request
when work is performed by an agent.

## Data provenance

Soul Binding was migrated from the finalized HTML snapshot dated 2026-10-31. A migration or UI refactor does not
revalidate game mechanics. Tiers express planner recommendations, not in-game rarity. Source regions, dates and
limitations are recorded in [docs/game-data.md](docs/game-data.md).

The map uses an attributed static snapshot dated 2026-11-01. Verteron, Altgard and Lower Reshanta have tiled images;
Poeta and Ishalgen have region outlines only. Pet completion is shared by exact pet type, while other place completion
is per character. Export/import under **Character, presets & backups** transfers progress between browsers and accepts
the earlier Console tracker's JSON. SenseOS storage cannot be read automatically from another origin. See the
[map data and progress contract](docs/game-data.md#interactive-map) for source licenses and update instructions.

The app started from [neikop/vite-2026](https://github.com/neikop/vite-2026), snapshot
`7f9d385e3d7d8262c2b56a8be8473abc3ef90652`, with independent Git history.
