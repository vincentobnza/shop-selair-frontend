# Senior React Agent Standards

This document defines how engineering agents should implement features in this frontend.

## 1) Core Engineering Rules

1. Prefer functional components and React hooks over class components.
2. Keep components small, composable, and domain-focused.
3. Co-locate feature logic when possible, but keep shared abstractions in shared folders.
4. Use TypeScript strictly. Avoid `any` unless there is no safe alternative.
5. Separate UI state, server state, and business state clearly.

## 2) Hook-First Development (Mandatory)

Maximize React hooks usage when architecting component logic.

### Required advanced hooks and when to use them

1. `useActionState`

- Use for form submissions and action-driven workflows with pending/error/result handling.
- Prefer over manual pending flags when an action model fits.

2. `useCallback`

- Use for stable event handlers passed to memoized children.
- Do not wrap every function by default; use intentionally for render stability.

3. `useMemo`

- Use for expensive derived values and stable object/array references.
- Do not use for trivial computations.

4. `useDeferredValue`

- Use for search/filter UIs where instant typing should remain responsive while heavy lists update.

5. `useEffectEvent`

- Use to read the latest values inside effects without recreating subscriptions.
- Keep side-effect subscriptions stable and avoid accidental resubscribe loops.

6. `useId`

- Use for accessible form control linking (`label` + `input`) and deterministic IDs.

7. `useImperativeHandle`

- Use only when exposing a controlled imperative API through refs (focus, scroll, reset).
- Keep public imperative surface minimal.

8. `useOptimistic`

- Use for optimistic UI updates around mutation flows to keep interactions fast and resilient.

9. `useTransition`

- Use to split urgent updates (typing/click) from non-urgent UI work (render-heavy updates, route-level state updates).

## 3) State Management Policy

### State type decision

1. Local component-only state:

- Use `useState` or `useReducer`.

2. Shared state with 3 or more related states or actions:

- Use Zustand.
- This is mandatory for medium-complex shared client state.

3. Server data:

- Use TanStack Query only (queries + mutations + cache).
- Do not store server collections in Zustand unless there is a clear offline/workflow reason.

### Zustand standards

1. Place stores in `src/store`.
2. Use slice-based composition for large stores.
3. Always export selectors to avoid broad subscriptions.
4. Keep async server operations out of stores when TanStack Query already models them.

## 4) TanStack Query Standards (Mandatory)

1. Create a single Query Client in app providers.
2. Define query key factories in `src/services/query/keys`.
3. Keep API calls in `src/services/api` and consume them via hooks in `src/services/query`.
4. Use `useQuery` for reads and `useMutation` for writes.
5. Invalidate or update cache intentionally after mutations.
6. Prefer optimistic UX with `useOptimistic` and mutation lifecycle callbacks.
7. Add consistent retry and stale policies by domain.

## 5) Design Patterns (Mandatory)

1. Container/Presentational Pattern

- Keep UI-only components focused on rendering.
- Move orchestration (query calls, mutations, store interaction) into feature hooks or container components.

2. Custom Hook Pattern

- Extract reusable behavior into custom hooks before duplicating logic across pages/features.
- Hooks should expose intent-focused APIs, not implementation details.

3. Adapter Pattern (API layer)

- Normalize backend payloads in `services/api` adapters before data reaches UI.
- Keep API contracts isolated from component-level types.

4. Strategy Pattern (behavior switching)

- Use strategy-style function maps for variant behavior (pricing, sorting, filtering, role-based behavior) instead of nested conditionals.

5. Composition over Inheritance

- Prefer composition with small reusable building blocks.
- Avoid monolithic "god components".

6. Provider Pattern (app-level concerns)

- Centralize cross-cutting concerns in providers (query client, theme, auth/session boundary).
- Keep provider responsibilities narrow and explicit.

## 6) UI Direction: Minimal and Elegant

1. Visual simplicity first: generous spacing, clear hierarchy, no decorative noise.
2. Limit color usage to a small semantic palette.
3. Use typography scale consistently (heading, subtitle, body, caption).
4. Prefer subtle motion only when it improves clarity.
5. Maintain strong contrast and readable touch targets.
6. Avoid crowded screens; prioritize one primary action per view.

## 7) Mobile-First Standards (Mandatory)

1. Design for small screens first, then progressively enhance for tablet/desktop.
2. Build base styles for mobile and add breakpoints with `min-width`.
3. Navigation must work with one-thumb usage and clear tap targets.
4. Minimum interactive size target: 44x44px.
5. Keep above-the-fold content lightweight and action-focused.
6. Optimize perceived performance on mobile networks:

- Defer non-critical rendering with `useDeferredValue` and `useTransition` where useful.
- Prefer optimistic flows for user-triggered writes.

7. Use responsive layout primitives:

- Fluid spacing and typography.
- Flexible grid/stack patterns that collapse gracefully.

8. Test at common widths before merge (at minimum: 360px, 768px, 1280px).

## 8) Professional Folder Structure

Target structure:

```text
src/
	app/
		providers/        # QueryClientProvider, ThemeProvider, app-level providers
		routes/           # Route definitions and route guards
		config/           # Environment and app-wide config
	assets/             # Static assets (images, icons, fonts)
	components/
		ui/               # Reusable design-system primitives
		layout/           # Shell, header, sidebar, page wrappers
	features/
		<feature-name>/
			components/
			hooks/
			services/
			types/
			utils/
			index.ts
	pages/              # Route-level pages (composition layer)
	hooks/              # Shared custom hooks (cross-feature)
	services/
		api/              # HTTP clients and endpoint functions
		query/
			keys/           # Query key factories
			hooks/          # Query/mutation hooks
	store/              # Zustand stores and slices
	lib/                # Shared utilities (existing)
	types/              # Global/shared TS types
	utils/              # Pure helper functions
	main.tsx            # App bootstrap
```

## 9) Naming and Boundaries

1. Feature folders use kebab-case.
2. React components use PascalCase.
3. Hooks start with `use`.
4. Avoid cross-feature imports except through public `index.ts` exports.
5. Keep page components thin; place domain logic in feature hooks/services.

## 10) PR Quality Gates

1. No duplicated server-state logic outside TanStack Query.
2. No global shared state with 3+ related states outside Zustand.
3. Hook dependencies are explicit and lint-clean.
4. Expensive renders are protected with memoization strategy.
5. Accessibility IDs and form labeling use `useId`.
6. New UI work is mobile-first and verified at required breakpoints.

## 11) Implementation Checklist (Agent)

1. Define whether each new state is local, shared, or server state.
2. If shared state has 3+ related state fields/actions, create or extend a Zustand store.
3. If data comes from backend, create API function + TanStack Query hook.
4. Add optimistic behavior for mutation-heavy interactions.
5. Keep components presentational where possible and move logic into hooks.
6. Apply at least one suitable design pattern from section 5 for each non-trivial feature.
7. Start styling from mobile and scale up with progressive breakpoints.
