---
nav: Components
group: Data Entry
title: EditableText
description: EditableText is a component that allows users to edit text inline. It displays the text in a non-editable state by default, but when the user clicks the edit icon, it switches to an editable input field where the user can make changes. Once the user is done editing, they can click outside the input field or press the enter key to save the changes. The component uses the ControlInput component to display the input field and passes the value and onChange props to it.
---

## Default

<code src="./demos/index.tsx" center></code>

## APIs

| Property        | Description                               | Type                                                    | Default |
| --------------- | ----------------------------------------- | ------------------------------------------------------- | ------- |
| value           | The text content                          | `string`                                                | -       |
| onChange        | Callback when value changes               | `(value: string) => void`                               | -       |
| onChangeEnd     | Callback when editing is complete         | `(value: string) => void`                               | -       |
| onValueChanging | Callback while the value is being changed | `(value: string) => void`                               | -       |
| editing         | Whether the component is in editing mode  | `boolean`                                               | `false` |
| onEditingChange | Callback when editing state changes       | `(editing: boolean) => void`                            | -       |
| showEditIcon    | Whether to show the edit icon             | `boolean`                                               | `true`  |
| texts           | Customizable text labels                  | `{ reset?: string; submit?: string; }`                  | -       |
| variant         | Input variant style                       | `string`                                                | -       |
| size            | Size of the input                         | `string`                                                | -       |
| onBlur          | Callback when input loses focus           | `(e: FocusEvent) => void`                               | -       |
| onFocus         | Callback when input gains focus           | `(e: FocusEvent) => void`                               | -       |
| classNames      | Custom class names                        | `{ container?: string; input?: string; }`               | -       |
| styles          | Custom styles                             | `{ container?: CSSProperties; input?: CSSProperties; }` | -       |
| inputProps      | Additional props for the input component  | `ControlInputProps`                                     | -       |
