---
nav: Components
group: Data Entry
title: Select
description: Base UI-powered Select component.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Select/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Select/index.tsx'
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Atom Components

<code src="./demos/atoms.tsx" nopadding></code>

## Custom Render

<code src="./demos/render.tsx" nopadding></code>

## Selected Indicator Variant

<code src="./demos/indicator.tsx" nopadding></code>

## Virtual List

<code src="./demos/virtual.tsx" nopadding></code>

## APIs

### Select

| Property                 | Description                                                                                                      | Type                                     | Default                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| allowClear               | Show clear button                                                                                                | `boolean`                                | -                                        |
| autoFocus                | Get focus when component mounted                                                                                 | `boolean`                                | -                                        |
| behaviorVariant          | Behavior variant for positioning. `default`: regular dropdown; `item-aligned`: aligns selected item with trigger | `'default' \| 'item-aligned'`            | `'default'`                              |
| className                | The className of container                                                                                       | `string`                                 | -                                        |
| classNames               | Semantic DOM class names                                                                                         | `SelectClassNames`                       | -                                        |
| defaultOpen              | Initial open state of dropdown                                                                                   | `boolean`                                | -                                        |
| defaultValue             | Initial selected value                                                                                           | `Value \| Value[] \| null`               | -                                        |
| disabled                 | Whether disabled select                                                                                          | `boolean`                                | -                                        |
| id                       | The id of container                                                                                              | `string`                                 | -                                        |
| labelRender              | Custom render for selected label                                                                                 | `(option: SelectOption) => ReactNode`    | -                                        |
| listHeight               | Height of dropdown list                                                                                          | `number`                                 | `256`                                    |
| listItemHeight           | Height of each option item                                                                                       | `number`                                 | -                                        |
| loading                  | Show loading indicator                                                                                           | `boolean`                                | -                                        |
| mode                     | Set mode of Select. `multiple`: multiple select; `tags`: tags input mode                                         | `'multiple' \| 'tags'`                   | -                                        |
| name                     | The name of form field                                                                                           | `string`                                 | -                                        |
| onChange                 | Called when value changes                                                                                        | `(value, option) => void`                | -                                        |
| onOpenChange             | Called when dropdown open state changes                                                                          | `(open: boolean) => void`                | -                                        |
| onSelect                 | Called when an option is selected                                                                                | `(value, option) => void`                | -                                        |
| open                     | Controlled open state of dropdown                                                                                | `boolean`                                | -                                        |
| optionRender             | Custom render for option                                                                                         | `(option, info: { index }) => ReactNode` | -                                        |
| options                  | Select options                                                                                                   | `SelectOptions`                          | -                                        |
| placeholder              | Placeholder of select                                                                                            | `ReactNode`                              | -                                        |
| popupClassName           | ClassName of dropdown menu                                                                                       | `string`                                 | -                                        |
| popupMatchSelectWidth    | Whether popup width matches select width. Set `false` to auto width, or a number for fixed width                 | `boolean \| number`                      | `true`                                   |
| prefix                   | Prefix element                                                                                                   | `ReactNode \| IconProps['icon']`         | -                                        |
| readOnly                 | Whether readonly mode                                                                                            | `boolean`                                | -                                        |
| required                 | Whether required                                                                                                 | `boolean`                                | -                                        |
| selectedIndicatorVariant | How selected items are indicated. `check`: checkmark icon; `bold`: bold text                                     | `'check' \| 'bold'`                      | `'check'`                                |
| shadow                   | Enable shadow effect                                                                                             | `boolean`                                | -                                        |
| showSearch               | Whether to show search input                                                                                     | `boolean`                                | -                                        |
| size                     | Size of Select                                                                                                   | `'large' \| 'middle' \| 'small'`         | `'middle'`                               |
| style                    | CSS style of container                                                                                           | `CSSProperties`                          | -                                        |
| suffixIcon               | Suffix icon                                                                                                      | `IconProps['icon'] \| ReactNode`         | -                                        |
| suffixIconProps          | Props for suffix icon                                                                                            | `Omit<IconProps, 'icon'>`                | -                                        |
| tokenSeparators          | Separator characters used to tokenize in tags mode                                                               | `string[]`                               | -                                        |
| value                    | Current selected value                                                                                           | `Value \| Value[] \| null`               | -                                        |
| variant                  | Style variant                                                                                                    | `'borderless' \| 'filled' \| 'outlined'` | Dark: `'filled'`<br/>Light: `'outlined'` |
| virtual                  | Enable virtual scroll                                                                                            | `boolean`                                | -                                        |

### SelectOption

| Property  | Description                | Type            | Default |
| --------- | -------------------------- | --------------- | ------- |
| className | The className of option    | `string`        | -       |
| disabled  | Whether disabled           | `boolean`       | -       |
| label     | Display text of option     | `ReactNode`     | -       |
| style     | CSS style of option        | `CSSProperties` | -       |
| title     | Title attribute for option | `string`        | -       |
| value     | Value of option            | `Value`         | -       |

### SelectOptionGroup

| Property | Description           | Type             | Default |
| -------- | --------------------- | ---------------- | ------- |
| disabled | Whether disabled      | `boolean`        | -       |
| label    | Display text of group | `ReactNode`      | -       |
| options  | Options in this group | `SelectOption[]` | -       |

### SelectClassNames

| Property      | Description                          |
| ------------- | ------------------------------------ |
| clear         | Clear button                         |
| dropdown      | Dropdown container (alias for popup) |
| empty         | Empty state                          |
| group         | Option group                         |
| groupLabel    | Group label                          |
| icon          | Suffix icon                          |
| item          | Option item                          |
| itemIndicator | Selected indicator                   |
| itemText      | Option text                          |
| list          | Options list                         |
| option        | Option item (alias for item)         |
| popup         | Popup container                      |
| prefix        | Prefix element                       |
| root          | Root container (alias for trigger)   |
| search        | Search input container               |
| suffix        | Suffix container                     |
| trigger       | Trigger element                      |
| value         | Value display                        |
