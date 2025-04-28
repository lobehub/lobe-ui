---
nav: Components
group: Navigation
title: Burger
---

Burger is a responsive navigation component that displays a hamburger menu icon which, when clicked, opens a drawer containing menu items.

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property     | Description                                       | Type                         | Default |
| ------------ | ------------------------------------------------- | ---------------------------- | ------- |
| items        | The menu items to be displayed in the drawer      | `MenuProps['items']`         | -       |
| opened       | Whether the drawer is currently open              | `boolean`                    | -       |
| setOpened    | Function to control the drawer open state         | `(state: boolean) => void`   | -       |
| headerHeight | Height of the header (used for positioning)       | `number`                     | `64`    |
| fullscreen   | Whether the drawer should take up the full screen | `boolean`                    | `false` |
| openKeys     | Keys of currently open sub-menus                  | `MenuProps['openKeys']`      | -       |
| selectedKeys | Keys of currently selected menu items             | `MenuProps['selectedKeys']`  | -       |
| onClick      | Callback when a menu item is clicked              | `MenuProps['onClick']`       | -       |
| iconProps    | Props for the ActionIcon component                | `Partial<ActionIconProps>`   | -       |
| size         | Size of the burger icon                           | `ActionIconProps['size']`    | -       |
| variant      | Variant of the ActionIcon component               | `ActionIconProps['variant']` | -       |
| drawerProps  | Props for the Drawer component                    | `Partial<DrawerProps>`       | -       |
