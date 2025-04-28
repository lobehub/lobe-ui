---
nav: Chat
group: Data Display
title: ChatList
description: ChatList is a flexible component for rendering chat conversations with rich customization options. It displays an array of ChatMessage objects with support for loading states, custom message rendering, action handling, and error management. The component supports 'bubble' and 'docs' variants, can display history dividers, and allows for role-specific customization of messages, items, and actions.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/ChatList/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/ChatList/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### ChatList

| Property            | Description                                             | Type                                                                                                                                    | Default    |
| ------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| data                | Array of chat messages to display (required)            | `ChatMessage[]`                                                                                                                         | -          |
| enableHistoryCount  | Whether to show history message count                   | `boolean`                                                                                                                               | `false`    |
| historyCount        | Number of messages to mark as history                   | `number`                                                                                                                                | -          |
| loadingId           | ID of the message in loading state                      | `string`                                                                                                                                | -          |
| onActionsClick      | Callback when action buttons are clicked                | `(action: ActionIconGroupEvent, message: ChatMessage) => void`                                                                          | -          |
| onAvatarsClick      | Callback for avatar clicks by role                      | `(role: RenderRole) => () => void`                                                                                                      | -          |
| onMessageChange     | Callback when message content changes                   | `(id: string, content: string) => void`                                                                                                 | -          |
| renderActions       | Custom renderers for action buttons by type             | `{ [actionKey: string]: RenderAction }`                                                                                                 | -          |
| renderErrorMessages | Custom renderers for error messages by type             | `{ [errorType: 'default' \| string]: RenderErrorMessage }`                                                                              | -          |
| renderItems         | Custom renderers for chat items by role                 | `{ [role: RenderRole]: RenderItem }`                                                                                                    | -          |
| renderMessages      | Custom renderers for message content by role            | `{ [role: RenderRole]: RenderMessage }`                                                                                                 | -          |
| renderMessagesExtra | Custom renderers for additional message content by role | `{ [role: RenderRole]: RenderMessageExtra }`                                                                                            | -          |
| showTitle           | Whether to display chat item titles                     | `boolean`                                                                                                                               | `false`    |
| text                | Customizable text strings                               | `{ copySuccess?: string; history?: string; copy?: string; delete?: string; edit?: string; regenerate?: string; [key: string]: string }` | -          |
| variant             | Visual style of the chat list                           | `'docs' \| 'bubble'`                                                                                                                    | `'bubble'` |
| ...DivProps         | All properties from div element                         | `DivProps`                                                                                                                              | -          |

### Types

```typescript
type ChatMessage = {
  id: string;
  content: string;
  role: LLMRoleType | string;
  // Additional properties defined in the chat message type
};

type RenderRole = LLMRoleType | 'default' | string;
type RenderItem = FC<{ key: string } & ChatMessage & ListItemProps>;
type RenderMessage = FC<ChatMessage & { editableContent: ReactNode }>;
type RenderMessageExtra = FC<ChatMessage>;
type RenderAction = FC<ChatActionsBarProps & ChatMessage>;

interface RenderErrorMessage {
  Render?: FC<ChatMessage>;
  config?: AlertProps;
}
```
