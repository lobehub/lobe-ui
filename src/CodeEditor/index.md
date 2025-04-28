---
nav: Components
group: Data Entry
title: CodeEditor
---

CodeEditor is a component for editing code with syntax highlighting support for various programming languages.

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property      | Description                                  | Type                                                      | Default        |
| ------------- | -------------------------------------------- | --------------------------------------------------------- | -------------- |
| language      | Programming language for syntax highlighting | `string`                                                  | `'markdown'`   |
| value         | Current value of the editor                  | `string`                                                  | -              |
| defaultValue  | Default value of the editor                  | `string`                                                  | `''`           |
| onValueChange | Callback when value changes                  | `(value: string) => void`                                 | -              |
| placeholder   | Placeholder text when no value is provided   | `string`                                                  | `''`           |
| variant       | The style variant of the editor              | `'filled' \| 'outlined' \| 'borderless'`                  | `'borderless'` |
| width         | Width of the editor                          | `string \| number`                                        | -              |
| height        | Height of the editor                         | `string \| number`                                        | -              |
| classNames    | Custom classNames for child elements         | `{ highlight?: string; textarea?: string }`               | -              |
| styles        | Custom styles for child elements             | `{ highlight?: CSSProperties; textarea?: CSSProperties }` | -              |

> CodeEditor also inherits some properties from TextArea and Flexbox components
