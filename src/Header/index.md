---
nav: Components
group: Layout
title: Header
description: The Header component is a customizable header section with a logo, navigation, and actions. It is responsive and adapts to mobile and desktop screens.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property         | Description                                    | Type            | Default |
| ---------------- | ---------------------------------------------- | --------------- | ------- |
| logo             | Logo content                                   | `ReactNode`     | -       |
| logoClassName    | Custom class name for the logo container       | `string`        | -       |
| logoStyle        | Custom style for the logo container            | `CSSProperties` | -       |
| nav              | Navigation content                             | `ReactNode`     | -       |
| navClassName     | Custom class name for the navigation container | `string`        | -       |
| navStyle         | Custom style for the navigation container      | `CSSProperties` | -       |
| actions          | Action buttons or elements                     | `ReactNode`     | -       |
| actionsClassName | Custom class name for the actions container    | `string`        | -       |
| actionsStyle     | Custom style for the actions container         | `CSSProperties` | -       |

> Additional props are inherited from `FlexboxProps` from the react-layout-kit library.
