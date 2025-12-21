---
nav: Components
group: Auth Icons
title: Auth0
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Auth0/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Auth0/index.ts'
---

## Icons

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Auth0 } from '@lobehub/ui/icons';

export default () => <Auth0 size={64} />;
```

## Avatars

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Auth0 } from '@lobehub/ui/icons';

export default () => (
  <Flexbox gap={16} horizontal>
    <Auth0.Avatar size={64} />
    <Auth0.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
