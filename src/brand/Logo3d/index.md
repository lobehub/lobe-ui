---
nav: Brand
group: Components
title: Logo3d
description: A component that renders a 3D image of the LobeHub logo using a CDN-hosted asset.
apiHeader:
  pkg: '@lobehub/ui/brand'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/Logo3d/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/brand/Logo3d/index.tsx'
---

## Example

```tsx
import { Logo3d } from '@lobehub/ui/brand';

export default () => <Logo3d size={64} />;
```

## APIs

| Property  | Description                                 | Type               | Default     |
| --------- | ------------------------------------------- | ------------------ | ----------- |
| size      | The size of the logo in pixels or CSS units | `number \| string` | `'1em'`     |
| alt       | Alternative text for the image              | `string`           | `'LobeHub'` |
| className | CSS class name                              | `string`           | -           |
| style     | Inline style object                         | `CSSProperties`    | -           |

Additionally, this component accepts most properties from the Img and Ant Design's Image components, except for `width`, `height`, and `src`.
