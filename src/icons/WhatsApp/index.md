---
nav: Components
group: Channel Icons
title: WhatsApp
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/WhatsApp/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/WhatsApp/index.ts'
---

## Icons

```tsx
import { WhatsApp } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <WhatsApp size={64} />;
```

## Color

```tsx
import { WhatsApp } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <WhatsApp.Color size={64} />;
```

## Avatars

```tsx
import { WhatsApp } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <WhatsApp.Avatar size={64} />
    <WhatsApp.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
