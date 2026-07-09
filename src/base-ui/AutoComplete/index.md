---
nav: Components
group: Data Entry
title: AutoComplete
description: Base UI-powered AutoComplete input with filtered suggestions.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/AutoComplete/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/AutoComplete/AutoComplete.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property        | Description                        | Type                                         | Default  |
| --------------- | ---------------------------------- | -------------------------------------------- | -------- |
| options         | Suggestion list                    | `(string \| { value; label?; disabled? })[]` | `[]`     |
| value           | Controlled input value             | `string`                                     | -        |
| onChange        | Fires on typing or item pick       | `(value: string) => void`                    | -        |
| onSearch        | Alias fired together with onChange | `(value: string) => void`                    | -        |
| allowClear      | Show clear button                  | `boolean`                                    | -        |
| emptyText       | Content when nothing matches       | `ReactNode`                                  | -        |
| variant         | Input visual variant               | `'filled' \| 'outlined' \| 'borderless'`     | auto     |
| size            | Input size                         | `'small' \| 'middle' \| 'large'`             | `middle` |
| shadow          | Apply lobe shadow style            | `boolean`                                    | -        |
| prefix / suffix | Input slots                        | `ReactNode`                                  | -        |

Filtering is built into Base UI Autocomplete; items are matched against the typed value automatically.
