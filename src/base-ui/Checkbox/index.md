---
nav: Components
group: Data Entry
title: Checkbox
description: Base UI-powered Checkbox and CheckboxGroup with lobe visual style.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Checkbox/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Checkbox/Checkbox.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

### Checkbox

| Property        | Description                            | Type                         | Default  |
| --------------- | -------------------------------------- | ---------------------------- | -------- |
| checked         | Controlled state                       | `boolean`                    | -        |
| defaultChecked  | Uncontrolled initial state             | `boolean`                    | -        |
| onChange        | State change callback                  | `(checked: boolean) => void` | -        |
| indeterminate   | Show minus indicator                   | `boolean`                    | -        |
| size            | Box size in pixels                     | `number`                     | `16`     |
| shape           | Box shape                              | `'square' \| 'circle'`       | `square` |
| backgroundColor | Checked background color               | `string`                     | primary  |
| children        | Label content                          | `ReactNode`                  | -        |
| name            | Form field name (renders hidden input) | `string`                     | -        |
| disabled        | Disable interaction                    | `boolean`                    | -        |

### CheckboxGroup

| Property     | Description                | Type                                        | Default |
| ------------ | -------------------------- | ------------------------------------------- | ------- |
| options      | Checkbox list              | `(string \| { value; label; disabled? })[]` | -       |
| value        | Controlled selected values | `string[]`                                  | -       |
| defaultValue | Initial selected values    | `string[]`                                  | -       |
| onChange     | Selection change callback  | `(value: string[]) => void`                 | -       |
| horizontal   | Row layout                 | `boolean`                                   | `true`  |
| gap          | Gap between items          | `number`                                    | `12`    |
