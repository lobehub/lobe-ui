---
nav: Brand
group: Combine
title: LobeChat
description: A versatile brand component for displaying LobeChat logo in various styles including 3D, flat, monochrome, text, and combined formats.
apiHeader:
  pkg: '@lobehub/ui/brand'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/LobeChat/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/LobeChat/index.tsx'
---

## Example

```tsx
import { LobeChat } from '@lobehub/ui/brand';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox gap={16} align={'flex-start'}>
    <LobeChat size={64} />
    <LobeChat size={64} type={'mono'} />
    <LobeChat size={64} type={'flat'} />
    <LobeChat size={64} type={'text'} />
    <LobeChat size={64} type={'combine'} />
    <LobeChat size={64} extra={'Discover'} />
    <LobeChat size={64} type={'combine'} extra={'Discover'} />
  </Flexbox>
);
```

## APIs

| Property  | Description                                            | Type                                              | Default |
| --------- | ------------------------------------------------------ | ------------------------------------------------- | ------- |
| type      | The style variant of the LobeChat logo                 | `'3d' \| 'flat' \| 'mono' \| 'text' \| 'combine'` | `'3d'`  |
| size      | The size of the logo in pixels                         | `number`                                          | `32`    |
| extra     | Additional text or element to display next to the logo | `ReactNode`                                       | -       |
| className | CSS class name                                         | `string`                                          | -       |
| style     | Inline style object                                    | `CSSProperties`                                   | -       |
