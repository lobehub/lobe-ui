---
nav: Components
group: Data Entry
title: ThemeSwitch
description: ThemeSwitch component is a dropdown menu that allows users to switch between different theme modes.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property      | Description                        | Type                                            | Default  |
| ------------- | ---------------------------------- | ----------------------------------------------- | -------- |
| themeMode     | Current theme mode                 | `'light' \| 'dark' \| 'auto'`                   | -        |
| onThemeSwitch | Callback when theme mode changes   | `(themeMode: ThemeMode) => void`                | -        |
| type          | Display type of the theme switcher | `'icon' \| 'select'`                            | `'icon'` |
| size          | Size of the component              | `'small' \| 'middle' \| 'large'`                | -        |
| variant       | Style variant of the component     | `'text' \| 'outlined' \| 'contained' \| 'pure'` | -        |
| labels        | Custom labels for each theme mode  | `{ auto: string; dark: string; light: string }` | -        |
