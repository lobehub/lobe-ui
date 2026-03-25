---
nav: Components
group: Channel Icons
title: WeChat
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/WeChat/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/WeChat/index.ts'
---

## Icons

```tsx
import { WeChat } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <WeChat size={64} />;
```

## Color

```tsx
import { WeChat } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <WeChat.Color size={64} />;
```

## Avatars

```tsx
import { WeChat } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <WeChat.Avatar size={64} />
    <WeChat.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
