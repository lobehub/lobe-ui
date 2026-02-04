---
nav: Components
group: Layout
title: Flex
description: Flexible layout components based on Flexbox
---

## Flexbox

A flexible layout component based on CSS Flexbox.

### Basic Usage

<code src="./demos/basic.tsx"></code>

### Direction

Control the flex direction with `direction` or `horizontal` props.

<code src="./demos/direction.tsx"></code>

### Alignment

Control alignment with `align` and `justify` props.

<code src="./demos/alignment.tsx"></code>

### Gap

Control spacing between items with `gap` prop.

<code src="./demos/gap.tsx"></code>

### Wrap

Control wrapping behavior with `wrap` prop.

<code src="./demos/wrap.tsx"></code>

## Center

A convenience component for centering content both horizontally and vertically.

<code src="./demos/center.tsx"></code>

## API

### Flexbox

| Property      | Type                              | Default      | Description                                                                                      |
| ------------- | --------------------------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| horizontal    | `boolean`                         | `false`      | Whether to use horizontal layout                                                                 |
| direction     | `FlexDirection`                   | -            | Flex direction: `'horizontal'` \| `'horizontal-reverse'` \| `'vertical'` \| `'vertical-reverse'` |
| distribution  | `CSSProperties['justifyContent']` | -            | Content distribution (alias for justify)                                                         |
| wrap          | `CSSProperties['flexWrap']`       | -            | Flex wrap behavior                                                                               |
| justify       | `CSSProperties['justifyContent']` | -            | Main axis alignment                                                                              |
| align         | `ContentPosition`                 | `'stretch'`  | Cross axis alignment                                                                             |
| gap           | `number` \| `string`              | `0`          | Gap between items                                                                                |
| width         | `number` \| `string`              | `'auto'`     | Component width                                                                                  |
| height        | `number` \| `string`              | `'auto'`     | Component height                                                                                 |
| padding       | `number` \| `string`              | `0`          | Padding                                                                                          |
| paddingInline | `number` \| `string`              | -            | Inline padding                                                                                   |
| paddingBlock  | `number` \| `string`              | -            | Block padding                                                                                    |
| allowShrink   | `boolean`                         | `false`      | Allow flex shrinking by setting root `min-width: 0` (useful for ellipsis/overflow cases)         |
| flex          | `number` \| `string`              | `'0 1 auto'` | Flex value                                                                                       |
| visible       | `boolean`                         | `true`       | Whether to display the component                                                                 |
| as            | `ElementType`                     | `'div'`      | HTML tag to render                                                                               |
| className     | `string`                          | -            | Custom class name                                                                                |
| style         | `CSSProperties`                   | -            | Custom styles                                                                                    |

### Center

Extends all Flexbox props except `distribution`, `direction`, and `align` (which are fixed to center content).

### FlexBasic

Same as Flexbox. This is the base component that both Flexbox and Center use internally.

## Types

### ContentPosition

```typescript
type ContentPosition =
  | 'center'
  | 'end'
  | 'flex-end'
  | 'flex-start'
  | 'start'
  | 'stretch'
  | 'baseline';
```

### FlexDirection

```typescript
type FlexDirection = 'vertical' | 'vertical-reverse' | 'horizontal' | 'horizontal-reverse';
```

### CommonSpaceNumber

```typescript
type CommonSpaceNumber = 2 | 4 | 8 | 12 | 16 | 24;
```
