---
nav: Chat
group: Data Display
title: TokenTag
description: The TokenTag component is used to display a token tag with a FluentEmoji icon and a text indicating the remaining tokens.
apiHeader:
  pkg: '@lobehub/ui/chat'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/TokenTag/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/chat/TokenTag/index.tsx'
---

## Default

The remaining tokens are calculated based on the `maxValue` and `value` props. The component has three types of visual styles: normal, low, and overload, which are determined by the percentage of remaining tokens. The component is memoized for performance optimization.

<code src="./demos/index.tsx" nopadding></code>

## APIs
