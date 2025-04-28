---
nav: Chat
group: Data Entry
title: EditableMessageList
description: EditableMessageList is a React component that allows users to edit a list of chat messages, including their content and role. It is designed to be used in chatbot building applications.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/EditableMessageList/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/EditableMessageList/index.tsx'
---

## Default

<code src="./demos/index.tsx" ></code>

## APIs

| Property    | Description                                           | Type                                   | Default |
| ----------- | ----------------------------------------------------- | -------------------------------------- | ------- |
| dataSources | Array of chat messages to display and edit (required) | `LLMMessage[]`                         | -       |
| disabled    | Whether the component is disabled for editing         | `boolean`                              | `false` |
| onChange    | Callback when messages are modified                   | `(chatMessages: LLMMessage[]) => void` | -       |

### Types

```typescript
interface LLMMessage {
  content: string;
  role: string;
  // Additional properties for chat messages
}
```
