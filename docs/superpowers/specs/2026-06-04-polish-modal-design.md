# Polish `base-ui/Modal` — Notion-style refinement (Plan B′)

**Date:** 2026-06-04
**Scope:** `src/base-ui/Modal/` — `style.ts`, `constants.ts`, `atoms.tsx`, `Modal.tsx`
**Out of scope:** `padding-inline` for header/content/footer (preserved exactly), popup border/shadow/radius, backdrop color & blur, drag affordance, content stagger.

## Goal

Polish the existing base-ui Modal to a Notion-style cadence — refined, restrained, with micro-motion in the right places. Tighten the action buttons, soften the typography, swap the deny outline for a horizontal nudge, and migrate the focus ring to a softer box-shadow form. No structural changes to layout, no `padding-inline` shifts (downstream consumers offset margins against the current 16px inline padding).

## Non-goals

- Backdrop blur / depth changes — out of selected dimensions.
- Drag affordance — explicitly rejected (no grip dots, no hover fill, no cursor change).
- Layered shadow / radius bump — out of scope.
- Content stagger — not adopted; can revisit later.
- Reflowing header/content/footer `padding-inline` — would break downstream negative-margin compensation.

## Architecture context

Modal currently has two render paths:

1. **AnimatedModalRoot** (when `open !== undefined`) — uses `motion/react` (`Motion.div` + `AnimatePresence`). Reads from `modalMotionConfig` in `constants.ts`. CSS transition on `popupInner` is disabled (inline `transition: 'none'`).
2. **NonAnimatedModalRoot** (when `open` is undefined / uncontrolled) — uses base-ui `Dialog.Popup`'s `data-starting-style` / `data-ending-style` mechanism with the CSS transition declared in `styles.popupInner` and `styles.backdrop`.

Both paths must be polished in lockstep. The `cubic-bezier(0.32, 0.72, 0, 1)` curve is reused across motion configs, CSS transitions, and the deny animation for cohesion.

## Changes

### 1. Action button — size & micro-motion

**File:** `src/base-ui/Modal/style.ts` → `buttonBase`, `okButton`, `cancelButton`, `dangerOkButton`.

| Property                 | Before                                                       | After                                                                   |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| height                   | 36                                                           | **30**                                                                  |
| padding-inline           | 16                                                           | **12**                                                                  |
| font-size                | 14                                                           | **13**                                                                  |
| transition               | `all 150ms ease-out`                                         | **`all 160ms cubic-bezier(0.32, 0.72, 0, 1)`**                          |
| `:hover:not(:disabled)`  | color/border change only                                     | + **`transform: translateY(-0.5px)`** + soft shadow (see below)         |
| `:active:not(:disabled)` | (none)                                                       | **`transform: translateY(0); box-shadow: none;`**                       |
| `:focus-visible`         | `outline: 2px solid colorPrimaryBorder; outline-offset: 1px` | **`outline: none; box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder}`** |

**Hover shadow recipe:**

- `cancelButton` hover: `box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18)` (light-mode aware via `color-mix` if needed — verify in dark/light).
- `okButton` hover: `box-shadow: 0 2px 8px color-mix(in srgb, ${cssVar.colorPrimary} 32%, transparent)`.
- `dangerOkButton` hover: `box-shadow: 0 2px 8px color-mix(in srgb, ${cssVar.colorError} 32%, transparent)`.

**Focus + hover composition.** Both the focus ring (`box-shadow: 0 0 0 2px ${colorPrimaryBorder}`) and the hover lift shadow use `box-shadow`. When a button is simultaneously focused and hovered, declare the focus ring with a higher-specificity rule that also includes the hover shadow, e.g.:

```css
&:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder};
}

&:focus-visible:hover:not(:disabled) {
  box-shadow:
    0 0 0 2px ${cssVar.colorPrimaryBorder},
    /* variant hover shadow goes here, per variant */;
}
```

`loadingSpinner` size stays at 14×14 (still fits 30h button visually). Verify spinner vertical centering in the smaller button.

### 2. Title typography

**File:** `src/base-ui/Modal/style.ts` → `title`.

| Property       | Before      | After           |
| -------------- | ----------- | --------------- |
| font-size      | 16          | **17**          |
| letter-spacing | (default 0) | **-0.005em**    |
| line-height    | 1.5         | **1.4**         |
| font-weight    | 600         | 600 (unchanged) |

Header height grows by ~1–2px due to taller line-box. Verify against `headerActions` (28×28) alignment — should still center; tweak `headerActions` align if needed.

### 3. Close icon

**File:** `src/base-ui/Modal/Modal.tsx` — `<X size={18} />` → **`<X size={16} />`** (both occurrences in the inline header path).
**File:** `src/base-ui/Modal/style.ts` → `close` and `closeInline`.

| Property         | Before                                    | After                                                                   |
| ---------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| icon size        | 18                                        | **16**                                                                  |
| border-radius    | `${cssVar.borderRadiusSM}`                | **`50%`**                                                               |
| transition       | `all 150ms ease-out`                      | **`all 160ms cubic-bezier(0.32, 0.72, 0, 1)`**                          |
| `:hover`         | color/bg change only                      | + **`transform: scale(1.04)`**                                          |
| `:focus-visible` | `outline: 2px solid; outline-offset: 1px` | **`outline: none; box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder}`** |

`fullscreenToggle` shares the same hover-icon affordance — apply the same updates (radius 50%, scale, box-shadow focus ring, cubic-bezier transition).

### 4. Enter / exit animation

**File:** `src/base-ui/Modal/constants.ts`.

Switch from spring to tween with a soft cubic-bezier — gives a deterministic, slightly-overshot feel without bounce.

```ts
const initialStyle = { opacity: 0, scale: 0.97 };
const enterStyle = { opacity: 1, scale: 1 };
const exitStyle = { opacity: 0, scale: 0.98 };

export const modalMotionConfig: MotionProps = {
  animate: enterStyle,
  exit: {
    ...exitStyle,
    transition: { duration: 0.12, ease: [0.4, 0, 1, 1] }, // ease-in
  },
  initial: initialStyle,
  transition: {
    duration: 0.22,
    ease: [0.32, 0.72, 0, 1],
  },
};

export const backdropTransition = {
  duration: 0.18,
  ease: [0.32, 0.72, 0, 1],
};
```

**File:** `src/base-ui/Modal/style.ts` → `popupInner` (CSS transition for NonAnimated path).

```css
transition:
  transform 220ms cubic-bezier(0.32, 0.72, 0, 1),
  opacity 220ms cubic-bezier(0.32, 0.72, 0, 1);

&[data-starting-style] {
  transform: scale(0.97);
  opacity: 0;
}
&[data-ending-style] {
  transform: scale(0.98);
  opacity: 0;
  transition-duration: 120ms;
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}
```

(Drop the `translateY(4px)` — pure scale + fade reads cleaner at the softer curve.)

**File:** `src/base-ui/Modal/style.ts` → `backdrop`. Update CSS transition to `opacity 180ms cubic-bezier(0.32, 0.72, 0, 1)` to match the AnimatedModalRoot path's `backdropTransition`.

### 5. Deny feedback

**File:** `src/base-ui/Modal/style.ts` → `denyAnimation` — replace the outline-ring keyframes entirely.

```css
@keyframes modal-deny {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-5px);
  }
  40% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(2px);
  }
}

animation: modal-deny 280ms cubic-bezier(0.36, 0.66, 0.04, 1);
```

Remove the `outline: 2px solid transparent;` declaration. Keyframe name stays `modal-deny` (defensive — see migration checklist).

`triggerDeny` timer in `Modal.tsx` is currently 400ms; reduce to **300ms** to match the new keyframe length + a small buffer (`denyTimerRef = setTimeout(..., 300)`).

**Interaction with drag:** the dragged popup uses `motion`'s drag transform on the same element. The deny animation also uses `transform: translateX(...)`. Verify: deny only triggers from `handleOpenChange` (`outside-press`, modal not dismissed), which fires _after_ drag ends. Confirm `whileDrag` is not active when deny plays — if there's any overlap, defer the deny class until `onPointerUp`.

### 6. Untouched (explicit)

- `header`, `content`, `footer` padding (block & inline). All 12 / 16.
- `popupInner` border, border-radius (12), box-shadow, background.
- `backdrop` color.
- `headerDraggable` cursor (`default`) — no `grab` cursor added.
- Content scroll behavior, scrollbar styling.
- `closeInline` placement, `headerActions` layout.

## Downstream migration checklist

When migrating consumers of `@lobehub/ui/base-ui` Modal:

1. **`buttonBase` consumers** — grep workspace for `styles.buttonBase` and any custom footer renderer that styles buttons against the old 36h / 14px assumption. Recompute aligned heights if footers mix custom controls.
2. **Focus ring DOM** — search for `:focus-visible` rules on `[role="dialog"]` descendants or downstream CSS targeting `outline` on modal action buttons. Box-shadow ring sits inside the element bounds; outline used to draw outside.
3. **`modal-deny` keyframes** — name preserved; any external `animation-name: modal-deny;` reuse must verify max ±5px translateX is acceptable for the surrounding layout.
4. **Close icon size** — consumers customizing close-icon container via `classNames.header` / `semanticStyles.header` and aligning sibling elements to the old 18px glyph need to recheck.
5. **Title size** — header line-box grows ~1–2px. Consumers pinning header height or aligning siblings to it need verification.
6. **Enter timing** — E2E tests that hard-wait for the 150ms enter animation need to be relaxed to 220ms (plus exit 120ms).

Migration audit happens on a separate branch; this spec captures the surface area only.

## Files to be modified

- `src/base-ui/Modal/style.ts` — buttons, title, close, popupInner transition, backdrop transition, denyAnimation, fullscreenToggle.
- `src/base-ui/Modal/constants.ts` — `modalMotionConfig`, `backdropTransition`.
- `src/base-ui/Modal/Modal.tsx` — `<X size={18} />` → `size={16}`; `triggerDeny` timer 400 → 300.
- `src/base-ui/Modal/atoms.tsx` — no changes expected (verify during implementation; if `borderRadiusSM` reference moves into atoms, adjust there).

## Verification plan

1. **Demo run-through.** Start `dumi` dev server. For each demo in `src/base-ui/Modal/demos/`:
   - Basic modal: enter/exit feel, button hover lift, close icon hover circle.
   - Custom footer: lobe-ui `<Button>` neighbor — confirm no visual collision with new 30h base button.
   - No footer: header + content rhythm, close icon refinement.
   - Confirm loading: spinner centers in 30h button; transition during loading.
   - Draggable: drag still works; deny does not collide with whileDrag.
2. **Nested modal demos** (`nested.tsx`, `zindex-with-dropdown.tsx`, `zindex-dropdown-in-modal.tsx`) — focus ring layering, deny shake when masking another modal.
3. **Deny trigger** — `maskClosable={false}` modal, click outside, verify horizontal nudge plays cleanly; rapid repeat clicks restart the animation (the existing `clearTimeout` covers this).
4. **Keyboard** — Tab through OK / Cancel; box-shadow focus ring visible, not clipped by `overflow: hidden` on popupInner.
5. **Light + dark themes** — hover shadow visible in both; deny nudge OK against any sibling overlay.
6. **`prefers-reduced-motion`** — out of scope for this spec (not addressed today); flag as a follow-up.

## Open follow-ups (not in this spec)

- Honor `prefers-reduced-motion` for deny, enter/exit, button hover.
- Optional content stagger entrance.
- Layered shadow / backdrop blur (Plan C territory).
- Drag affordance reconsidered (rejected this round).
