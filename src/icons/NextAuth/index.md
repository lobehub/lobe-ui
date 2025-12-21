---
nav: Components
group: Auth Icons
title: NextAuth
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/NextAuth/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/NextAuth/index.ts'
---

## Icons

```tsx
import { NextAuth } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <NextAuth size={64} />;
```

## Color

```tsx
import { NextAuth } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <NextAuth.Color size={64} />;
```

## Avatars

```tsx
import { NextAuth } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <NextAuth.Avatar size={64} />
    <NextAuth.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
