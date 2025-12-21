---
nav: Components
group: Auth Icons
title: Casdoor
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Casdoor/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Casdoor/index.ts'
---

## Icons

```tsx
import { Casdoor } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Casdoor size={64} />;
```

## Color

```tsx
import { Casdoor } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Casdoor.Color size={64} />;
```

## Avatars

```tsx
import { Casdoor } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <Casdoor.Avatar size={64} />
    <Casdoor.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
