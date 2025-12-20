---
nav: Components
group: Theme
title: MotionProvider
description: MotionProvider lets you choose which motion component (motion or m) Lobe UI uses.
---

MotionProvider is optional. By default, Lobe UI uses `motion` from `motion/react`.
If your app uses `LazyMotion`, wrap your tree with MotionProvider and pass `m`.

## Default (motion)

```tsx
import { MotionProvider } from '@lobehub/ui';

export default () => (
  <MotionProvider>
    <App />
  </MotionProvider>
);
```

## LazyMotion (m)

```tsx
import { MotionProvider } from '@lobehub/ui';
import { LazyMotion, domAnimation, m } from 'motion/react';

export default () => (
  <LazyMotion features={domAnimation}>
    <MotionProvider motion={m}>
      <App />
    </MotionProvider>
  </LazyMotion>
);
```

## APIs

### MotionProvider

| Property | Description                               | Type                  | Default  |
| -------- | ----------------------------------------- | --------------------- | -------- |
| children | Child components                          | `ReactNode`           | -        |
| motion   | Motion component to use (`motion` or `m`) | `MotionComponentType` | `motion` |

### useMotionComponent

```ts
const Motion = useMotionComponent();
```
