# base-ui FocusScope

Port of `mx-core/apps/admin/src/ui/focus-scope` (Scope + ArrowNav + Switcher) into `@lobehub/ui/base-ui`, and `Tree` rebuilt on top of it. `list-actions` (selection model, action registry) stays in the app layer.

## Model

- A **scope** is a DOM subtree marked `[data-focus-scope="<id>"]`. The **active scope** is the last one the user pointed or focused into (global `pointerdown` / `focusin` capture listeners). It is **sticky**: interacting outside every scope does not clear it; only `Escape` inside a scope or `setActiveScope(null)` does.
- **Items** inside a scope are `[data-scope-item]` elements (`data-id` optional, used for last-focused memory).
- **ArrowNav** binds `↑ ↓ Home End` (plus `j k` with `vimKeys`) on `window` and moves DOM focus between the active scope's visible items. Works without the scope holding focus — the point of stickiness.
- **Switcher** binds `← →` (plus `h l` with `vimKeys`) on `window`, mounted once per app, moving the active scope to its visible left/right sibling in DOM order and restoring that scope's last-focused item.

## Files

```
src/base-ui/FocusScope/
  FocusScope.tsx        <div data-focus-scope tabIndex={-1}> + register + Escape
  store.ts              module singleton + useSyncExternalStore hooks
  useScopeArrowNav.ts
  useScopeSwitcher.ts
  domUtils.ts           isItemVisible, isTextInputTarget, hasSize
  index.ts
  index.mdx
  demos/                twoLists (ArrowNav + Switcher), tree (Tree inside scopes)
  __tests__/
    store.test.ts
    useScopeArrowNav.test.tsx
    useScopeSwitcher.test.tsx
```

No zustand, no tinykeys: the store is a plain object with `subscribe` + `useSyncExternalStore`; key bindings are a raw `keydown` listener keyed on `event.key`.

## store.ts

```ts
interface FocusScopeState {
  activeScopeId: string | null;
  knownScopes: Map<string, number>;          // refcount; two mounts of one id are allowed
  lastFocusedItem: Map<string, string>;      // scopeId → data-id
}
getActiveScopeId(): string | null
setActiveScope(id: string | null): void      // ignored if id is not registered
registerScope(id): () => void                // attaches document listeners on first call (SSR-safe)
getLastFocusedItem(scopeId): string | null
setLastFocusedItem(scopeId, id | null): void
useActiveScopeId(): string | null
useFocusScopeActive(id): boolean
```

Unregistering the last instance of an id clears it from `activeScopeId` and `lastFocusedItem`.

## FocusScope.tsx

```ts
interface FocusScopeProps extends HTMLAttributes<HTMLDivElement> {
  id?: string;            // default useId()
  debugOutline?: boolean; // default false; dashed colorInfo outline on the active scope
  ref?: Ref<HTMLDivElement>;
}
```

Renders `<div data-focus-scope={id} data-scope-active tabIndex={-1} {...rest}>`. `role`, `className`, `style`, `onKeyDown` pass through — `Tree` renders `<FocusScope role="tree">`. `onKeyDown`: after the caller's handler, `Escape` (not `defaultPrevented`) → `setActiveScope(null)`.

Exports `useFocusScopeId()` (context) so descendants can find their scope id without prop drilling.

## useScopeArrowNav.ts

```ts
interface UseScopeArrowNavOptions {
  scopeId: string;
  itemSelector?: string;          // default '[data-scope-item]'
  enabled?: boolean;              // default true
  vimKeys?: boolean;              // default false: adds j / k
  onItemFocus?: (el: HTMLElement) => void;
  extra?: Record<string, (event: KeyboardEvent) => void>;  // keyed by event.key, same gating
}
```

Listener: `window.addEventListener('keydown', handler, { capture: true })`. Gate, in order:

1. `event.defaultPrevented` → skip.
2. Modifier held (`meta / ctrl / alt`) → skip (extra keys included; `$mod+…` combos belong to app hotkeys).
3. Reachable: `getActiveScopeId() === scopeId`, or `document.activeElement` is inside `[data-focus-scope=scopeId]`.
4. `isTextInputTarget(event.target)` → skip.
5. Same `KeyboardEvent` already handled by a sibling instance → skip (dedupe for double mounts).

Then `preventDefault()` and run. Scope root resolution and item discovery copy mx-admin: prefer the root containing `activeElement`, else the first visible `[data-focus-scope=id]`; items = `root.querySelectorAll(itemSelector)` filtered by `isItemVisible`. `move(±1)` wraps; no current item → first / last. `focusAt` = `focus({ preventScroll })` + `scrollIntoView({ block: 'nearest' })` + `setLastFocusedItem` + fan out `onItemFocus` to every instance registered on the scope.

Capture phase is deliberate: it runs before the bubble-phase Switcher, so a scope whose `extra` claims `←`/`→` (Tree) wins by `preventDefault`.

## useScopeSwitcher.ts

```ts
interface UseScopeSwitcherOptions { enabled?: boolean; vimKeys?: boolean }
```

Bubble-phase `window` `keydown`. Skips `defaultPrevented`, modifiers, text inputs. Scopes = `[data-focus-scope]` in DOM order, deduped by id, filtered by `isItemVisible` and non-zero size. No wrap. On switch: `setActiveScope(next)` then focus, in order, last-focused item (`[data-id]` still in DOM) → first `[data-scope-item]` → the scope element. Focusing via the same `notifyScopeItemFocus` path as ArrowNav so `onItemFocus` consumers stay in sync.

## Tree on FocusScope

- Root becomes `<FocusScope id={scopeId} role="tree" …>`; new props `scopeId?: string`, `vimKeys?: boolean`.
- Rows get `data-scope-item` and `data-id={key}`.
- Delete `Tree`'s `onKeyDown`, `rowsRef`, `focusRow`. `activeKey` (roving `tabIndex`) is set from `onItemFocus` and row `onFocus`.
- `useScopeArrowNav({ scopeId, itemSelector: '[role="treeitem"]', vimKeys, onItemFocus, extra })` with `extra`:
  - `ArrowRight`: collapsed parent → expand; expanded → focus next row; leaf → no-op (still `preventDefault`, so Switcher does not steal it).
  - `ArrowLeft`: expanded → collapse; else → focus parent row.
  - `Enter`: select. `' '`: check if `checkable`, else select. `'*'`: expand siblings.
- The "current row" for `extra` handlers is `document.activeElement.closest('[role=treeitem]')`, falling back to `activeKey`.
- Tree tests change from `fireEvent.keyDown(row)` to `fireEvent.keyDown(window)` after `fireEvent.pointerDown(row)` — that is the behaviour being bought.

## Tests

- `store.test.ts`: refcount register / unregister; `setActiveScope` ignores unknown ids; unregister clears active + last-focused.
- `useScopeArrowNav.test.tsx`: pointerdown into scope A then `ArrowDown` on window focuses A's next item; clicking outside keeps A reachable; `ArrowDown` from an `<input>` inside A is ignored; an event with `defaultPrevented` is ignored; two instances with one id move focus once.
- `useScopeSwitcher.test.tsx`: A and B side by side; `ArrowRight` activates B and focuses its first item; back to A restores the last-focused item; `ArrowRight` prevented by a capture listener does nothing.
- `Tree.test.tsx`: existing keyboard cases rewritten to window-level keys; add "←/→ inside Tree never switches scope" with a sibling scope mounted.

## Out of scope

`useListKeyboard`, `useListSelection`, action registries, `$mod+a` / multi-select extras — app layer. Typeahead. Grid (2-D) navigation.
