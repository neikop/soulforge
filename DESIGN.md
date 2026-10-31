# Source Code Rules

Coding contract for humans and agents. The goal is a codebase that stays clean, predictable, and easy to extend after
every change.

## Change discipline

- Read the nearest implementation before creating a new pattern.
- Search before adding a component, hook, service, token, type, helper, or dependency.
- Make the smallest cohesive change that satisfies the requirement.
- Preserve unrelated behavior and existing user changes.
- Do not add speculative abstractions, fallback layers, compatibility shims, or future-facing props.
- Do not weaken TypeScript, ESLint, Prettier, React Refresh, or build rules.

## Logic ownership

- Route-specific code belongs under `views/<Feature>/`; other feature code stays with its nearest domain owner.
- `components/ui` contains global common components only; they must be domain-neutral and usable without feature context.
- Components placed directly under `components/`, outside established infrastructure folders, own feature or business
  behavior and must not be imported by global common components.
- Specialized shared infrastructure such as `components/select`, `components/app`, `components/layouts`, and
  `components/theme` stays inside its named folder.
- Shared UI must not import feature types, services, stores, or route-level views.
- HTTP URLs, DTOs, and response normalization belong in `services/`.
- React Query owns server data, caching, loading, errors, refetching, and invalidation.
- React Hook Form owns form values, validation, touched state, and submission state.
- Zustand owns only cross-route client state; do not copy React Query or form state into a store.
- React Router and URL state own navigation and shareable filters.
- Local interaction state stays in the nearest component.
- Avoid circular dependencies, especially through barrel files.

## Naming and files

- Component files and component folders use PascalCase and match the primary public component: `OrderTable.tsx`,
  `components/ui/Skeleton/`.
- Feature folders use PascalCase: `views/Orders/`.
- Hooks use `use<Name>.ts`; stores use `<name>Store.ts`; recipes use `<name>.recipe.ts`.
- Non-component modules and structural folders use camelCase or lowercase.
- Types use PascalCase without `I` or `T` prefixes.
- Event props use `on<Event>`; internal handlers use `handle<Event>`.
- Boolean names use `is*`, `has*`, or `can*`.
- Use `UPPER_SNAKE_CASE` only for true module-level constants.
- Keep one primary component per file.
- Use `index.ts` only for a small stable public API; do not place unrelated implementation in barrels.
- Keep a self-contained single-file component directly in its owning folder.
- When a component needs multiple implementation files, create a folder named after the component, keep its related
  subcomponents, styles, types, and tests inside it, and expose only its public API through that folder's `index.ts`.
- Do not scatter a component's private implementation files beside unrelated components in the parent folder.

## Imports

- Import from the `src` base path; do not use `@/`.
- Use relative imports only within the same module or component directory.
- Prefer public barrels such as `components/ui` over deep implementation imports.
- Use `import type` for type-only imports.
- Let ESLint order imports.

## TypeScript

- Type component props, hook inputs, service boundaries, API payloads, and store state explicitly.
- Prefer inference for obvious local implementation details.
- Use `unknown` for untrusted input; avoid `any`.
- Prefer literal unions and `as const` objects over enums unless runtime enum behavior is required.
- Use discriminated unions for mutually exclusive states and prop combinations.
- Model nullability explicitly; avoid non-null assertions and broad type assertions.
- Do not use blanket suppression comments.
- A targeted `@ts-expect-error` must explain the expected incompatibility.
- Do not duplicate types unless a deliberate boundary maps one shape to another.

## React and component split

- Use function components and hooks.
- Keep render logic pure; never mutate props, query data, or store values.
- Derive values during render instead of storing duplicate derived state.
- Use effects only for external synchronization and always clean them up.
- Prefer event-driven updates over effects that watch state and trigger actions.
- Do not add `useMemo` or `useCallback` without a concrete reason.
- Use stable identifiers as list keys.
- Prefer composition over components with many interacting booleans.
- Split when a section has a distinct responsibility, state lifecycle, reusable API, or complex named branch.
- Do not split when extraction creates only a pass-through wrapper or hides feature ownership.
- Do not use line count as the reason to split.

## Props and component DX

- A component with three or more props must declare `type <ComponentName>Props` immediately above it; one or two simple
  props may use an inline object type.
- Export a reusable component's props type when consumers need it; do not use `React.FC`.
- Prefer optional props when a safe and unsurprising default exists.
- Event callbacks should normally be optional and invoked with optional chaining.
- Keep essential content, identifiers, and data required when no valid default exists; do not mark props optional merely
  to silence TypeScript.
- Apply defaults during destructuring or through the underlying primitive.
- Prefer `variant` or `status` unions over multiple style booleans.
- Callback payloads expose normalized consumer values, not internal implementation details.
- Forward refs for controls and focusable components.
- Preserve relevant `id`, `name`, `aria-*`, `data-*`, `disabled`, and `readOnly` props.

Value-owning shared components should support both modes when meaningful:

- Controlled mode uses `value`; uncontrolled mode omits it and initializes from `defaultValue`.
- Both modes invoke the same optional change callback.
- Treat `defaultValue` as initial state only and do not switch modes silently after mount.
- Prefer library-provided controllable-state utilities over custom synchronization.

Before creating or promoting a common component, choose the smallest correct abstraction:

- Use a Chakra primitive directly for standard layout and UI behavior.
- Add a theme recipe for a reusable visual variant with no new behavior or consumer API.
- Create a common component only for reusable behavior, a stable policy, or normalization of a third-party API.
- Keep business rules, domain models, and feature-specific composition local until a domain-neutral API is proven.
- Do not wrap `Box`, `Stack`, `Grid`, `Card`, or `Button` merely to rename it or apply a few style props.
- Shared components must remain independently usable, follow the controlled/uncontrolled rules when meaningful, forward
  refs and accessibility props, and expose a small stable API through the nearest barrel.
- Every public shared component must include concise JSDoc explaining its purpose, usage context, important state,
  layout, and accessibility assumptions, and non-obvious caveats; do not repeat information already clear from its types.
- When shared UI behavior or states change, update the `/components` guide in the same change.

### Common surface defaults

- Table, Dialog, Drawer, Alert, and Empty State receive app defaults through focused slot recipes in
  `components/theme/recipes`.
- Import Table, Alert, and Empty State directly from Chakra; their visual consistency belongs to the theme, while product
  data, actions, copy, sorting, filtering, pagination state and data wiring, and reserved height stay feature-owned.
- Use `Pagination` for domain-neutral page navigation, result summaries, responsive controls, and optional page-size
  selection. It stays independent from Table; features own query parameters, URL synchronization, and data fetching.
- Use `DialogContent` and `DrawerContent` for the standard Portal -> Backdrop -> Positioner -> Content -> CloseTrigger
  composition. Keep Chakra Root visible so open state, focus policy, dismissal, placement, size, and modal behavior remain
  explicit at the consumer.
- Do not create additional wrappers that mirror Chakra compound parts or duplicate these two overlay compositions.

## Theme, styling, and layout

- Reuse Chakra primitives and shared components before creating custom DOM or CSS.
- Use semantic tokens from `components/theme`; runtime UI must not use raw hex values or numbered palette steps.
- Prefer shared `textStyle` values and theme recipes over repeated style props.
- Keep hover, focus, active, loading, and disabled geometry stable.
- Use `Grid`, `SimpleGrid`, `Flex`, `Stack`, or `HStack` for layout and gaps for sibling spacing; the parent owns the
  spacing between children.
- Use padding inside a surface; reserve margin for exceptions such as `auto` centering.
- Keep `App.scss` for truly global styles only; avoid global component selectors and `!important`.
- Run `pnpm chakra-typegen` after changing tokens, text styles, or recipes.

### Theme source of truth and CSS ownership

- `components/theme` is the runtime source of truth for tokens, text styles, recipes, control geometry, and interaction
  styling. `DESIGN.md` defines policy and `/components` documents the public result; neither may invent values that
  differ from the theme.
- A change to a documented token, typography role, recipe, or shared component state must update the theme or component,
  the relevant `/components` example, and any affected numeric contract in this file in the same change.
- Chakra emits recipe styles inside cascade layers. Unlayered global CSS can override those recipes regardless of source
  order, so beyond the shared default border color and style, global rules must not set component-owned typography,
  geometry, color, border, or interaction properties.
- The global theme owns the default semantic border color and solid border style. Consumers normally specify only the
  required side-specific or complete `borderWidth`; use `borderColor` only for an intentional semantic state, and avoid
  the `border` shorthand because it resets the inherited border color.
- Never apply the `font` shorthand or global `font-size`, `font-weight`, or `line-height` declarations to `button`,
  `input`, `select`, or `textarea`. A global form-control reset may inherit `font-family` only; text styles and recipes
  own all other typography metrics.
- Third-party adapters that cannot consume `textStyle` directly must resolve the same theme tokens at their boundary;
  they must not introduce parallel raw font sizes, line heights, or font weights.
- Shared control heights use `sizes.control.*`; compound-control internal geometry uses named theme size and spacing
  tokens before a third-party adapter resolves them to CSS values.

### Brand and semantic tokens

- Define the brand palette, fonts, radii, shadows, and density in `components/theme`, then map them to stable semantic
  tokens such as `primary.*`, `bg.*`, `fg.*`, and `border.*`.
- Runtime components must not reference product-specific color names, numbered palette steps, or raw color values.
- Keep feedback colors semantic and product-independent: `success`, `warning`, `error`, and `info`.
- Rebranding should primarily change the theme; dark mode must use complete semantic-token conditions rather than
  scattered feature-level `_dark` overrides.
- Neutral and feedback semantic tokens must define complete `_light` and `_dark` values. The app follows the system mode
  by default and exposes an explicit mode control without changing component APIs.
- Use `border.default` for subtle dividers, surface boundaries, and idle form controls. Focus, invalid, selected, and other
  semantic states may replace it with their semantic border token without changing border width or geometry.
- Keep logos and illustrations in assets rather than the theme.
- Keep `components/theme/index.ts` as the assembly root; split tokens, text styles, and global CSS into focused modules
  when the file grows.
- Verify accessible contrast and every interaction state after changing brand colors or component recipes.
- Solid/contrast and small semantic text/background pairs must meet WCAG AA 4.5:1; active control boundaries must meet
  3:1 against adjacent surfaces. Keep both thresholds covered by `pnpm contrast:check`.

### Layout stability and Skeletons

- Idle and initial loading states for the same region must have exactly equal height and reserve the predictable loaded
  footprint.
- Use `Skeleton` for initial loading and make it match the final content's width, height, line count, and line height.
- A spinner or empty wrapper must not collapse reserved space; keep previous content during background refetches.
- Use the base `Skeleton` for standalone regions with explicit final geometry and its own shimmer. Use `SkeletonText` to
  reserve the line boxes of a supported semantic text style; its `size` and line count must match the loaded copy.
- Use `TableCellSkeleton` only inside the real table structure, with explicit width and height matching the final cell.
  It stays static while the owning table body or row applies one shared pulse, so cells animate together without
  replacing rows, columns, padding, or row height.

### Typography and control geometry

- Define every shared control height by size in its recipe and every shared text line height in `textStyle`; do not define
  them per screen or rely on browser defaults.
- Product UI uses only the semantic font weights `normal` (400), `mid` (600), and `bold` (700). Body copy uses `normal`,
  buttons and labels use `mid`, and titles use `bold`; do not use numeric weights or direct `medium`/`semibold` aliases in
  source code.
- Use content roles `meta` (12/16 mid), `bodyCompact` (12/16 normal), `body` (14/20 normal), `bodyLarge` (16/24 normal),
  `titleCompact` (14/20 bold), `title` (16/24 bold), `titleLarge` (20/28 bold), `sectionTitle` (24/32 to 30/36 bold), and
  `display` (30/36 to 48/56 bold). Controls use `actionCompact` (12/16 mid), `action` (14/20 mid), `actionLarge` (16/24
  mid), `field` (14/20 normal), and `fieldLarge` (16/24 normal). Add a semantic text role instead of recreating one of
  these combinations at a call site.
- Common components must preserve their outer dimensions across default, hover, focus, loading, and disabled states.
- For genuinely variable content, reserve a predictable `minHeight` and grow only when actual content requires it.

### Interactive component states

- Cover default, hover, active, and focus-visible states for every interactive control.
- Cover disabled, loading, invalid, and read-only states whenever the component API exposes them.
- Define the intended hit area on the semantic interaction owner. Content-sized controls such as switches and radio
  items must not stretch into an unintended full-row target; full-surface controls such as dropzones must apply the same
  interaction behavior across the entire clickable surface.
- Apply cursor and visual feedback to that same hit area, not only to a nested icon, label, button, or indicator. Enabled
  pointer targets use `pointer`; disabled targets use `not-allowed`; read-only surfaces must not imply click behavior.
- Hover must produce a visible semantic color change in both light and dark mode. Do not assign idle and hover states to
  tokens that resolve to the same appearance; pair background feedback with border, text, or icon feedback when one
  signal alone is too subtle.
- Suppress enabled hover and active styling for disabled and read-only states. Loading behavior must follow the public
  interaction contract and must not expose actions that are currently locked.
- Keep label typography, icon size, border width, padding, and outer geometry stable across states; a semantic state may
  change emphasis or feedback, not unexpectedly move surrounding content.
- Add representative states to `/components`; do not document or style a state that the public component cannot express.

## Accessibility

- Every form control needs an accessible label; a placeholder is not a label.
- Icon-only interactive controls need an `aria-label`.
- Associate helper and validation messages with their controls, and expose invalid state to assistive technology.
- Loading regions must expose their busy state on the owning semantic region; decorative Skeleton elements remain hidden
  from assistive technology.
- Toasts and other asynchronous feedback must use the shared live-region implementation instead of custom visual-only
  messages.
- Dialogs, drawers, and popovers must preserve keyboard navigation, focus management, Escape behavior, and focus return
  to the invoking control.
- Preserve keyboard interaction and visible focus indicators.
- Disable or simplify non-essential animation under `prefers-reduced-motion: reduce` without removing state feedback.

## Forms, data, and async behavior

- Reuse `FormField`, `InputNumber`, `PasswordInput`, the complete `Switch` and `RadioGroupItem` compositions, and the
  existing React Select wrappers.
- Use `DatePickerInput`, `DateRangePickerInput`, or `DateTimePickerInput` according to the value shape. Date-time values
  remain a local date/time pair until the owning feature applies an explicit timezone and API serialization policy.
- Use `FileUploadField` for local selection, constraints, removal, and preview. Upload requests, existing remote files,
  and domain validation stay feature-owned.
- Use `Pagination` for paged lists and tables. Treat `count` as the total item count and page values as one-based; keep
  server requests, filter resets, and URL state in the owning feature.
- Use React Hook Form `Controller` for controlled third-party inputs.
- Normalize optional, date, and formatted numeric values before calling services.
- Use the shared `apiClient`; do not create Axios clients inside features.
- Query hooks own stable query keys and request lifecycle.
- Do not mirror query loading or error state in local state.
- Guard duplicate mutations and form submissions with loading or disabled state.
- Handle loading, empty, error, retry, and success states intentionally.
- Use the shared toaster and alert dialog for global feedback.
- Never swallow errors silently or expose unsafe raw server errors.

## Source hygiene

- Delete dead code instead of commenting it out; do not leave debug logs, fake data, temporary flags, or experiments.
- A TODO must name the missing decision or dependency; comments explain why, not what readable code already says.
- Avoid vague dumping grounds such as broad `utils.ts`, `helpers.ts`, or `common.ts` without a clear owner.
- Extract repeated logic only when the abstraction has a clear name and responsibility.
- Prefer early returns over deeply nested branches.
- Use named constants for repeated domain values, timeouts, and limits.
- Do not catch errors only to ignore them or rethrow the same value.
- Do not add a dependency for a small capability already covered by the platform or current stack.
- Do not create duplicate implementations during migration; leave one source of truth.
- Never rewrite unrelated code to satisfy personal style preferences.

## Formatting and linting

- Prettier owns formatting: single quotes, no semicolons, trailing commas, LF, and 120-character print width.
- ESLint owns code quality, hooks, import ordering, React Refresh, and Prettier integration.
- Use `pnpm lint:fix` for safe automatic fixes and review the diff.
- Do not disable a rule globally to solve one local issue.

## Definition of done

- Search the changed runtime surface for raw color values, numbered palette references, numeric font weights, raw text
  metrics, duplicated control geometry, and global CSS shorthands that bypass the theme.
- Public shared components expose the required props type and ref contract, preserve relevant accessibility and native
  control props, include contextual JSDoc, and have a representative `/components` example.
- Run `pnpm contrast:check` after semantic color changes and keep all checked light/dark text and UI-boundary pairs at
  or above their documented thresholds.
- Theme, token, text-style, or recipe changes run `pnpm chakra-typegen` before static verification.
- Run `pnpm check` and fix formatting, lint, type, or build failures rather than bypassing the gate.
- Report verification that could not run and the exact reason; do not claim runtime, visual, or accessibility checks that
  were not performed.
