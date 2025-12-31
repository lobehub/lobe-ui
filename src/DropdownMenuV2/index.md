---
nav: Components
group: Navigation
title: DropdownMenuV2
description: DropdownMenuV2 renders a dropdown menu based on Base UI Menu primitives, aligned with ContextMenu item layout and styling.
---

## Default

<code src="./demos/index.tsx" center></code>

## Submenu

<code src="./demos/submenu.tsx" center></code>

## Group

<code src="./demos/group.tsx" center></code>

## Danger

<code src="./demos/danger.tsx" center></code>

## Open on Hover

<code src="./demos/hover.tsx" center></code>

## Checkbox Items

<code src="./demos/checkbox.tsx" center></code>

## Lazy Items

<code src="./demos/lazy.tsx" center></code>

## APIs

### DropdownMenuV2

| Property        | Description                       | Type                                                                                        | Default        |
| --------------- | --------------------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| items           | Menu items (lazy supported)       | `DropdownMenuV2ItemType[] \| (() => DropdownMenuV2ItemType[])`                              | -              |
| children        | Trigger element                   | `ReactNode`                                                                                 | -              |
| placement       | Position of dropdown menu         | `'bottomLeft' \| 'bottomCenter' \| 'bottomRight' \| 'topLeft' \| 'topCenter' \| 'topRight'` | `'bottomLeft'` |
| triggerProps    | Props passed to `Menu.Trigger`    | `MenuTriggerProps`                                                                          | -              |
| positionerProps | Props passed to `Menu.Positioner` | `MenuPositionerProps`                                                                       | -              |
| popupProps      | Props passed to `Menu.Popup`      | `MenuPopupProps`                                                                            | -              |
| portalProps     | Props passed to `Menu.Portal`     | `MenuPortalProps`                                                                           | -              |

Additionally, DropdownMenuV2 inherits all properties from Base UI `Menu.Root` except `children`.

### Menu Items

Menu items are the same as those used for Menu/Dropdown, with support for `type: 'checkbox'` items. See [Menu](/components/menu) for details on base item types.

#### Checkbox Item

| Property        | Description                | Type                         | Default |
| --------------- | -------------------------- | ---------------------------- | ------- |
| type            | Item type                  | `'checkbox'`                 | -       |
| checked         | Controlled checked state   | `boolean`                    | -       |
| defaultChecked  | Uncontrolled initial state | `boolean`                    | `false` |
| onCheckedChange | Checked change handler     | `(checked: boolean) => void` | -       |
| closeOnClick    | Close menu on toggle       | `boolean`                    | `false` |
