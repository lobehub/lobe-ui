---
nav: Components
group: Channel Icons
title: MicrosoftTeams
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/MicrosoftTeams/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/MicrosoftTeams/index.ts'
---

## Icons

```tsx
import { MicrosoftTeams } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <MicrosoftTeams size={64} />;
```

## Color

```tsx
import { MicrosoftTeams } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <MicrosoftTeams.Color size={64} />;
```

## Avatars

```tsx
import { MicrosoftTeams } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <MicrosoftTeams.Avatar size={64} />
    <MicrosoftTeams.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
