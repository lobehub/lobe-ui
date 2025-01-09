---
nav: Components
group: Auth Icons
title: MicrosoftEntra
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/MicrosoftEntra/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/MicrosoftEntra/index.ts'
---

## Icons

```tsx
import { MicrosoftEntra } from '@lobehub/ui/icons';
import { Flexbox } from 'react-layout-kit';

export default () => <MicrosoftEntra size={64} />;
```

## Color

```tsx
import { MicrosoftEntra } from '@lobehub/ui/icons';
import { Flexbox } from 'react-layout-kit';

export default () => <MicrosoftEntra.Color size={64} />;
```

## Avatars

```tsx
import { MicrosoftEntra } from '@lobehub/ui/icons';
import { Flexbox } from 'react-layout-kit';

export default () => (
  <Flexbox gap={16} horizontal>
    <MicrosoftEntra.Avatar size={64} />
    <MicrosoftEntra.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
