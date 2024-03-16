---
nav: Mdx
group: Components
title: mdxComponents
atomId: mdxComponents
apiHeader:
  pkg: '@lobehub/ui/mdx'
  docUrl: '{github}/tree/master/docs/mdx/index.md'
  sourceUrl: '{github}/tree/master/src/mdx/mdxComponents.tsx'
---

## Usage

```ts
import { mdxComponents } from '@lobehub/ui/mdx';
import { RemoteContent } from 'nextra/components';

const RemoteMDX = (props: any) => (
  <RemoteContent components={mdxComponents} {...props} />
);

export default RemoteMDX;
```
