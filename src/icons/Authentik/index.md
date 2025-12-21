---
nav: Components
group: Auth Icons
title: Authentik
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Authentik/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Authentik/index.ts'
---

## Icons

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Authentik } from '@lobehub/ui/icons';

export default () => <Authentik size={64} />;
```

## Color

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Authentik } from '@lobehub/ui/icons';

export default () => <Authentik.Color size={64} />;
```

## Avatars

```tsx
import { Flexbox } from '@lobehub/ui/Flex';
import { Authentik } from '@lobehub/ui/icons';

export default () => (
  <Flexbox gap={16} horizontal>
    <Authentik.Avatar size={64} />
    <Authentik.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
