---
nav: Brand
group: Components
title: BrandLoading
description: A loading component that displays animated brand text logos, such as LobeHub or LobeChat, with a loading animation effect.
apiHeader:
  pkg: '@lobehub/ui/brand'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/BrandLoading/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/BrandLoading/index.tsx'
---

## Example

```tsx
import { BrandLoading, LobeHubText } from '@lobehub/ui/brand';

export default () => <BrandLoading text={LobeHubText} size={64} />;
```

```tsx
import { BrandLoading, LobeChatText } from '@lobehub/ui/brand';

export default () => <BrandLoading text={LobeChatText} size={64} />;
```

## APIs

| Property  | Description                                                    | Type                                          | Default    |
| --------- | -------------------------------------------------------------- | --------------------------------------------- | ---------- |
| text      | The text logo component to be displayed with loading animation | `FC<SvgProps & DivProps & { size?: number }>` | _Required_ |
| size      | The size of the logo in pixels                                 | `number`                                      | -          |
| className | CSS class name                                                 | `string`                                      | -          |
| style     | Inline style object                                            | `CSSProperties`                               | -          |
