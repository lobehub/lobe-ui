---
nav: Brand
group: Combine
title: LobeHub
description: A versatile brand component for displaying LobeHub logo in various styles including 3D, flat, monochrome, text, and combined formats.
apiHeader:
  pkg: '@lobehub/ui/brand'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/LobeHub/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/LobeHub/index.tsx'
---

## Example

```tsx
import { LobeHub } from '@lobehub/ui/brand';

import { Flexbox } from '@/Flex';

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

## API

| Property  | Description                                            | Type                                              | Default |
| --------- | ------------------------------------------------------ | ------------------------------------------------- | ------- |
| type      | The style variant of the LobeHub logo                  | `'3d' \| 'flat' \| 'mono' \| 'text' \| 'combine'` | `'3d'`  |
| size      | The size of the logo in pixels                         | `number`                                          | `32`    |
| extra     | Additional text or element to display next to the logo | `ReactNode`                                       | -       |
| className | CSS class name                                         | `string`                                          | -       |
| style     | Inline style object                                    | `CSSProperties`                                   | -       |
