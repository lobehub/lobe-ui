---
nav: Components
group: Channel Icons
title: QQ
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/QQ/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/QQ/index.ts'
---

## Icons

```tsx
import { QQ } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <QQ size={64} />;
```

## Color

```tsx
import { QQ } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <QQ.Color size={64} />;
```

## Avatars

```tsx
import { QQ } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <QQ.Avatar size={64} />
    <QQ.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
