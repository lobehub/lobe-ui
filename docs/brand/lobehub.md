---
nav: Brand
group: Combine
title: LobeHub
apiHeader:
  pkg: '@lobehub/ui/brand'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/docs/brand/lobehub.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/LobeHub.tsx'
---

## Example

```tsx
import { LobeHub } from '@lobehub/ui/brand';
import { Flexbox } from 'react-layout-kit';

export default () => (
  <Flexbox gap={16} align={'flex-start'}>
    <LobeHub size={64} />
    <LobeHub size={64} type={'mono'} />
    <LobeHub size={64} type={'flat'} />
    <LobeHub size={64} type={'text'} />
    <LobeHub size={64} type={'combine'} />
    <LobeHub size={64} extra={'Discover'} />
    <LobeHub size={64} type={'combine'} extra={'Discover'} />
  </Flexbox>
);
```
