---
nav: Components
group: Theme
title: ConfigProvider
---

## Default

The `proxy` provides two CDN resolution addresses, `aliyun` and `unpkg`, with `aliyun` as the default. This can be configured through the `cdn` attribute of `ConfigProvider`.

<code src="./demos/index.tsx" center></code>

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

<API></API>
