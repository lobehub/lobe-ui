---
nav: Components
group: Channel Icons
title: DingTalk
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/DingTalk/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/DingTalk/index.ts'
---

## Icons

```tsx
import { DingTalk } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <DingTalk size={64} />;
```

## Color

```tsx
import { DingTalk } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <DingTalk.Color size={64} />;
```

## Avatars

```tsx
import { DingTalk } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <DingTalk.Avatar size={64} />
    <DingTalk.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
