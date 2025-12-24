---
nav: Components
group: Theme
title: MotionProvider
description: MotionProvider lets you choose which motion component (motion or m) Lobe UI uses.
---

`MotionProvider` has been **merged into** `ConfigProvider`. In most cases you don't need to use `MotionProvider` directly anymore.

- You must pass a motion component via `ConfigProvider`.
- If your app uses `LazyMotion`, pass `m` to `ConfigProvider`.

## Default (motion)

```tsx
import { ConfigProvider } from '@lobehub/ui';
import { motion } from 'motion/react';

export default () => (
  <ConfigProvider motion={motion}>
    <App />
  </ConfigProvider>
);
```

## LazyMotion (m)

```tsx
import { ConfigProvider } from '@lobehub/ui';
import { LazyMotion, domAnimation, m } from 'motion/react';

export default () => (
  <LazyMotion features={domAnimation}>
    <ConfigProvider motion={m}>
      <App />
    </ConfigProvider>
  </LazyMotion>
);
```

## APIs

### MotionProvider

| Property | Description                               | Type                  | Default |
| -------- | ----------------------------------------- | --------------------- | ------- |
| children | Child components                          | `ReactNode`           | -       |
| motion   | Motion component to use (`motion` or `m`) | `MotionComponentType` | -       |

### useMotionComponent

```ts
const Motion = useMotionComponent();
```
