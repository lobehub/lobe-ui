---
nav: Components
group: Navigation
title: DropdownMenu
description: DropdownMenu renders a dropdown menu based on Base UI Menu primitives, aligned with ContextMenu item layout and styling.
---

## Default

<code src="./demos/index.tsx" center></code>

## Atom Components

Exported primitives can be composed to build custom dropdown menus.

<code src="./demos/atoms.tsx" center></code>

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

## Switch Items

<code src="./demos/switch.tsx" center></code>

## Lazy Items

<code src="./demos/lazy.tsx" center></code>

## Custom Trigger (Non-button)

<code src="./demos/custom-trigger.tsx" center></code>

## Link Label

<code src="./demos/link-label.tsx" center></code>

## Uploader

<code src="./demos/uploader.tsx" center></code>

## Tooltip Hover Stay

When using Tooltip inside DropdownMenu, wrap both in `TooltipGroup` to ensure the DropdownMenu stays open when hovering over the Tooltip content.

<code src="./demos/tooltip-hover-stay.tsx" center></code>

## APIs

### DropdownMenuV2

| Property        | Description                       | Type                                                                                                             | Default        |
| --------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------- |
| items           | Menu items (lazy supported)       | `DropdownMenuV2ItemType[] \| (() => DropdownMenuV2ItemType[])`                                                   | -              |
| children        | Trigger element                   | `ReactNode`                                                                                                      | -              |
| nativeButton    | Shortcut for trigger nativeButton | `boolean`                                                                                                        | -              |
| placement       | Position of dropdown menu         | `'bottom' \| 'bottomLeft' \| 'bottomCenter' \| 'bottomRight' \| 'top' \| 'topLeft' \| 'topCenter' \| 'topRight'` | `'bottomLeft'` |
| triggerProps    | Props passed to `Menu.Trigger`    | `MenuTriggerProps`                                                                                               | -              |
| positionerProps | Props passed to `Menu.Positioner` | `MenuPositionerProps`                                                                                            | -              |
| popupProps      | Props passed to `Menu.Popup`      | `MenuPopupProps`                                                                                                 | -              |
| portalProps     | Props passed to `Menu.Portal`     | `MenuPortalProps`                                                                                                | -              |

Additionally, DropdownMenuV2 inherits all properties from Base UI `Menu.Root` except `children`.

### Menu Items

Menu items are the same as those used for Menu/Dropdown, with support for `type: 'checkbox'` and `type: 'switch'` items. See [Menu](/components/menu) for details on base item types.

#### Standard Item

| Property     | Description                                                                        | Type      | Default |
| ------------ | ---------------------------------------------------------------------------------- | --------- | ------- |
| closeOnClick | Close menu on click. Set to `false` for items with Upload or file picker elements. | `boolean` | `true`  |

#### Checkbox Item

| Property        | Description                | Type                         | Default |
| --------------- | -------------------------- | ---------------------------- | ------- |
| type            | Item type                  | `'checkbox'`                 | -       |
| checked         | Controlled checked state   | `boolean`                    | -       |
| defaultChecked  | Uncontrolled initial state | `boolean`                    | `false` |
| onCheckedChange | Checked change handler     | `(checked: boolean) => void` | -       |
| closeOnClick    | Close menu on toggle       | `boolean`                    | `false` |

#### Switch Item

| Property        | Description                | Type                         | Default |
| --------------- | -------------------------- | ---------------------------- | ------- |
| type            | Item type                  | `'switch'`                   | -       |
| checked         | Controlled checked state   | `boolean`                    | -       |
| defaultChecked  | Uncontrolled initial state | `boolean`                    | `false` |
| onCheckedChange | Checked change handler     | `(checked: boolean) => void` | -       |
| closeOnClick    | Close menu on toggle       | `boolean`                    | `false` |
