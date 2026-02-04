---
nav: Components
group: Typography
title: Text
description: Text component is used to display text content with various styles and formatting options. It supports text decoration, colors, ellipsis, and other typography features.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Tooltip When Overflow

<code src="./demos/TooltipWhenOverflow.tsx" nopadding></code>

## APIs

### Text

| Property       | Description                     | Type                                                                | Default |
| -------------- | ------------------------------- | ------------------------------------------------------------------- | ------- |
| as             | Custom element type             | `ElementType`                                                       | `'div'` |
| type           | Text type                       | `'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'`       | -       |
| color          | Custom text color               | `string`                                                            | -       |
| weight         | Font weight                     | `'bold' \| 'bolder' \| number`                                      | -       |
| disabled       | Whether the text is disabled    | `boolean`                                                           | `false` |
| strong         | Whether the text is bold        | `boolean`                                                           | `false` |
| italic         | Whether the text is italic      | `boolean`                                                           | `false` |
| lineClamp      | Clamp lines with CSS line-clamp | `number`                                                            | -       |
| lineHeight     | Custom line height              | `CSSProperties['lineHeight']`                                       | -       |
| underline      | Whether the text is underlined  | `boolean`                                                           | `false` |
| delete         | Whether the text is deleted     | `boolean`                                                           | `false` |
| mark           | Whether the text is marked      | `boolean`                                                           | `false` |
| code           | Whether the text is code        | `boolean`                                                           | `false` |
| noWrap         | Whether to disable wrapping     | `boolean`                                                           | `false` |
| textDecoration | Custom text decoration          | `CSSProperties['textDecoration']`                                   | -       |
| textTransform  | Custom text transform           | `CSSProperties['textTransform']`                                    | -       |
| whiteSpace     | Custom white-space              | `CSSProperties['whiteSpace']`                                       | -       |
| wordBreak      | Custom word-break               | `CSSProperties['wordBreak']`                                        | -       |
| ellipsis       | Ellipsis configuration          | `boolean \| { rows?: number; tooltip?: ReactNode \| TooltipProps }` | -       |

Additionally, Text inherits all properties from Ant Design's Typography.Text component.

### Text Types

The component supports the following text types:

- `secondary`: Secondary text color
- `success`: Success text color
- `warning`: Warning text color
- `danger`: Danger text color
- `info`: Info text color

### Text Decorations

The component supports various text decorations:

- `strong`: Bold text
- `italic`: Italic text
- `underline`: Underlined text
- `delete`: Strikethrough text
- `mark`: Highlighted text
- `code`: Code block text

### Ellipsis

The ellipsis feature supports two modes:

1. Single line ellipsis:

```tsx
import { Text } from '@lobehub/ui';

export default () => (
  <Text ellipsis>
    This is a very long text that will be truncated with ellipsis when it exceeds the container
    width. This is a very long text that will be truncated with ellipsis when it exceeds the
    container width.
  </Text>
);
```

2. Multi-line ellipsis with tooltip:

```tsx
import { Text } from '@lobehub/ui';

export default () => (
  <Text ellipsis={{ rows: 2, tooltip: 'Full text content' }}>
    This is a very long text that will be truncated with ellipsis when it exceeds the container
    width. This is a very long text that will be truncated with ellipsis when it exceeds the
    container width. This is a very long text that will be truncated with ellipsis when it exceeds
    the container width. This is a very long text that will be truncated with ellipsis when it
    exceeds the container width.
  </Text>
);
```
