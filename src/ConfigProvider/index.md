---
nav: Components
group: Theme
title: ConfigProvider
---

ConfigProvider is a context provider component that allows you to configure global settings for other components in the library, such as CDN settings for external resources.

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

## APIs

### ConfigProvider

| Property | Description          | Type        | Default |
| -------- | -------------------- | ----------- | ------- |
| config   | Configuration object | `Config`    | -       |
| children | Child components     | `ReactNode` | -       |

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
