---
nav: Components
group: Channel Icons
title: Telegram
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Telegram/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Telegram/index.ts'
---

## Icons

```tsx
import { Telegram } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Telegram size={64} />;
```

## Color

```tsx
import { Telegram } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Telegram.Color size={64} />;
```

## Avatars

```tsx
import { Telegram } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <Telegram.Avatar size={64} />
    <Telegram.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
