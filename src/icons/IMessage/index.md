---
nav: Components
group: Channel Icons
title: IMessage
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/IMessage/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/IMessage/index.ts'
---

## Icons

```tsx
import { IMessage } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <IMessage size={64} />;
```

## Color

```tsx
import { IMessage } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <IMessage.Color size={64} />;
```

## Avatars

```tsx
import { IMessage } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <IMessage.Avatar size={64} />
    <IMessage.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
