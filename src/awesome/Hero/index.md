---
nav: Awesome
group: Data Display
title: Hero
description: Hero is a component for creating attractive landing page hero sections with a title, description, and customizable action buttons.
apiHeader:
  pkg: '@lobehub/ui/awesome'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/Hero/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/Hero/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property    | Description                          | Type           | Default |
| ----------- | ------------------------------------ | -------------- | ------- |
| title       | Main title text                      | `string`       | -       |
| description | Description text                     | `string`       | -       |
| actions     | Array of action buttons              | `HeroAction[]` | -       |
| Link        | Custom component for rendering links | `ElementType`  | -       |

### HeroAction

| Property     | Description                     | Type                     | Default |
| ------------ | ------------------------------- | ------------------------ | ------- |
| text         | Button text                     | `string`                 | -       |
| link         | URL to navigate to              | `string`                 | -       |
| type         | Button type                     | `'primary' \| 'default'` | -       |
| github       | Whether to show GitHub icon     | `boolean`                | -       |
| openExternal | Whether to open link in new tab | `boolean`                | -       |
