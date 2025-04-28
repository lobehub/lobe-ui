---
nav: Components
group: Navigation
title: Toc
description: The Toc component is used to display a table of contents with clickable anchor links to different sections of a page. It can be customized with a specific height and width, and can be displayed differently on mobile devices. The component utilizes the Ant Design Anchor component to create the clickable anchor links.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property     | Description                                   | Type                          | Default |
| ------------ | --------------------------------------------- | ----------------------------- | ------- |
| items        | Array of TOC items                            | `TocItemType[]`               | -       |
| activeKey    | Currently active item key                     | `string`                      | -       |
| isMobile     | Whether to use mobile layout                  | `boolean`                     | -       |
| tocWidth     | Width of the TOC container                    | `number`                      | -       |
| headerHeight | Height of the header (for offset calculation) | `number`                      | -       |
| getContainer | Function to get the scrollable container      | `() => HTMLElement \| Window` | -       |
| onChange     | Callback when active item changes             | `(activeKey: string) => void` | -       |

### TocItemType

| Property | Description                    | Type            | Default |
| -------- | ------------------------------ | --------------- | ------- |
| id       | Unique identifier for the item | `string`        | -       |
| title    | Display title for the item     | `string`        | -       |
| children | Child items                    | `TocItemType[]` | -       |
