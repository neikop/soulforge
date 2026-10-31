# Common Components Plan

Status: implementation hardened and static-verified; manual browser QA pending

## Goal

Establish consistent defaults for the common Chakra surfaces identified in `DESIGN.md`: Table, Dialog, Drawer, Alert,
and Empty State. Feature code should receive stable semantic styling, density, interaction behavior, and accessibility
without repeating local overrides.

This work extends the existing Chakra API instead of creating a parallel UI library. Theme slot recipes own visual
defaults. A wrapper is added only when it removes repeated structure or enforces shared behavior.

## Implemented result

- App-owned slot recipes now extend or replace Chakra defaults for Table, Dialog, Drawer, Alert, and Empty State.
- `DialogContent` and `DrawerContent` own the repeated Portal -> Backdrop -> Positioner -> Content -> CloseTrigger
  composition while Chakra Root remains visible to consumers.
- Table, Alert, and Empty State stay on Chakra's public compound APIs and receive their defaults entirely from the theme.
- The `/components` guide documents tables, feedback surfaces, overlay placements, loading structure, empty results, and
  intentional live-region behavior.
- `AlertDialogProvider` consumes `DialogContent`, leaving one dialog composition source of truth.
- Complete compound controls now cover password visibility, switch anatomy, and radio item anatomy; consumers keep
  Chakra Root state APIs visible.
- Date controls cover a single ISO date, an ISO date range, and a timezone-neutral local date/time pair.
- `FileUploadField` covers controlled or uncontrolled selection, file constraints, removal, rejection feedback, and
  optional local image preview without owning API upload behavior.
- Searchable and clearable choices continue to use the existing React Select adapter under `components/select`; no
  parallel Native Select wrapper is introduced.
- `Pagination` now normalizes Chakra's page callbacks, uses the existing React Select adapter for optional page-size
  selection, and provides responsive controls without owning list fetching or table structure.

Static verification is complete through Chakra type generation and `pnpm check`. Keyboard, focus-return, responsive,
and light/dark visual QA must still be completed in a browser before a consuming product treats these surfaces as
release-ready.

## Scope boundaries

- Keep all APIs domain-neutral and independently usable.
- Preserve Chakra compound-component behavior, keyboard support, focus management, and controlled or uncontrolled state.
- Use semantic tokens, shared text styles, and named spacing or size tokens only.
- Keep `border.default` as the default subtle boundary; states may change color without changing border width.
- Give every interactive composition one semantic interaction owner. Its hit area, cursor, hover, active, focus-visible,
  disabled, and read-only behavior must cover the same intended surface without accidental layout stretch.
- Do not add product-specific columns, sorting, filtering, pagination query wiring, row selection, confirmation copy, or
  empty-state illustrations.
- Do not create wrappers that only rename Chakra primitives or apply visual props already owned by a recipe.
- Do not introduce a second overlay manager; generic dialogs and drawers must coexist with the current app-level alert
  dialog provider.

## Target architecture

| Surface     | Theme owner               | Shared wrapper                                                 | Initial default policy                              |
| ----------- | ------------------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| Table       | `table` slot recipe       | No generic data wrapper                                        | `md`, `outline`, non-striped, non-interactive       |
| Dialog      | `dialog` slot recipe      | `DialogContent` owns portal/backdrop/positioner/close behavior | `md`, centered, inside scroll                       |
| Drawer      | `drawer` slot recipe      | `DrawerContent` owns portal/backdrop/positioner/close behavior | `sm`, end placement                                 |
| Alert       | `alert` slot recipe       | None initially                                                 | `md`, subtle, block layout, semantic status palette |
| Empty State | `emptyState` slot recipe  | None initially                                                 | `md`, centered content                              |
| Pagination  | Chakra pagination anatomy | `Pagination` normalizes state callbacks and responsive layout  | `sm`, subtle borderless controls, result summary    |

The defaults above are the template baseline. Consumers may select an existing documented size, variant, placement, or
status, but should not restyle component slots locally unless a real product requirement cannot be represented by the
shared contract.

## Shared recipe foundation

- Focused recipe files live under `src/components/theme/recipes/`:
  - `table.recipe.ts`
  - `dialog.recipe.ts`
  - `drawer.recipe.ts`
  - `alert.recipe.ts`
  - `emptyState.recipe.ts`
- They are registered under `theme.slotRecipes` in `src/components/theme/index.ts` and exposed through the recipe barrel.
- Override only app-owned deltas from Chakra's recipes; retain Chakra's structural, motion, and accessibility behavior.
- Map typography to `meta`, `body`, `title`, and action text styles instead of recreating raw font metrics.
- Use `bg.canvas`, `bg.subtle`, `bg.muted`, `fg.default`, `fg.subtle`, `fg.muted`, feedback palettes, and
  `border.default`; add a semantic token only when none of these expresses the required meaning.
- Keep light and dark mode behavior entirely token-driven.

## Milestone 1: Table — implemented

### Contract

- Style semantic table slots: root, caption, header, body, footer, row, column header, and cell.
- Keep the default table readable at `md` density with an outer boundary, a muted header, and row dividers.
- Preserve Chakra's existing `line` and `outline` variants and opt-in flags such as `interactive`, `striped`,
  `stickyHeader`, and `showColumnBorder`.
- Keep numeric alignment, column widths, truncation, and responsive overflow consumer-owned.
- Reuse `TableCellSkeleton` inside real table markup; loading rows must match loaded row height.
- Express empty and error results as full-width table rows containing shared Empty State or Alert content rather than
  replacing the table structure unexpectedly.

### Guide coverage

- Default table with header and body rows.
- Default outline and compact examples.
- Interactive, selected, and disabled-action rows where supported by the public API.
- Loading rows using `TableCellSkeleton` and an empty result row.
- Horizontally scrollable narrow viewport example without changing table semantics.

## Milestone 2: Dialog — implemented

### Contract

- Set consistent content radius, surface, shadow, header/body/footer spacing, title typography, backdrop, and close
  trigger placement through the slot recipe.
- Default to centered placement and inside scrolling so long content remains bounded by the viewport.
- Keep open state, initial focus, final focus, Escape behavior, outside interaction, and modal/non-modal mode owned by
  Chakra Root props.
- Add one shared content composition only if it owns the repeated Portal -> Backdrop -> Positioner -> Content structure
  and the standard close trigger. It must forward the content ref and relevant Chakra content props.
- Allow the close trigger to be omitted or disabled for guarded async flows without weakening focus or Escape policy
  silently.
- Migrate `AlertDialogProvider` to consume the shared recipe/composition where appropriate, preserving its
  `role="alertdialog"`, async confirmation lock, copy, and existing hook API.

### Guide coverage

- Controlled open/close example with focus returning to the trigger.
- Default title, description, body, footer actions, and close trigger.
- Long-content inside scrolling.
- Destructive/confirmation example via the existing alert dialog provider.
- Disabled async action state with stable footer geometry.

## Milestone 3: Drawer — implemented

### Contract

- Align backdrop, surface, shadow, header/body/footer spacing, title typography, and close trigger with Dialog.
- Default to end placement and `sm` size; retain start, top, bottom, full, and contained options from Chakra.
- Keep Drawer body as the scrolling region while header and footer remain stable.
- Add a content composition only for the repeated Portal -> Backdrop -> Positioner -> Content structure and standard
  close behavior; keep Root state and placement props visible to consumers.
- Preserve logical start/end properties for RTL support and Chakra's focus-return behavior.

### Guide coverage

- End drawer with header, scrollable body, footer actions, and close trigger.
- Alternate placement example.
- Controlled state and focus return.
- Narrow viewport/full-size behavior.

## Milestone 4: Alert and Empty State — implemented

### Alert contract

- Keep `info`, `success`, `warning`, `error`, and neutral statuses mapped to app semantic palettes.
- Support subtle, surface, outline, and solid variants with accessible contrast.
- Standardize indicator, title, description, optional action, and optional close-control alignment.
- Use semantic live-region behavior only when the message is asynchronous; static guidance must not announce itself on
  mount unnecessarily.
- Add a wrapper only if repeated dismiss/action behavior proves necessary; visual consistency belongs in the recipe.

### Empty State contract

- Keep centered content gap and root padding fixed across `sm`, `md`, and `lg`; size changes only indicator and text
  typography.
- Keep copy, icon or illustration, actions, and minimum reserved height consumer-owned.
- Require a meaningful title; decorative indicators remain hidden from assistive technology.
- Compose with Alert for recoverable error states instead of adding an error mode to Empty State.

### Guide coverage

- Alert status and variant matrix, including an asynchronous live-region example.
- Empty State sizes with icon, description, primary action, and optional secondary action.
- Empty, recoverable error, and loading-to-empty transitions with stable reserved geometry.

## Public API and source layout

- Keep visual-only surfaces imported directly from `@chakra-ui/react`; their app defaults come from the theme.
- Behavior-owning compositions live in `src/components/ui/Dialog/` and `src/components/ui/Drawer/`.
- Export only the behavior-owning component and its Props type from `src/components/ui/index.ts`; do not re-export every
  Chakra compound part under new names.
- Forward the relevant DOM ref and preserve `id`, `aria-*`, `data-*`, disabled state, and native event props.
- Add contextual JSDoc to every new public component.

## Milestone 5: Pagination — implemented

### Contract

- Treat `count` as total item count and expose one-based page values.
- Support Chakra's controlled and uncontrolled page and page-size state without exposing event-detail objects.
- Use the existing React Select adapter for optional page-size selection; do not introduce a Native Select variant.
- Show previous, next, page items, ellipsis, and a result range at full width; collapse page items to a compact counter
  below the small breakpoint.
- Keep tables and lists independent. URL/query synchronization, filter resets, server requests, loading state, and row
  rendering remain feature-owned.

### Guide coverage

- Controlled page and page-size state with a result summary.
- Default subtle borderless controls and an opt-in outline variant.
- Disabled zero-count boundary behavior.

## Maintenance sequence

Future changes to these surfaces must remain cohesive and leave one source of truth:

1. Add or update the slot recipe and register it in the theme.
2. Run `pnpm chakra-typegen` before relying on generated recipe or token types.
3. Change a behavior wrapper only when required by the surface contract.
4. Migrate an existing real consumer when available; do not leave duplicate implementations.
5. Add the representative `/components` guide section and navigation entry.
6. Verify that the semantic interaction owner matches the intended clickable area and owns the cursor and every visual
   interaction state; do not style only a nested part of a larger target.
7. Compare default, hover, active, focus-visible, disabled, and read-only states in light and dark mode. Hover must be
   visibly distinct, disabled and read-only must not retain enabled feedback, and no state may change geometry.
8. Search the changed surface for raw colors, numbered palettes, numeric font weights, raw text metrics, border
   shorthands, and repeated geometry.
9. Verify `git diff --check` and `pnpm check`.
10. Perform keyboard and responsive browser QA for overlays and interactive table states; report browser QA separately
    from static checks.

Recommended order for future cross-surface changes:

1. Table
2. Alert and Empty State
3. Dialog and `AlertDialogProvider` integration
4. Drawer

This order establishes non-overlay visual contracts first, then validates the higher-risk focus and portal behavior of
overlays.

## Definition of done

- All five surfaces have documented theme defaults and representative guide examples in light and dark mode.
- Feature examples use semantic tokens and avoid routine local slot overrides.
- Dialog and Drawer preserve keyboard navigation, visible focus, Escape handling, outside interaction policy, focus
  trapping, and focus return.
- Table examples preserve semantic table markup and loading/empty geometry.
- Alert status pairs pass contrast checks and asynchronous messages use an intentional live-region contract.
- Any shared wrapper has a small domain-neutral API, forwards refs and accessibility props, and removes actual repeated
  behavior rather than renaming Chakra.
- Interactive common components expose one intentional hit area with visible hover, active, and focus feedback, correct
  enabled/disabled/read-only cursors, and stable geometry in light and dark mode.
- `pnpm chakra-typegen`, `git diff --check`, and `pnpm check` pass.

## Deferred until product usage proves the contract

- Data-grid behavior: sorting, filtering, virtualization, resizing, pinning, and row selection.
- Product confirmation presets, destructive copy, permission rules, and mutation-specific error handling.
- Drawer navigation, forms, or route synchronization.
- Remote-file persistence, product upload endpoints, existing-logo hydration, and product-specific image processing.
- Empty-state illustrations and product-specific calls to action.
- Toast or notification-center changes; the existing shared toaster remains a separate concern.
