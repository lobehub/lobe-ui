---
nav: Chat
group: Data Entry
title: MessageInput
description: A message input component with a code editor for Markdown content, with confirm and cancel buttons. Supports keyboard shortcuts and custom button rendering.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/MessageInput/ChatItem/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/MessageInput/index.tsx'
---

## Default

<code src="./demos/index.tsx" ></code>

## APIs

| Property       | Description                             | Type                                                     | Default                                    |
| -------------- | --------------------------------------- | -------------------------------------------------------- | ------------------------------------------ |
| classNames     | Custom class names for the component    | `CodeEditorProps['classNames'] & { editor?: string }`    | -                                          |
| defaultValue   | Default content of the editor           | `string`                                                 | -                                          |
| editButtonSize | Size of the buttons                     | `ButtonProps['size']`                                    | `'middle'`                                 |
| onCancel       | Callback when cancel button is clicked  | `() => void`                                             | -                                          |
| onConfirm      | Callback when confirm button is clicked | `(text: string) => void`                                 | -                                          |
| placeholder    | Placeholder text for the editor         | `string`                                                 | -                                          |
| renderButtons  | Custom button renderer                  | `(text: string) => ButtonProps[]`                        | -                                          |
| shortcut       | Enable keyboard shortcuts               | `boolean`                                                | `false`                                    |
| styles         | Custom styles for the component         | `CodeEditorProps['styles'] & { editor?: CSSProperties }` | -                                          |
| text           | Custom text for buttons                 | `{ cancel?: string; confirm?: string }`                  | `{ cancel: 'Cancel', confirm: 'Confirm' }` |
| variant        | Style variant of the editor             | `CodeEditorProps['variant']`                             | `'borderless'`                             |
