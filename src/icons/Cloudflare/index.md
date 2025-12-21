---
nav: Components
group: Auth Icons
title: Cloudflare
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Cloudflare/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-icons/tree/master/src/Cloudflare/index.ts'
---

## Icons

```tsx
import { Cloudflare } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Cloudflare size={64} />;
```

## Avatars

```tsx
import { Cloudflare } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <Cloudflare.Avatar size={64} />
    <Cloudflare.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
