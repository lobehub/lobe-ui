---
nav: Chat
group: Data Entry
title: ChatInputArea
description: The ChatInputArea component is used to display a chat input area with expandable and collapsible feature, and a send button to submit the chat message. It can be customized with actions and footer, and also supports input value change and composition event for Chinese input.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/ChatInputArea/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/ChatInputArea/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### ChatInputArea

| Property         | Description                                           | Type                                                                                       | Default |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------- |
| bottomAddons     | Content to display below the input area               | `ReactNode`                                                                                | -       |
| classNames       | Custom CSS class names                                | `DraggablePanelProps['classNames']`                                                        | -       |
| expand           | Whether the input area is expanded                    | `boolean`                                                                                  | -       |
| heights          | Height configurations for the component               | `{ headerHeight?: number; inputHeight?: number; maxHeight?: number; minHeight?: number; }` | -       |
| loading          | Whether the send action is in loading state           | `boolean`                                                                                  | `false` |
| onInput          | Callback when input value changes                     | `(value: string) => void`                                                                  | -       |
| onSend           | Callback when send button is clicked                  | `() => void`                                                                               | -       |
| onSizeChange     | Callback when panel size changes                      | `DraggablePanelProps['onSizeChange']`                                                      | -       |
| ref              | Reference to the TextArea component                   | `Ref<TextAreaRef>`                                                                         | -       |
| setExpand        | Function to control expand state                      | `(expand: boolean) => void`                                                                | -       |
| topAddons        | Content to display above the input area               | `ReactNode`                                                                                | -       |
| ...TextAreaProps | All properties from TextArea component except onInput | `Omit<TextAreaProps, 'onInput'>`                                                           | -       |

### ChatInputActionBar

| Property    | Description                                  | Type                  | Default |
| ----------- | -------------------------------------------- | --------------------- | ------- |
| leftAddons  | Content for the left side of the action bar  | `ReactNode`           | -       |
| mobile      | Whether to use mobile layout                 | `boolean`             | `false` |
| padding     | Padding for the action bar                   | `number \| string`    | -       |
| ref         | Reference to the action bar element          | `Ref<HTMLDivElement>` | -       |
| rightAddons | Content for the right side of the action bar | `ReactNode`           | -       |

### ChatSendButton

| Property        | Description                              | Type                                               | Default |
| --------------- | ---------------------------------------- | -------------------------------------------------- | ------- |
| leftAddons      | Content for the left side of the button  | `ReactNode`                                        | -       |
| loading         | Whether the button is in loading state   | `boolean`                                          | `false` |
| onSend          | Callback when send button is clicked     | `() => void`                                       | -       |
| onStop          | Callback when stop button is clicked     | `() => void`                                       | -       |
| rightAddons     | Content for the right side of the button | `ReactNode`                                        | -       |
| texts           | Customizable button text labels          | `{ send?: string; stop?: string; warp?: string; }` | -       |
| ...FlexboxProps | All properties from FlexboxProps         | `FlexboxProps`                                     | -       |
