---
nav: Chat
group: Data Entry
title: EditableMessage
description: The EditableMessage component is used to display a message that can be edited by the user. It consists of a Markdown component and an optional modal for editing the message. When the user clicks on the message, it enters editing mode and displays an input field for editing the message.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/EditableMessage/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/EditableMessage/index.tsx'
---

## Default

<code  src="./demos/index.tsx" nopadding></code>

## APIs

| Property              | Description                                       | Type                                                                                 | Default |
| --------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------ | ------- |
| className             | Additional CSS class for the component            | `string`                                                                             | -       |
| classNames            | Custom CSS class names for subcomponents          | `MessageInputProps['classNames'] & { input?: string; markdown?: string; }`           | -       |
| defaultValue          | Initial value for uncontrolled mode               | `string`                                                                             | -       |
| editButtonSize        | Size of the edit button                           | `MessageInputProps['editButtonSize']`                                                | -       |
| editing               | Whether the component is in editing state         | `boolean`                                                                            | `false` |
| fontSize              | Font size for the text content                    | `number`                                                                             | -       |
| fullFeaturedCodeBlock | Whether to enable full code block features        | `boolean`                                                                            | `false` |
| height                | Height of the input area                          | `MessageInputProps['height']`                                                        | -       |
| markdownProps         | Props for the Markdown component                  | `Omit<MarkdownProps, 'className' \| 'style' \| 'children'>`                          | -       |
| model                 | Configuration for the message modal               | `{ extra?: MessageModalProps['extra']; footer?: MessageModalProps['footer']; }`      | -       |
| onChange              | Callback when content changes                     | `(value: string) => void`                                                            | -       |
| onEditingChange       | Callback when editing state changes               | `(editing: boolean) => void`                                                         | -       |
| onOpenChange          | Callback when modal open state changes            | `(open: boolean) => void`                                                            | -       |
| openModal             | Whether to display in modal mode                  | `boolean`                                                                            | `false` |
| placeholder           | Placeholder text when content is empty            | `string`                                                                             | -       |
| showEditWhenEmpty     | Whether to show edit button when content is empty | `boolean`                                                                            | `false` |
| style                 | Custom CSS styles for the component               | `CSSProperties`                                                                      | -       |
| styles                | Custom CSS styles for subcomponents               | `MessageInputProps['styles'] & { input?: CSSProperties; markdown?: CSSProperties; }` | -       |
| text                  | Customizable text strings                         | `MessageModalProps['text']`                                                          | -       |
| value                 | Content value (required)                          | `string`                                                                             | -       |
| variant               | Visual style of the editor                        | `MessageInputProps['variant']`                                                       | -       |
