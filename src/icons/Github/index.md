---
nav: Components
group: Auth Icons
title: Github
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Github/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-icons/tree/master/src/Github/index.ts'
---

## Icons

```tsx
import { Github } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Github size={64} />;
```

## Avatars

```tsx
import { Github } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <Github.Avatar size={64} />
    <Github.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
