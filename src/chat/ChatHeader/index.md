---
nav: Chat
group: Layout
title: ChatHeader
description: ChatHeader is a versatile navigation component for chat interfaces. It offers a three-section layout (left, center, right) with customizable content and styling. The header includes an optional back button, supports flexible content arrangement, and inherits all FlexboxProps for additional layout customization.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/ChatHeader/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/ChatHeader/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### ChatHeader

| Property        | Description                               | Type                                                                                         | Default |
| --------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- | ------- |
| classNames      | Custom CSS class names for each section   | `{ left?: string; center?: string; right?: string }`                                         | -       |
| gaps            | Spacing between elements in each section  | `{ left?: number; center?: number; right?: number }`                                         | -       |
| left            | Content for the left section              | `ReactNode`                                                                                  | -       |
| onBackClick     | Callback when back button is clicked      | `() => void`                                                                                 | -       |
| right           | Content for the right section             | `ReactNode`                                                                                  | -       |
| showBackButton  | Whether to display the back button        | `boolean`                                                                                    | `false` |
| styles          | Custom CSS styles for each section        | `{ left?: CSSProperties; center?: CSSProperties; right?: CSSProperties }`                    | -       |
| ...FlexboxProps | Inherits all properties from FlexboxProps | [FlexboxProps](https://github.com/lobehub/lobe-ui/tree/master/src/types/react-layout-kit.ts) | -       |

### ChatHeaderTitle

| Property | Description                     | Type                  | Default |
| -------- | ------------------------------- | --------------------- | ------- |
| desc     | Description or subtitle text    | `string \| ReactNode` | -       |
| tag      | Tag element shown next to title | `ReactNode`           | -       |
| title    | Main title content (required)   | `string \| ReactNode` | -       |
