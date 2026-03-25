---
nav: Components
group: Channel Icons
title: Discord
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Discord/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Discord/index.ts'
---

## Icons

```tsx
import { Discord } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Discord size={64} />;
```

## Color

```tsx
import { Discord } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Discord.Color size={64} />;
```

## Avatars

```tsx
import { Discord } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <Discord.Avatar size={64} />
    <Discord.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
