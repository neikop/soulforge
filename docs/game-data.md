# Game data and browser progress

This document owns planner-specific rules, persistent identifiers and source provenance. Code structure and UI
conventions belong in [DESIGN.md](../DESIGN.md); the development workflow belongs in
[CONTRIBUTING.md](../CONTRIBUTING.md).

## Data ownership

| Module                                       | Owns                                                                              |
| -------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/views/Soulforge/data.ts`                | Gear slots, stat pools, matrix ratings, stat groups and Bracelet recommendations. |
| `src/views/Soulforge/types.ts`               | Soul Binding data shapes, tiers, tones and stored tab identifiers.                |
| `src/views/Soulforge/progress.ts`            | Soul Binding storage keys, parsing and legacy-key migrations.                     |
| `src/views/Soulforge/useProgress.ts`         | Soul Binding interaction state and browser persistence.                           |
| `src/views/GenusInsight/data.ts`             | Board definitions, slot targets, priorities, tiers and completion keys.           |
| `src/views/GenusInsight/useGenusProgress.ts` | Independent board progress, derived counts and browser persistence.               |

Keep definitions in these modules rather than copying pools, targets or counts into JSX or shared UI. The data modules
are authoritative for current values; this document records their contract and evidence, not a second target matrix.

## Soul Binding display contract

- The DPS Matrix has 17 gear slots and 11 stat columns. Unavailable ratings render as blank cells.
- Gear List uses one card per item, with two cards per row on desktop and one on narrow screens. Each card separates
  Attack and Defense; empty cards retain those columns and a minimum empty row of 24px.
- Armor, weapons and Guard show percentage lines. Earrings, Necklace and Rings also show their flat stat pools at tier A.
- Earring Move Speed % and Necklace Combat Speed % are tier S. Ring 1 and Ring 2 each include the recommended active
  skills Overhead Slam +1, Rending Blow +1 and Ruinous Blow +1 in the S+ attack group.
- The four display groups are S+, attack, defense and PVP. Group placement and an individual line's tier are separate
  concepts; flat accessory lines remain tier A even when grouped under attack, defense or PVP.
- `Unique` marks an exclusive stat line using the warning color. Recommended Ring active-skill lines do not receive
  that label because active-skill upgrades can also appear on weapons.
- Belt, Amulet and Bracelet have empty Gear List pools. Bracelet recommendations remain available in their own tab.
- Each stat appears once per item. Ring 1/2 and Earring 1/2 have separate selection keys and independent checkmarks.

## Genus Insight display contract

- Five boards have nine slot targets each, for 45 independent completion keys.
- Slot-specific targets and alternatives come from `data.ts`; do not infer a shared stat pool from a slot number alone.
- Tier colors express the planner's PvE priority: S+ for Slot 4, S for Slots 1/5, A+ for Slots 3/6/9 and A for HP/defense.
- A checkmark means the player considers a roll worth keeping. It does not describe an in-game lock or item rarity.
- Keep tier labels flat, beside the stat name, and keep target cards in the same table row equal in height.

## Browser progress

| Storage key                        | Value                                                                             | Owner                                  |
| ---------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------- |
| `aion2.gladiator.gear-owned.v1`    | Record of stat keys and boolean ownership values.                                 | Soul Binding progress parser and hook. |
| `aion2.gladiator.active-tab.v1`    | `dps`, `basic` or `bracelet`; `basic` is displayed as Gear List.                  | Soul Binding progress parser and hook. |
| `aion2.genus-insight.completed.v1` | Record of recognized board/slot keys whose value is `true`, such as `special\|4`. | Genus progress hook.                   |

Progress remains local to the browser origin. `localhost`, `127.0.0.1`, different ports and deployment domains do not
share localStorage. To transfer progress manually, export the values of the relevant keys from the old origin, set
the same keys at the destination origin and reload. Do not commit personal progress to the repository.

Malformed or unavailable storage must leave a usable checklist. Saving failures show the shared warning toast and
keep interaction available for the current session. Derive visible counts from recognized data keys rather than every
entry found in storage.

### Existing Soul Binding migrations

The parser preserves progress while applying these corrections:

- `earrings|...` becomes `earring-1|...`; `rings|...` becomes `ring-1|...`. The second item remains independent.
- `Attack increase` and `Defense increase` become `Attack Increase` and `Defense Increase` within keys.
- Helmet, Legs and Cloak keys ending in `Endurance` become `Endurance %`.
- Explicit values at the corrected key take precedence over a legacy key, including an explicit `false` value.
- Natural HP/MP Regen labels were expanded to Regeneration without changing their stored keys. Hidden flat-stat
  progress remains available if those lines are displayed again.

`pnpm test:matrix` covers the existing Soul Binding parser and migration behavior. A UI-only change must not rename
keys, merge the two paired items or reset stored progress. Add a deliberate migration and regression coverage when a
stored identifier actually needs to change.

## Sources and limitations

The entries below preserve the evidence recorded during earlier data work. This documentation reorganization does not
revalidate those sources or establish that every pool matches the latest game patch.

### Original snapshot

Soul Binding was migrated from `AION2_Gladiator_Soul_Binding_BIS_Matrix.html`, finalized on 2026-10-31. The original
authoring artifact was under `Documents/Codex/2026-10-30/k/outputs/`; it is not loaded by the app and is not a required
checkout dependency. Data was extracted into TypeScript during migration.

### Soul Binding pool review

Pool data was reviewed on 2026-10-31 using [Aion2.gg Soul Binding](https://aion2.gg/tools/soul-imprint) and its slot Range
tables, which identified EU/NA client 2.0.9.0 and an extraction date of 2026-10-28.

- Seven armor slots each had seven percentage lines; Weapons/Guard had five; Necklace/Earrings had one;
  Ring/Bracelet had none. Belt/Amulet stayed blank according to the chosen presentation.
- Accessory references: [Earrings](https://aion2.gg/tools/soul-imprint/earring),
  [Necklace](https://aion2.gg/tools/soul-imprint/necklace) and [Ring](https://aion2.gg/tools/soul-imprint/ring).
  Earrings/Necklace each had 16 numerical lines, including one percentage line; Ring had 15 flat lines. These tables
  did not list active-skill upgrades.
- Intelligence is grouped with Effect under PVP; Critical Hit Resist and Evasion appear on the defense side of that
  group. These placements are planner presentation decisions.

Ring skill upgrades were supported by the [LUM.GG Soul Binding guide](https://lum.gg/aion-2/guides/soul-binding-guide)
and the Gladiator +1 pool on [Abyssal Ring](https://aion2data.com/items/310330095-abyssal-ring). The three recommended
skills follow the [Gladiator guide](https://aion2-meta.com/guides/gladiator/); they are not the complete Ring skill pool.

### Tier interpretation

S+/S/A+/A grouping is a planner preference rather than a tier certified by the sources. PVP grouping includes Status
Effect Chance/Resist, Endurance Penetration, Perfect Resist, Double Resist, Multi-hit Resist and Weapon Damage Tolerance;
the grouping does not prove that every listed mechanic is PVP-only.

Critical Damage Tolerance remains in the exclusive S+ group under the selected display convention. The recorded
[Kanon testing guide](https://aion2simple.wiki/articles/damage-tolerance-endurance-and-combat-speed/) reported that
bosses lack Critical Hit, Weapon Damage Boost and Multi-hit. Endurance Penetration, Perfect Resist and Double Resist
did not have enough evidence in that review to prioritize for bosses. Other matrix ratings and Bracelet recommendations
were retained from the earlier snapshot during that pool review.

### Genus Insight reference

The current page cites [Kanon's Global Genus stat priorities](https://aion2simple.wiki/articles/global-genus-stat-priorities/).
The user's intended workflow is Asia PvE/boss DPS. The current implementation does not record a client version or an
Asia-specific verification date for that reference; do not treat the Global article as proof that every Asia stat pool
is identical. Verify the applicable in-game pool when changing board/slot mappings.

### Updating evidence

For a new data change, record the changed rule, source URL, region/client version when available, review date and any
remaining uncertainty here. Keep source facts, player priorities and display preferences distinguishable. Do not turn
an unverified community claim into a confirmed mechanic through a wording or UI change.
