# Game data and browser progress

This document owns planner-specific rules, persistent identifiers and source provenance. Code structure and UI
conventions belong in [DESIGN.md](../DESIGN.md); the development workflow belongs in
[CONTRIBUTING.md](../CONTRIBUTING.md).

## Data ownership

| Module                                       | Owns                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/views/Soulforge/data.ts`                | Gear slots, stat pools, matrix ratings, stat groups and Bracelet recommendations.     |
| `src/views/Soulforge/types.ts`               | Soul Binding data shapes, tiers, tones and stored tab identifiers.                    |
| `src/views/Soulforge/progress.ts`            | Soul Binding storage keys, parsing and legacy-key migrations.                         |
| `src/views/Soulforge/useProgress.ts`         | Soul Binding interaction state and browser persistence.                               |
| `src/views/GenusInsight/data.ts`             | Board definitions, slot targets, priorities, tiers and completion keys.               |
| `src/views/GenusInsight/useGenusProgress.ts` | Independent board progress, derived counts and browser persistence.                   |
| `src/views/InteractiveMap/`                  | Map camera, clustering, layer filters, progress/import and server timer presentation. |
| `src/services/map.ts`, `public/map/`         | Local map HTTP boundary, immutable snapshot and attribution/hash manifest.            |

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

| Storage key                            | Value                                                                                             | Owner                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `aion2.gladiator.gear-owned.v1`        | Record of stat keys and boolean ownership values.                                                 | Soul Binding progress parser and hook. |
| `aion2.gladiator.active-tab.v1`        | `dps`, `basic` or `bracelet`; `basic` is displayed as Gear List.                                  | Soul Binding progress parser and hook. |
| `aion2.genus-insight.completed.v1`     | Record of recognized board/slot keys whose value is `true`, such as `special\|4`.                 | Genus progress hook.                   |
| `aion2.senseos.completed-pet-types.v1` | `{version:1, completed:[{name,at}]}`; legacy Console tracker format, normalized by pet type.      | Interactive Map.                       |
| `aion2.soulforge.map.v1`               | Versioned map settings, highlighted pet types, characters with done IDs, custom pins and presets. | Interactive Map.                       |

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

### Interactive Map

The `/interactive-map` renderer is an independent React implementation. It uses local assets rather than embedding or
running SenseOS application code. The snapshot dated **2026-11-01** contains 8,806 places and 428 pet rows:

| Zone                   | Places |                     Pet rows | Background                        |
| ---------------------- | -----: | ---------------------------: | --------------------------------- |
| Verteron               |  4,131 | 217 (109 distinct pet types) | Image + 256 high-resolution tiles |
| Altgard                |  4,032 |                          182 | Image + 256 high-resolution tiles |
| Chaotic Lower Reshanta |    623 |                           29 | Image + 256 high-resolution tiles |
| Poeta                  |      7 |                            0 | Regional outlines only            |
| Ishalgen               |     13 |                            0 | Regional outlines only            |

The default **World map** is a presentation of the three imaged zones, not an additional source snapshot. Chaotic
Abyss (the Lower Reshanta snapshot) sits above Verteron on the left and Altgard on the right. Their centers form an
equilateral triangle, and the three backgrounds have equal display sizes. This is an app layout, not a claim about
in-game geography. The five individual zone views remain available.

World composition transforms marker coordinates, spawn points, region outlines and labels together. Original marker
IDs and pet-type keys stay unchanged, so completion and highlights apply in both views. Area indices are remapped into
the combined area list. Pins are projected for display and converted back into original zone coordinates before saving;
no storage keys or existing records are migrated. Empty space between maps cannot receive a pin.

Pet completion uses `row.f.p.n`, normalized with NFKC, trimmed/collapsed whitespace and case folding. Monster names and
spawn IDs do not split a pet type: completing Sylphen completes all its named variants across zones. **Highlight** uses
the same normalized pet-type key in the optional `highlightedPets` map preference. Existing v1 settings/backups without
this field default to no highlights; no stored keys or completion records are migrated. Highlighted pets and their spawn
points stay visible in the current zone after closing the popup, selecting another place, changing layers or hiding
completed pets. Turning Highlight off restores normal filtering. Highlights are shared across characters and included
in map backups.

Markers keep one centered border in all four states: idle (neutral), active (primary), done (success), highlight
(warning), with priority **Highlight → Done → Active → Idle**. Check/star badges distinguish done/highlight beyond color.
Clusters keep different border states separate. **Hide pets done** removes completed pet-only groups except the current
selection and highlights. Ordinary place completion uses stable row IDs per character and the separate **Hide done**
setting. Custom pins and saved layer presets are local to the origin.

Popup selection is transient React state, independent of URL parameters. Loading or reloading the page starts with no
selection, including when an old URL contains `pin`. Only zone and layer filters read and update URL parameters.
The popup's spawn-point count comes from the selected row's `f.pts` array, matching that marker's spawn points.

Completed pet rows show the type's portrait and genus, with an icon action to mark it incomplete. The boot snapshot's
`pets` catalog is derived from all zone rows during sync, so portraits remain available after switching zones. Imported
types absent from the snapshot keep their name and completion record with a generic completed icon.

Export produces `{format:"soulforge-map", version:1, preferences, petProgress}`. Import validates the whole backup before
applying it, replaces map preferences and merges completed pet types. Legacy `{version:1,completed:[{name,at}]}` JSON is
also accepted, without replacing map settings. Invalid pet storage is preserved and pet toggles are blocked until a
valid backup is imported. Save failures keep current-session state and show a warning. No SenseOS-origin storage is
read automatically. Export on the old tracker and import on Soulforge to transfer progress.

`public/map/source.json` records exact source URLs, snapshot counts, SHA-256 hashes and rights. Source data credits
[SenseOS](https://senseos.gg/wiki/aion-2/interactive-map/),
[Yihao Liu / aion2-interactive-map](https://github.com/aion2-interactive-map/aion2-interactive-map) and
[jonboy648 / aion2-companion](https://github.com/jonboy648/aion2-companion), under
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). Preserve attribution and the noncommercial restriction.
Boss/pet spawn data credits [SkeeveAN](https://github.com/SkeeveAN/Aion-DPS-Meter). Map art belongs to NC; sharp tiles,
portraits and community drop rates are sourced through [MetaBot.GG](https://metabot.gg/en/aion-2/monsters). No independent
artwork license grant was verified. Upstream application source has a separate GPL-3.0 license; it is not distributed
here. The snapshot changes formatting/hosting and adds Soulforge's own rendering and progress behavior.

Schedules use the snapshot's IANA server timezones (Asia defaults to Asia/Tokyo) and are advisory community data, as are
drop percentages. They were not verified against a specific current client build. Poeta/Ishalgen image gaps are shown
explicitly; the renderer does not fabricate missing maps. Coordinates, names and drops can drift with game updates.

To update data and restore missing images, run `node scripts/sync-map-data.mjs`. Images are cached; add `--refresh` to
redownload all images too. Review resulting counts, attribution and source changes, then run `pnpm test:map` and the standard gate.
The sync tool validates safe local paths and WebP signatures, limits concurrency, retries and caches existing files.

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
