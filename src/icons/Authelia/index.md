---
nav: Components
group: Auth Icons
title: Authelia
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Authelia/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Authelia/index.ts'
---

## Icons

```tsx
import { Authelia } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Authelia size={64} />;
```

## Color

```tsx
import { Authelia } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Authelia.Color size={64} />;
```

## Avatars

```tsx
import { Authelia } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <Authelia.Avatar size={64} />
    <Authelia.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
