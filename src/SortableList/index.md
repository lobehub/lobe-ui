---
nav: Components
group: Data Display
title: SortableList
description: SortableList is a component for creating drag-and-drop sortable lists. It allows users to reorder list items through mouse or keyboard interactions with smooth animations and accessibility features.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property   | Description                       | Type                                    | Default |
| ---------- | --------------------------------- | --------------------------------------- | ------- |
| items      | Array of items to be sorted       | `SortableListItem[]`                    | -       |
| renderItem | Function to render each list item | `(item: SortableListItem) => ReactNode` | -       |
| onChange   | Callback when item order changes  | `(items: SortableListItem[]) => void`   | -       |
| gap        | Space between list items          | `number`                                | `8`     |

### SortableListItem

| Property       | Description                    | Type               | Default |
| -------------- | ------------------------------ | ------------------ | ------- |
| id             | Unique identifier for the item | `string \| number` | -       |
| \[key: string] | Additional item properties     | `any`              | -       |

### SortableList.Item

A wrapper component for sortable items.

### SortableList.DragHandle

A drag handle component that can be used within sortable items.
