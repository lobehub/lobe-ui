---
nav: Chat
group: Feedback
title: MessageModal
description: The MessageModal component is a modal window that can display either a message in Markdown format or a message input field for editing the message. It provides a seamless way to view and edit Markdown content with support for switching between viewing and editing modes.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/MessageModal/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/MessageModal/index.tsx'
---

## Default

<code src="./demos/index.tsx" center></code>

## Editing

<code src="./demos/edit.tsx" ></code>

## APIs

| Property        | Description                                | Type                                                                   | Default                                                  |
| --------------- | ------------------------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| editing         | Whether the modal is in editing mode       | `boolean`                                                              | `false`                                                  |
| extra           | Additional content to display in view mode | `ReactNode`                                                            | -                                                        |
| height          | Height of the modal                        | `string`                                                               | `'75vh'`                                                 |
| onChange        | Callback when content is changed           | `(text: string) => void`                                               | -                                                        |
| onEditingChange | Callback when editing mode changes         | `(editing: boolean) => void`                                           | -                                                        |
| onOpenChange    | Callback when modal visibility changes     | `(open: boolean) => void`                                              | -                                                        |
| open            | Control the modal visibility               | `boolean`                                                              | -                                                        |
| panelRef        | Reference to the modal panel               | `ModalProps['panelRef']`                                               | -                                                        |
| placeholder     | Placeholder text for the editor            | `string`                                                               | -                                                        |
| text            | Custom text for buttons and title          | `{ cancel?: string; confirm?: string; edit?: string; title?: string }` | `{ cancel: 'Cancel', confirm: 'Confirm', edit: 'Edit' }` |
| value           | The content of the message                 | `string`                                                               | -                                                        |
| footer          | Custom footer for the modal                | `ReactNode`                                                            | -                                                        |
