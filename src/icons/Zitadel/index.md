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
import { Zitadel } from '@lobehub/ui/icons';
import { Flexbox } from 'react-layout-kit';

export default () => <Zitadel size={64} />;
```

## Color

```tsx
import { Zitadel } from '@lobehub/ui/icons';
import { Flexbox } from 'react-layout-kit';

export default () => <Zitadel.Color size={64} />;
```

## Avatars

```tsx
import { Zitadel } from '@lobehub/ui/icons';
import { Flexbox } from 'react-layout-kit';

export default () => (
  <Flexbox gap={16} horizontal>
    <Zitadel.Avatar size={64} />
    <Zitadel.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
