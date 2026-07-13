---
nav: Components
group: Data Entry
title: Form
description: Base UI-powered Form with settings-style groups, fields and submit footer.
subType: base-ui
apiHeader:
  pkg: '@lobehub/ui/base-ui'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Form/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/base-ui/Form/Form.tsx'
---

## Items Config

<code src="./demos/index.tsx" nopadding></code>

## Compound Components & Validation

<code src="./demos/compound.tsx" nopadding></code>

## All Field-aware Controls

Input / AutoComplete / InputNumber / Slider / Switch / Checkbox all join the form's value collection.

<code src="./demos/controls.tsx" nopadding></code>

## Zod Schema Validation

Per-field via `validate`, or form-level with `safeParse` + the `errors` prop.

<code src="./demos/zod.tsx" nopadding></code>

## Float Submit Footer

<code src="./demos/float.tsx" nopadding></code>

## APIs

### Form

Wraps Base UI `Form`: native validation, `errors` prop passthrough for external/server errors, `validationMode`.

| Property       | Description                                                                    | Type                                              | Default      |
| -------------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | ------------ |
| items          | Config-driven groups or fields                                                 | `FormGroupItemType[] \| FormFieldProps[]`         | -            |
| itemsType      | Interpret `items` as grouped or flat                                           | `'group' \| 'flat'`                               | `group`      |
| variant        | Visual variant of groups                                                       | `'filled' \| 'outlined' \| 'borderless'`          | `borderless` |
| layout         | Field layout, mobile falls back to vertical                                    | `'horizontal' \| 'vertical'`                      | `horizontal` |
| initialValues  | Distributed to fields as `defaultValue` by name; baseline for unsaved tracking | `Record<string, any>`                             | -            |
| onFinish       | Submit callback with collected values; async drives submit loading             | `(values, eventDetails) => void \| Promise<void>` | -            |
| errors         | External validation errors keyed by field name                                 | `Record<string, string \| string[]>`              | -            |
| validationMode | When fields validate                                                           | `'onSubmit' \| 'onBlur' \| 'onChange'`            | `onSubmit`   |
| collapsible    | Whether groups are collapsible                                                 | `boolean`                                         | -            |
| footer         | Rendered after fields, e.g. `<Form.SubmitFooter />`                            | `ReactNode`                                       | -            |
| itemMinWidth   | Min width of field controls                                                    | `string \| number`                                | -            |
| gap            | Gap between groups                                                             | `string \| number`                                | -            |

### Form.Field (FormField)

Wraps Base UI `Field.Root`; any `Field`-aware control (base-ui `Input`, `TextArea`, `Switch`, ...) participates in validation and value collection.

| Property | Description                                             | Type                                                | Default   |
| -------- | ------------------------------------------------------- | --------------------------------------------------- | --------- |
| label    | Field title                                             | `ReactNode`                                         | -         |
| desc     | Description under the title                             | `ReactNode`                                         | -         |
| avatar   | Node before the title                                   | `ReactNode`                                         | -         |
| tag      | Tag after the title                                     | `string`                                            | -         |
| name     | Field name for form values                              | `string`                                            | -         |
| required | Injected into the control, drives native `valueMissing` | `boolean`                                           | -         |
| validate | Custom validator, return error message(s) or `null`     | `(value, formValues) => string \| string[] \| null` | -         |
| layout   | Override form layout                                    | `'horizontal' \| 'vertical'`                        | inherited |
| minWidth | Min width of the control column                         | `string \| number`                                  | inherited |
| divider  | Render a divider above (auto-managed by `items`)        | `boolean`                                           | `false`   |
| hidden   | Skip rendering                                          | `boolean`                                           | -         |

### Form.Group (FormGroup)

| Property      | Description                    | Type                                     | Default                  |
| ------------- | ------------------------------ | ---------------------------------------- | ------------------------ |
| title         | Group title                    | `ReactNode`                              | -                        |
| desc          | Description under the title    | `ReactNode`                              | -                        |
| icon          | Icon before the title          | `IconProps['icon']`                      | -                        |
| extra         | Node at the end of the header  | `ReactNode`                              | -                        |
| collapsible   | Whether the group can collapse | `boolean`                                | `true` unless borderless |
| defaultActive | Initially expanded             | `boolean`                                | `true`                   |
| active        | Controlled expanded state      | `boolean`                                | -                        |
| onCollapse    | Expanded state change callback | `(active: boolean) => void`              | -                        |
| variant       | Visual variant                 | `'filled' \| 'outlined' \| 'borderless'` | `borderless`             |

### Form.SubmitFooter (FormSubmitFooter)

| Property             | Description                                       | Type                                             | Default |
| -------------------- | ------------------------------------------------- | ------------------------------------------------ | ------- |
| float                | Float above the page, revealed on unsaved changes | `boolean`                                        | `false` |
| enableReset          | Show reset button when there are unsaved changes  | `boolean`                                        | `true`  |
| enableUnsavedWarning | `beforeunload` warning while changes are unsaved  | `boolean`                                        | -       |
| onReset              | Called after native `form.reset()`                | `() => void`                                     | -       |
| texts                | Override submit/reset/unsaved texts               | `{ submit?; reset?; unSaved?; unSavedWarning? }` | i18n    |
