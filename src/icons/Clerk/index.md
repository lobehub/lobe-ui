---
nav: Components
group: Auth Icons
title: Clerk
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Clerk/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Clerk/index.ts'
---

## Icons

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Clerk } from '@lobehub/ui/icons';

export default () => <Clerk size={64} />;
```

## Color

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Clerk } from '@lobehub/ui/icons';

export default () => <Clerk.Color size={64} />;
```

## Avatars

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Clerk } from '@lobehub/ui/icons';

export default () => (
  <Flexbox gap={16} horizontal>
    <Clerk.Avatar size={64} />
    <Clerk.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
