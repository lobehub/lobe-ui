---
nav: Chat
group: Data Display
title: TokenTag
description: TokenTag is a dynamic button component that visualizes token usage with emoji indicators and textual information. It displays either remaining or used tokens with visual states (normal, low, overload) based on usage percentage. The component adapts to different screen sizes and supports customizable text labels and button shapes.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/TokenTag/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/TokenTag/index.tsx'
---

## Default

The remaining tokens are calculated based on the `maxValue` and `value` props. The component has three types of visual styles: normal (😀), low (😅), and overload (🤯), which are determined by the percentage of remaining tokens. The component is memoized for performance optimization.

<code src="./demos/index.tsx" nopadding></code>

## APIs
