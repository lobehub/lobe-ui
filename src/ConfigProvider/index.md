---
nav: Components
group: Theme
title: ConfigProvider
---

ConfigProvider is a context provider component that allows you to configure global settings for other components in the library, such as CDN settings for external resources and the motion runtime.

## Default

The `proxy` provides two CDN resolution addresses, `aliyun` and `unpkg`, with `aliyun` as the default. This can be configured through the `cdn` attribute of `ConfigProvider`.

<code src="./demos/index.tsx" nopadding></code>

## Custom CDN

At the same time, it provides custom CDN configuration, set `proxy` to `custom` and configure through the `customCdnFn` attribute.

```ts
import { ConfigProvider, Logo } from '@lobehub/ui';

export default () => {
  return (
    <ConfigProvider config={{
        proxy: 'custom',
        customCdnFn: (e: {pkg:string, version:string, path:string}) => `https://yourcdn/${pkg}/${version}/${path}`
    }}>
      <Logo />
    </ConfigProvider>
  );
};
```

## Motion

Lobe UI uses Motion components via context. You must pass a motion component to `ConfigProvider`.
If your app uses `LazyMotion`, pass `m`:

```tsx
import { ConfigProvider } from '@lobehub/ui';
import { motion } from 'motion/react';

export default () => (
  <ConfigProvider motion={motion}>
    <App />
  </ConfigProvider>
);
```

If your app uses [`LazyMotion`](https://motion.dev/docs/react-lazy-motion):

```tsx
import { ConfigProvider } from '@lobehub/ui';
import { LazyMotion, domAnimation } from 'motion/react';
import * as m from 'motion/react-m';

export default () => (
  <LazyMotion features={domAnimation}>
    <ConfigProvider motion={m}>
      <App />
    </ConfigProvider>
  </LazyMotion>
);
```

## APIs

### ConfigProvider

| Property | Description                               | Type                  | Default |
| -------- | ----------------------------------------- | --------------------- | ------- |
| config   | Configuration object                      | `Config`              | -       |
| motion   | Motion component to use (`motion` or `m`) | `MotionComponentType` | -       |
| children | Child components                          | `ReactNode`           | -       |

### Config

| Property       | Description                                                    | Type                                            | Default |
| -------------- | -------------------------------------------------------------- | ----------------------------------------------- | ------- |
| proxy          | CDN proxy to use for external resources                        | `'jsdelivr' \| 'unpkg' \| 'aliyun' \| 'custom'` | -       |
| customCdnFn    | Custom function for generating CDN URLs when proxy is 'custom' | `CdnFn`                                         | -       |
| aAs            | Custom component to use for rendering anchor tags              | `ElementType`                                   | -       |
| imgAs          | Custom component to use for rendering image tags               | `ElementType`                                   | -       |
| imgUnoptimized | Whether to disable image optimization                          | `boolean`                                       | -       |

### CdnFn

```ts
type CdnFn = ({ pkg, version, path }: CdnApi) => string;

interface CdnApi {
  pkg: string;
  version: string;
  path: string;
}
```
