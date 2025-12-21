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
import { Flexbox } from '@lobehub/ui/Flex';
import { Casdoor } from '@lobehub/ui/icons';

export default () => <Casdoor size={64} />;
```

## Color

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Casdoor } from '@lobehub/ui/icons';

export default () => <Casdoor.Color size={64} />;
```

## Avatars

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Casdoor } from '@lobehub/ui/icons';

export default () => (
  <Flexbox gap={16} horizontal>
    <Casdoor.Avatar size={64} />
    <Casdoor.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
