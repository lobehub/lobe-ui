---
nav: Components
group: Layout
title: ScrollArea
description: A native scroll container with custom scrollbars and gradient scroll fade.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/ScrollArea/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/ScrollArea/index.tsx'
---

## Default

<code src="../../ScrollArea/demos/index.tsx" nopadding></code>

## Mask on gradient background

<code src="../../ScrollArea/demos/background.tsx" nopadding></code>

## Both scrollbars

<code src="../../ScrollArea/demos/both.tsx" nopadding></code>

## Usage

```tsx | pure
import { ScrollArea } from '@lobehub/ui/base-ui';

<ScrollArea scrollFade style={{ height: 192, width: 384 }}>
  <p>...</p>
</ScrollArea>;
```

## Anatomy (Atoms)

```tsx | pure
import {
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@lobehub/ui/base-ui';

<ScrollAreaRoot>
  <ScrollAreaViewport scrollFade>
    <ScrollAreaContent />
  </ScrollAreaViewport>
  <ScrollAreaScrollbar>
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
  <ScrollAreaCorner />
</ScrollAreaRoot>;
```

## Scroll fade (mask, scroll-driven)

Enable the fade by setting `scrollFade` on `ScrollArea` or `ScrollAreaViewport`.

The fade effect is implemented as a `mask-image` (so it works on background images too).

When supported, it uses **scroll-driven animations** via `animation-timeline: scroll()` to drive the mask based on scroll position (see MDN: `https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/animation-timeline`). When not supported, it falls back to Base UI overflow CSS variables.

```css
.Viewport {
  --scroll-area-overflow-y-start: inherit;
  --scroll-area-overflow-y-end: inherit;

  --fade-size: 40px;
  --fade-top: min(var(--fade-size), var(--scroll-area-overflow-y-start, 0px));
  --fade-bottom: min(var(--fade-size), var(--scroll-area-overflow-y-end, 0px));

  @supports (animation-timeline: scroll()) {
    @keyframes fadeY {
      0% {
        --fade-top: 0px;
        --fade-bottom: var(--fade-size);
      }
      10%,
      90% {
        --fade-top: var(--fade-size);
        --fade-bottom: var(--fade-size);
      }
      100% {
        --fade-top: var(--fade-size);
        --fade-bottom: 0px;
      }
    }

    animation: fadeY 1ms linear both;
    animation-timeline: scroll(self y);
  }

  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--fade-top),
    #000 calc(100% - var(--fade-bottom)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--fade-top),
    #000 calc(100% - var(--fade-bottom)),
    transparent 100%
  );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
```

## API Reference

ScrollArea is built on top of Base UI Scroll Area and exposes the same primitives and props.

### ScrollArea

Composed scroll area with defaults for viewport, content, scrollbar, and thumb.

| Prop           | Type                                                        | Default | Description                                        |
| -------------- | ----------------------------------------------------------- | ------- | -------------------------------------------------- |
| scrollFade     | `boolean`                                                   | `false` | Enable gradient scroll fade on the viewport edges. |
| contentProps   | `Omit<ScrollAreaContentProps, 'children'>`                  | -       | Props passed to `ScrollAreaContent`.               |
| corner         | `boolean`                                                   | `false` | Whether to render the corner.                      |
| cornerProps    | `ScrollAreaCornerProps`                                     | -       | Props passed to `ScrollAreaCorner`.                |
| scrollbarProps | `Omit<ScrollAreaScrollbarProps, 'children'>`                | -       | Props passed to `ScrollAreaScrollbar`.             |
| thumbProps     | `ScrollAreaThumbProps`                                      | -       | Props passed to `ScrollAreaThumb`.                 |
| viewportProps  | `Omit<ScrollAreaViewportProps, 'children' \| 'scrollFade'>` | -       | Props passed to `ScrollAreaViewport`.              |

### Root

Groups all parts of the scroll area. Renders a `div` element.

**Root Props:**

| Prop                  | Type                                                                                 | Default | Description                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| overflowEdgeThreshold | `number \| Partial<{ xStart: number; xEnd: number; yStart: number; yEnd: number }>`  | `0`     | The threshold in pixels that must be passed before the overflow edge attributes are applied. Accepts a single number for all edges or an object to configure them individually. |
| className             | `string \| ((state: ScrollArea.Root.State) => string \| undefined)`                  | -       | CSS class applied to the element, or a function that returns a class based on the component state.                                                                              |
| style                 | `CSSProperties \| ((state: ScrollArea.Root.State) => CSSProperties \| undefined)`    | -       | Inline styles for the root element.                                                                                                                                             |
| render                | `ReactElement \| ((props: HTMLProps, state: ScrollArea.Root.State) => ReactElement)` | -       | Replace the component element with a different tag or compose it with another component.                                                                                        |

**Root Data Attributes:**

| Attribute             | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| data-has-overflow-x   | Present when the scroll area content is wider than the viewport.  |
| data-has-overflow-y   | Present when the scroll area content is taller than the viewport. |
| data-overflow-x-end   | Present when there is overflow on the horizontal end side.        |
| data-overflow-x-start | Present when there is overflow on the horizontal start side.      |
| data-overflow-y-end   | Present when there is overflow on the vertical end side.          |
| data-overflow-y-start | Present when there is overflow on the vertical start side.        |

**Root CSS Variables:**

| Variable                    | Type     | Description                    |
| --------------------------- | -------- | ------------------------------ |
| --scroll-area-corner-height | `number` | The scroll area corner height. |
| --scroll-area-corner-width  | `number` | The scroll area corner width.  |

### Viewport

The actual scrollable container of the scroll area. Renders a `div` element.

**Viewport Props:**

| Prop       | Type                                                                                     | Default | Description                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| scrollFade | `boolean`                                                                                | `false` | Enable gradient scroll fade on the viewport edges.                                                 |
| className  | `string \| ((state: ScrollArea.Viewport.State) => string \| undefined)`                  | -       | CSS class applied to the element, or a function that returns a class based on the component state. |
| style      | `CSSProperties \| ((state: ScrollArea.Viewport.State) => CSSProperties \| undefined)`    | -       | Inline styles for the viewport element.                                                            |
| render     | `ReactElement \| ((props: HTMLProps, state: ScrollArea.Viewport.State) => ReactElement)` | -       | Replace the component element with a different tag or compose it with another component.           |

**Viewport Data Attributes:**

| Attribute             | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| data-has-overflow-x   | Present when the scroll area content is wider than the viewport.  |
| data-has-overflow-y   | Present when the scroll area content is taller than the viewport. |
| data-overflow-x-end   | Present when there is overflow on the horizontal end side.        |
| data-overflow-x-start | Present when there is overflow on the horizontal start side.      |
| data-overflow-y-end   | Present when there is overflow on the vertical end side.          |
| data-overflow-y-start | Present when there is overflow on the vertical start side.        |

**Viewport CSS Variables:**

| Variable                       | Type     | Description                                        |
| ------------------------------ | -------- | -------------------------------------------------- |
| --scroll-area-overflow-x-end   | `number` | Distance from the horizontal end edge in pixels.   |
| --scroll-area-overflow-x-start | `number` | Distance from the horizontal start edge in pixels. |
| --scroll-area-overflow-y-end   | `number` | Distance from the vertical end edge in pixels.     |
| --scroll-area-overflow-y-start | `number` | Distance from the vertical start edge in pixels.   |

### Content

A container for the content of the scroll area. Renders a `div` element.

**Content Props:**

| Prop      | Type                                                                                    | Default | Description                                                                                        |
| --------- | --------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| className | `string \| ((state: ScrollArea.Content.State) => string \| undefined)`                  | -       | CSS class applied to the element, or a function that returns a class based on the component state. |
| style     | `CSSProperties \| ((state: ScrollArea.Content.State) => CSSProperties \| undefined)`    | -       | Inline styles for the content element.                                                             |
| render    | `ReactElement \| ((props: HTMLProps, state: ScrollArea.Content.State) => ReactElement)` | -       | Replace the component element with a different tag or compose it with another component.           |

### Scrollbar

A vertical or horizontal scrollbar for the scroll area. Renders a `div` element.

**Scrollbar Props:**

| Prop        | Type                                                                                      | Default      | Description                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| orientation | `'horizontal' \| 'vertical'`                                                              | `'vertical'` | Whether the scrollbar controls vertical or horizontal scroll.                                      |
| className   | `string \| ((state: ScrollArea.Scrollbar.State) => string \| undefined)`                  | -            | CSS class applied to the element, or a function that returns a class based on the component state. |
| style       | `CSSProperties \| ((state: ScrollArea.Scrollbar.State) => CSSProperties \| undefined)`    | -            | Inline styles for the scrollbar element.                                                           |
| keepMounted | `boolean`                                                                                 | `false`      | Keep the HTML element in the DOM when the viewport is not scrollable.                              |
| render      | `ReactElement \| ((props: HTMLProps, state: ScrollArea.Scrollbar.State) => ReactElement)` | -            | Replace the component element with a different tag or compose it with another component.           |

**Scrollbar Data Attributes:**

| Attribute             | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| data-orientation      | Indicates the orientation of the scrollbar.                       |
| data-hovering         | Present when the pointer is over the scroll area.                 |
| data-scrolling        | Present when the user scrolls inside the scroll area.             |
| data-has-overflow-x   | Present when the scroll area content is wider than the viewport.  |
| data-has-overflow-y   | Present when the scroll area content is taller than the viewport. |
| data-overflow-x-end   | Present when there is overflow on the horizontal end side.        |
| data-overflow-x-start | Present when there is overflow on the horizontal start side.      |
| data-overflow-y-end   | Present when there is overflow on the vertical end side.          |
| data-overflow-y-start | Present when there is overflow on the vertical start side.        |

**Scrollbar CSS Variables:**

| Variable                   | Type     | Description                   |
| -------------------------- | -------- | ----------------------------- |
| --scroll-area-thumb-height | `number` | The scroll area thumb height. |
| --scroll-area-thumb-width  | `number` | The scroll area thumb width.  |

### Thumb

The draggable part of the scrollbar that indicates the current scroll position. Renders a `div` element.

**Thumb Props:**

| Prop      | Type                                                                                  | Default | Description                                                                                        |
| --------- | ------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| className | `string \| ((state: ScrollArea.Thumb.State) => string \| undefined)`                  | -       | CSS class applied to the element, or a function that returns a class based on the component state. |
| style     | `CSSProperties \| ((state: ScrollArea.Thumb.State) => CSSProperties \| undefined)`    | -       | Inline styles for the thumb element.                                                               |
| render    | `ReactElement \| ((props: HTMLProps, state: ScrollArea.Thumb.State) => ReactElement)` | -       | Replace the component element with a different tag or compose it with another component.           |

**Thumb Data Attributes:**

| Attribute        | Description                                 |
| ---------------- | ------------------------------------------- |
| data-orientation | Indicates the orientation of the scrollbar. |

### Corner

A small rectangular area that appears at the intersection of horizontal and vertical scrollbars. Renders a `div` element.

**Corner Props:**

| Prop      | Type                                                                                   | Default | Description                                                                                        |
| --------- | -------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| className | `string \| ((state: ScrollArea.Corner.State) => string \| undefined)`                  | -       | CSS class applied to the element, or a function that returns a class based on the component state. |
| style     | `CSSProperties \| ((state: ScrollArea.Corner.State) => CSSProperties \| undefined)`    | -       | Inline styles for the corner element.                                                              |
| render    | `ReactElement \| ((props: HTMLProps, state: ScrollArea.Corner.State) => ReactElement)` | -       | Replace the component element with a different tag or compose it with another component.           |
