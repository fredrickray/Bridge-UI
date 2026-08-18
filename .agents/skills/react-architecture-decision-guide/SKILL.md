---
name: react-architecture-decision-guide
description: >-
  Architecture decision rules for medium-to-large
  apps. Use when designing,
  refactoring, or reviewing React component/hook/module structure, or when the
  user mentions React architecture, colocation, domain hooks, or maintainability.
---

# React Architecture Decision Guide

Engineering handbook of **when / why / don't**—not a React tutorial. Audience: experienced React/TypeScript engineers. Prefer project conventions when they conflict with naming only; otherwise apply these rules.

## How to apply

1. Identify the decision (split, state, hook type, fetch, form, error UI, JSX list skip vs filter, etc.).
2. Follow the matching rule below.
3. Prefer duplication over speculative abstraction.
4. Match the repo's ownership model (domain **or** feature folders).

---

## 1. When to split a component

**Split when any of:**

1. **Re-render isolation** — High-churn updates (typing, filter, drag, hover) _and/or_ expensive siblings (lists, tables, charts); only a small slice depends on that state.
2. **Reuse** — Copies match in structure/behavior **and** differences fit a small, stable props surface. Similarity beats raw occurrence count.
3. **Size/clarity** — Hard to reason about **and** a clean seam exists.

**Don't split when:** no clean seam; speculative single-use reuse; extraction is mostly a props bag; feature flow still thrashing (data/UX unsettled).

**Keep together longer:**

- One user flow in fewer files until data/UX settled **and** seams are obvious.
- Single-parent helpers → **same-file** by default; own file when the child is its own unit of understanding (or reused / blocks navigating the parent).

**Anti-patterns:** Split every visual block on day one; extract vaguely similar UIs into variant soup; isolate state in a child then pipe it up so the parent still re-renders.

---

## 2. Colocation vs shared

**Default:** Place next to owner using the project's grouping (**domain** or **feature**).

**Shared early:** Design-system / primitive UI only.

**Graduate to shared when:** a **second real consumer** appears, **or** clearly cross-cutting: domain-agnostic **and** platform/UI-kit infrastructure (DOM, dates, HTTP helpers, a11y, session/routing wrappers, primitives).

**Don't:** `shared/` junk drawer; domain types in "generic" shared helpers; deep cross-feature imports that bypass ownership.

---

## 3. Where logic belongs

| Kind                                               | Home                                                     |
| -------------------------------------------------- | -------------------------------------------------------- |
| Domain rules (validation, eligibility, transforms) | **Plain TS functions/modules**                           |
| React state/effects/refs/context/subscriptions     | **Hook**                                                 |
| I/O wrappers / "services"                          | **No separate service layer**—modules/folders are enough |
| Presentational derivation (plural labels, copy)    | **Component**                                            |

**Inline in component:** OK while feature-local; extract when it repeats, grows branching, or hurts readability.

**Anti-patterns:** `useX()` that only wraps a pure boolean; 80-line `onSubmit` full of domain rules; service classes for one function.

---

## 4. Reusable (platform) hooks

**Create when:** effect/subscription logic is **non-trivial**, _or_ it's a known toolkit primitive—even with one call site.

**Keep generic:** no domain types; behavior not product workflow; small composable hooks (`useEventListener` → `useClickOutside`).

**Leave inline:** trivial one-off effects.

**Anti-patterns:** `useEnclosureDropdownOutsideClick` in shared; mega `useDomStuff({...})`; extracting `useBoolean`.

---

## 5. Domain hooks

**Create when:** orchestration drowns render (branching, many states/effects) **and/or** behavior is reused in the domain. Not for testability alone.

**Hook owns:** React/workflow state, **domain-relevant** derived data, exported **commands/functions**.

**Handlers on the hook only if:**

1. Atomic domain command (partial/out-of-order use would be wrong), or
2. Exact same handler shared across components.

Otherwise component handlers stay thin and call hook commands.

**UI-tied derived data stays in the component** (e.g. `titleLabel = n > 1 ? 'Labels' : 'Label'`).

**Multi-step:** Split hooks when one API becomes a kitchen sink; seams follow user steps.

**Anti-patterns:** Hook wrapping one pure function; toast/focus/scroll soup inside domain handlers; one façade returning 25 unrelated fields.

---

## 6. Data fetching (React Query)

**Stack:** React Query + `queryOptions` / `mutationOptions` / `infiniteQueryOptions` next to the **API/resource module**.

**Default call site:** `useQuery(options)` / `useMutation(options)` directly in the component.

**Mapping:**

- **Response → view model:** in the `*Options` (per-API mapper).
- **Request body shaping:** in the **main API function**, not options/UI.

**Options stay server-state oriented:** keys, fns, `enabled`, mapping, shared invalidation/optimistic **defaults**. Domain rules stay out.

**Param utils:** extract repeated enabled/param check patterns.

**Data-fetching hook:** only when param/`enabled`/wiring is complex at one call site **or** the same shape repeats.

**Invalidation:** baseline on `mutationOptions`; feature-specific extras at the call site.

**Anti-patterns:** Domain eligibility in `queryFn`; request shaping in JSX; wrapper hooks that only `return useQuery(options)`.

---

## 7. State placement

| Kind       | When                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| **Local**  | One-off UI for component/subtree (modal open, input, dropdown)                                       |
| **URL**    | Shareable/bookmarkable view (page, limit, tab, filters, entity-in-route)                             |
| **Global** | Distant subtrees need same _client_ value (theme, cart count)—not close enough for props/composition |
| **Server** | Backend truth → React Query, not a client global store                                               |

**Conflict:** URL owns navigation identity; global owns ephemeral non-deep-linkable shell state. Don't mirror URL into a global store.

---

## 8. Derived vs stored state

**Derive by default.** Store when:

1. User-editable fork (draft from server/props),
2. Incremental/temporal (previous value, debounce, animation, irreversible steps),
3. High-churn + heavy index (e.g. selection + Map/Set): prefer **incremental** Map/Set updates; cold data can stay derived/`useMemo`.

**Smell:** `useEffect` syncing state from other state.

**Don't:** Store cheap derivations; rebuild+`setState` a full Map every keystroke when `useMemo` does the same work with no incremental benefit.

---

## 9. useState vs useReducer

**Default `useState`.** Use `useReducer` for complex related transitions or an explicit action model—not mere state headcount.

**Async status:**

- Server fetch/mutation → React Query status.
- Non-RQ async → single `useState` + **discriminated union**.
- Reducer only if those transitions are non-trivial.

**Never:** parallel `isLoading` / `isError` / `isSuccess` booleans.

---

## 10. Unions vs booleans (state & props)

**Mutually exclusive → union/enum from day one.** Independent flags → booleans.

**Payloads:** async/result variants carry data in the union (`{ status: 'error'; message }`). Simple UI modes (`'view' | 'edit'`) can be bare unions.

**Props:** exclusive choices → enum/union (`variant="primary" | "secondary"`). Independent toggles → booleans. New conflicting boolean → refactor to union immediately.

---

## 11. Data structures

Choose from access pattern:

| Need            | Structure                         |
| --------------- | --------------------------------- |
| Lookup by id    | `Record` / `Map`                  |
| Membership      | `Set` (store Set when high churn) |
| Order / reorder | `T[]` or `Id[]`                   |
| Keyed + order   | `Record<Id, T>` + `Id[]`          |

**Hybrid:** `Map`/`Set` for hot interactive selection/lookup; `Record` + `Id[]` for server-shaped caches. Small local lists can be `T[]` of objects until lookup + order both matter.

---

## 12. Utils & duplication

**Extract util when:** identical on **second** use, or **once** if a non-trivial chunk clarifies the caller.

**Prefer duplication when:** meanings will diverge; share needs many flags/options; would couple unrelated domains.

---

## 13. Shared components & composition

1. **Children/slots** first.
2. **Compound components** for complex widgets.
3. **Config props** (`variant`, `size`) mainly for small design-system primitives.

Avoid boolean sprawl to fake composition.

---

## 14. JSX lists: skip in `.map()` vs `.filter()`

Applies to **JSX lists** only—not data transforms that are not rendered.

**Skip in `.map()`** (`return null`) when **all** of:

1. The array is rendered to JSX in **one** place
2. The list is **small** (nav, tabs, a handful of items—not a large data list)
3. The goal is **"don't show this item"** (permission, flag, role, empty, etc.)
4. Skip conditions are **≤ 4**

Put the check **next to the render decision**.

**Filter first** (usually **before** render) when **any** of:

- The filtered array is reused (second map, count, empty state, passed as props)
- Skip conditions are **> 4**
- The item is still needed for layout, keys, or other non-visual work
- The list is large

Don't `.filter().map()` for a one-off hide on a small JSX list used once. Don't repeat the same skip across several maps—filter once.

---

## 15. Memoization

**Don't memoize by default.**

Use for expensive derivations, or referential stability required by hook deps / APIs / real `memo` list boundaries.

**Never** `useMemo` for cheap primitive/string derivations by default.

**Stable callbacks:**

- Defined in this component/hook → `useCallback` when stability is needed.
- Passed from outside, identity not guaranteed → `useCallbackRef` (or equivalent).

---

## 16. Naming & exports

- Components = what it is (`EnclosureTable`).
- Hooks = `use` + behavior (`useEnclosureAssignment`).
- Utils = verb/domain (`canAssignLivestock`).
- Vague `Helper` / `Manager` / `Utils` / `Data`: avoid in **domain** code; OK in **shared/platform**.
- Prefer **named exports** over default exports.

---

## 17. Forms

- **Default:** Zod + React Hook Form.
- **Small forms** without complex validation → controlled local state OK.
- **Schema** in the **same file as the form**; move out only when another module imports it.
- Schema = lean input contract; deep domain rules in utils.
- Request body mapping in the **API function**, not JSX.

---

## 18. Async data UI (`DataHandler` pattern)

Use the project's **`DataHandler`** (or equivalent): pass `data`, status flags, and slot components (`loaderComponent`, `errorComponent`, `emptyDataComponent`); success via children/render prop.

**Don't** scatter `isLoading && …`, `isError && …`, `data && …` around the tree.

Use anywhere status JSX would otherwise appear (pages, modals, sidebars). Tiny pending flags (button submitting) can stay local.

**Multiple queries:** one handler at the boundary when UI needs all data; **nested** handlers when sections are independently useful.

---

## 19. Error handling

| Failure                 | Surface                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Query / primary content | Inline (`ErrorState` via `DataHandler`)—not toast                                         |
| Mutation / action       | **Toast by default**; form-field/form-level inline when the surface (or spec) requires it |
| Render / unexpected     | Error boundary                                                                            |

---

## 20. Code smells (must-fix)

- God components
- Prop drilling beyond ~2–3 levels
- Boolean prop/state explosion
- Effect-synced derived state
- Business logic buried in JSX
- Fetch-in-`useEffect` reinventing React Query
- Mega catch-all `utils.ts`
- Premature abstractions that already hurt (option bags / wrong coupling)—inline or split

---

## 21. Scalability

Scale by **ownership boundaries** (feature slices **or** domain modules per repo layout). Shared = stable primitives only (UI kit, platform hooks, resource `*Options`). Never grow an undifferentiated `shared/` dump.

---

## Quick decision cheat sheet

```
Need a component split?     → churn/cost isolation | true reuse | messy+clean seam
Where does code live?       → owner folder; shared only if 2nd consumer or platform-primitive
Domain rule?                → pure function
Needs React lifecycle?      → hook
Server data?                → RQ *Options + useQuery; DataHandler for UI states
Shareable view state?       → URL
Distant client session UI?  → global
Everything else UI?         → local
Can compute it?             → derive (unless draft/temporal/incremental index)
Exclusive states/props?     → discriminated union
JSX hide list item?         → small + one map + ≤4 checks → null in map; else filter first
Form?                       → Zod+RHF (small/simple → useState)
Mutation failed?            → toast (unless form inline specified)
Query failed?               → inline ErrorState
```
