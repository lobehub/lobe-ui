---
nav: Components
group: Data Entry
title: SearchBar
description: SearchBar that includes an input field with a search icon and clear button, allowing users to easily search for specific items or content.
---

## Default

The rest of the props of Input are exactly the same as the original [input](https://ant.design/components/input).

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property       | Description                         | Type                                                  | Default   |
| -------------- | ----------------------------------- | ----------------------------------------------------- | --------- |
| value          | The input content value             | `string`                                              | -         |
| defaultValue   | The initial input content           | `string`                                              | `''`      |
| loading        | Whether to show a loading indicator | `boolean`                                             | -         |
| spotlight      | Whether to show a spotlight effect  | `boolean`                                             | -         |
| enableShortKey | Whether to enable keyboard shortcut | `boolean`                                             | -         |
| shortKey       | The keyboard shortcut for focus     | `string`                                              | `'mod+k'` |
| onSearch       | Callback when search is triggered   | `(value: string) => void`                             | -         |
| onInputChange  | Callback when input content changes | `(value: string) => void`                             | -         |
| styles         | Custom styles for components        | `{ input?: CSSProperties; shortKey?: CSSProperties }` | -         |
| classNames     | Custom class names for components   | `{ input?: string; shortKey?: string }`               | -         |
