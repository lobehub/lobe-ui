---
nav: Components
group: Channel Icons
title: Line
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Line/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Line/index.ts'
---

## Icons

```tsx
import { Line } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Line size={64} />;
```

## Color

```tsx
import { Line } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Line.Color size={64} />;
```

## Avatars

```tsx
import { Line } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <Line.Avatar size={64} />
    <Line.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
