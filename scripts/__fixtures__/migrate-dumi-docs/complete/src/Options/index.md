---
nav: Components
group:
  title: General
  order: 2
title: Options
description: Exercises every legacy option.
hero:
  title: Options fixture
  description: Reviewed fixture hero.
apiHeader:
  pkg: '@fixture/options'
  docUrl: https://example.test/options
  sourceUrl: https://example.test/source
atomId: Options
subType: Tool
---

export const DemoBasic = 'author binding';

Find details at <https://example.test>.

<code src="./demos/basic.tsx"></code>

<code src='./demos/basic.tsx' ></code>

<code center src=".\demos\windows.tsx"></code>

<code src="./demos/bare-lower.tsx" nopadding></code>

<code noPadding src="./demos/bare-camel.tsx"></code>

<code iframe src="./demos/isolated.tsx"></code>

<code nopadding src="./demos/isolated-bare.tsx" iframe></code>

<code inline src="./demos/inline.tsx"></code>

```md
<code src="./demos/fenced.tsx"></code>
```

`<code src="./demos/inline-literal.tsx"></code>`

\<code src="./demos/escaped.tsx"></code>

<div><code src="./demos/html-example.tsx"></code></div>

## APIs

Manual API guidance must survive.

| Feature   | Legacy | New |
| --------- | ------ | --- |
| Rendering | dumi   | MDX |

| Property | Description   | Type     |
| -------- | ------------- | -------- |
| value    | Fixture value | `string` |

```ts
const preservedAroundTable = true;
```

### OptionsItem

Secondary API guidance.

| Property | Description  | Type      | Default |
| -------- | ------------ | --------- | ------- |
| active   | Active state | `boolean` | `false` |
