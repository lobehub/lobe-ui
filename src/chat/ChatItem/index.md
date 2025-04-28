---
nav: Chat
group: Data Display
title: ChatItem
description: ChatItem is a versatile React component that displays chat messages with support for avatars, message content, and interactive actions. It offers various styling options including bubble and docs variants, left/right placement, and responsive layouts. Features include loading states, error handling, editability, and custom rendering options.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/ChatItem/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/ChatItem/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code> <code src="./demos/table.tsx" nopadding></code> <code src="./demos/code.tsx" nopadding></code> <code src="./demos/Editing.tsx"></code>

## Alert

<code src="./demos/Alert.tsx" nopadding></code> <code src="./demos/AlertWithDefaultMessagePlacehoder.tsx" nopadding></code>

## AlertWithContent

<code src="./demos/AlertWithContent.tsx" nopadding></code>

## APIs

| Property           | Description                                       | Type                                                        | Default    |
| ------------------ | ------------------------------------------------- | ----------------------------------------------------------- | ---------- |
| aboveMessage       | Content to display above the message              | `ReactNode`                                                 | -          |
| actions            | Actions to be displayed in the chat item          | `ReactNode`                                                 | -          |
| actionsWrapWidth   | Width threshold for actions wrapping              | `number`                                                    | -          |
| avatar             | Metadata for the avatar (required)                | `MetaData`                                                  | -          |
| avatarAddon        | Additional content to display with avatar         | `ReactNode`                                                 | -          |
| avatarProps        | Props for the Avatar component                    | `AvatarProps`                                               | -          |
| belowMessage       | Content to display below the message              | `ReactNode`                                                 | -          |
| editing            | Whether the chat item is in editing mode          | `boolean`                                                   | `false`    |
| error              | Props for error rendering                         | `AlertProps`                                                | -          |
| errorMessage       | Custom error message content                      | `ReactNode`                                                 | -          |
| fontSize           | Font size for the message content                 | `number`                                                    | -          |
| loading            | Whether the chat item is in loading state         | `boolean`                                                   | `false`    |
| markdownProps      | Props for the Markdown component                  | `Omit<MarkdownProps, 'className' \| 'style' \| 'children'>` | -          |
| message            | The message content of the chat item              | `ReactNode`                                                 | -          |
| messageExtra       | Extra content to display with the message         | `ReactNode`                                                 | -          |
| onAvatarClick      | Callback when avatar is clicked                   | `() => void`                                                | -          |
| onChange           | Callback when message content changes             | `(value: string) => void`                                   | -          |
| onDoubleClick      | Callback when message is double-clicked           | `DivProps['onDoubleClick']`                                 | -          |
| onEditingChange    | Callback when editing mode changes                | `(editing: boolean) => void`                                | -          |
| placeholderMessage | Text to display when message is empty             | `string`                                                    | `"..."`    |
| placement          | The placement of the chat item                    | `'left' \| 'right'`                                         | `'left'`   |
| primary            | Whether the chat item is primary                  | `boolean`                                                   | `false`    |
| renderMessage      | Custom renderer for message content               | `(content: ReactNode) => ReactNode`                         | -          |
| showTitle          | Whether to show the title of the chat item        | `boolean`                                                   | `false`    |
| text               | Text-related props for editable message           | `EditableMessageProps['text']`                              | -          |
| time               | The timestamp of the chat item                    | `number`                                                    | -          |
| variant            | The visual style of the chat item                 | `'bubble' \| 'docs'`                                        | `'bubble'` |
| ...FlexboxProps    | All FlexboxProps except 'children' and 'onChange' | `Omit<FlexboxProps, 'children' \| 'onChange'>`              | -          |
