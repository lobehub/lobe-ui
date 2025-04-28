---
nav: Components
group: Data Entry
title: EmojiPicker
description: EmojiPicker is a component that allows users to select emoji icons or upload custom avatars. It supports multiple tabs, custom emoji sets, and includes options for uploading and deleting avatars.
---

## Default

<code src="./demos/index.tsx" center></code>

## Upload

<code src="./demos/Upload.tsx" center></code>

## Custom Emoji

<code src="./demos/CustomEmoji.tsx" center></code>

## Custom Tabs

<code src="./demos/CustomTabs.tsx" center></code>

## APIs

| Property       | Description                               | Type                                                    | Default |
| -------------- | ----------------------------------------- | ------------------------------------------------------- | ------- |
| value          | Selected emoji or avatar                  | `string`                                                | -       |
| defaultAvatar  | Default avatar to display                 | `string`                                                | -       |
| onChange       | Callback when emoji is selected           | `(emoji: string) => void`                               | -       |
| size           | Size of the avatar                        | `number`                                                | -       |
| allowUpload    | Whether to allow avatar uploads           | `boolean`                                               | `false` |
| allowDelete    | Whether to allow avatar deletion          | `boolean`                                               | `false` |
| onDelete       | Callback when avatar is deleted           | `() => void`                                            | -       |
| onUpload       | Callback when avatar is uploaded          | `(file: File) => Promise<string>`                       | -       |
| compressSize   | Maximum size for image compression        | `number`                                                | -       |
| loading        | Whether the component is in loading state | `boolean`                                               | `false` |
| locale         | Locale for the emoji picker               | `string`                                                | -       |
| customEmojis   | Custom emoji sets                         | `EmojiPickerCustomEmoji[]`                              | -       |
| customTabs     | Custom tabs for the picker                | `EmojiPickerCustomTab[]`                                | -       |
| popupClassName | Class name for the popup                  | `string`                                                | -       |
| popupStyle     | Style for the popup                       | `CSSProperties`                                         | -       |
| texts          | Customizable text labels                  | `{ delete?: string; emoji?: string; upload?: string; }` | -       |

### EmojiPickerCustomEmoji

| Property | Description                         | Type                                                                                      | Default |
| -------- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------- |
| id       | Unique identifier for the emoji set | `string`                                                                                  | -       |
| name     | Name of the emoji set               | `string`                                                                                  | -       |
| emojis   | Array of emoji definitions          | `Array<{ id: string; name: string; keywords?: string[]; skins: Array<{ src: string }> }>` | -       |

### EmojiPickerCustomTab

| Property | Description                         | Type                                                          | Default |
| -------- | ----------------------------------- | ------------------------------------------------------------- | ------- |
| value    | Unique identifier for the tab       | `string`                                                      | -       |
| label    | Label to display for the tab        | `ReactNode`                                                   | -       |
| render   | Render function for the tab content | `(handleAvatarChange: (avatar: string) => void) => ReactNode` | -       |
