---
nav: Components
group: Data Entry
title: CopyButton
description: CopyButton is a React component used to copy text content to the clipboard. It provides a button with a copy icon that, when clicked, copies the specified content to the user's clipboard. It also displays a tooltip indicating whether the copy action was successful or not.
---

## Default

<code src="./demos/index.tsx" center></code>

## APIs

### CopyButton

| Property | Description                       | Type                | Default |
| -------- | --------------------------------- | ------------------- | ------- |
| content  | Text content to copy to clipboard | `string`            | -       |
| glass    | Apply glass effect to button      | `boolean`           | `true`  |
| icon     | Custom icon (before copy)         | `IconProps['icon']` | `Copy`  |

Additionally, CopyButton inherits all properties from [ActionIcon](/components/action-icon) component except for those specified above. When clicked, it automatically changes the icon to a checkmark for 2 seconds to indicate successful copying.
