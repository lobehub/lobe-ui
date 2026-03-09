---
nav: Components
group: Channel Icons
title: Slack
apiHeader:
  pkg: '@lobehub/ui/icons'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Slack/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/icons/Slack/index.ts'
---

## Icons

```tsx
import { Slack } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Slack size={64} />;
```

## Color

```tsx
import { Slack } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => <Slack.Color size={64} />;
```

## Avatars

```tsx
import { Slack } from '@lobehub/ui/icons';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} horizontal>
    <Slack.Avatar size={64} />
    <Slack.Avatar size={64} shape={'square'} />
  </Flexbox>
);
```
