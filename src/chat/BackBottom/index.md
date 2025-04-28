---
nav: Chat
group: Navigation
title: BackBottom
description: BackBottom is a scroll navigation button that appears when users have scrolled up in a chat interface. It monitors scroll position and automatically shows/hides based on a configurable visibility threshold. When clicked, it smoothly scrolls the target container back to the bottom, making it ideal for chat applications where new messages appear at the bottom.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/BackBottom/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/BackBottom/index.tsx'
---

## Default

<code src="./demos/index.tsx"></code>

## APIs

| Property         | Description                                     | Type                                                        | Default |
| ---------------- | ----------------------------------------------- | ----------------------------------------------------------- | ------- |
| className        | Additional CSS class for the component          | `string`                                                    | -       |
| onClick          | Callback function called when button is clicked | `(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void` | -       |
| style            | Custom CSS styles                               | `CSSProperties`                                             | -       |
| target           | Container to monitor for scrolling; required    | `Target` from ahooks/useScroll                              | -       |
| text             | Text to display on the button                   | `string`                                                    | -       |
| visibilityHeight | Height threshold to trigger button visibility   | `number`                                                    | 400     |
