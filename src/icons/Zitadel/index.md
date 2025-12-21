---
nav: Components
group: Auth Icons
title: Zitadel
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Zitadel/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Zitadel/index.ts'
---

## Icons

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Zitadel } from '@lobehub/ui/icons';

export default () => <Zitadel size={64} />;
```

## Color

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Zitadel } from '@lobehub/ui/icons';

export default () => <Zitadel.Color size={64} />;
```

## Avatars

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Zitadel } from '@lobehub/ui/icons';

export default () => (
  <Flexbox gap={16} horizontal>
    <Zitadel.Avatar size={64} />
    <Zitadel.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
