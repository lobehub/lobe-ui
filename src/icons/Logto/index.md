---
nav: Components
group: Auth Icons
title: Logto
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Logto/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Logto/index.ts'
---

## Icons

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Logto } from '@lobehub/ui/icons';

export default () => <Logto size={64} />;
```

## Color

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Logto } from '@lobehub/ui/icons';

export default () => <Logto.Color size={64} />;
```

## Avatars

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Logto } from '@lobehub/ui/icons';

export default () => (
  <Flexbox gap={16} horizontal>
    <Logto.Avatar size={64} />
    <Logto.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
