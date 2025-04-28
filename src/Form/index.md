---
nav: Components
group: Data Entry
title: Form
description: High performance Form component with data scope management. Including data collection, verification, and styles.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Flat Type

<code src="./demos/Flat.tsx" nopadding></code>

## State Control

<code src="./demos/StateControl.tsx" nopadding></code>

## Submit Footer

<code iframe src="./demos/SubmitFooter.tsx" nopadding></code>

## APIs

### Form

| Property         | Description                                       | Type                                     | Default        |
| ---------------- | ------------------------------------------------- | ---------------------------------------- | -------------- |
| activeKey        | Currently active keys for collapsible form groups | `(string \| number)[]`                   | -              |
| classNames       | Custom class names for form elements              | `{ group?: string; item?: string }`      | -              |
| collapsible      | Enable collapsible form groups                    | `boolean`                                | `false`        |
| defaultActiveKey | Default active keys for collapsible form groups   | `(string \| number)[]`                   | -              |
| footer           | Custom footer content                             | `ReactNode`                              | -              |
| gap              | Gap between form elements                         | `number \| string`                       | -              |
| itemMinWidth     | Minimum width for form items                      | `string \| number`                       | -              |
| itemVariant      | Style variant for form items                      | `AntFormProps['variant']`                | -              |
| items            | Form items configuration                          | `FormGroupItemType[] \| FormItemProps[]` | `[]`           |
| itemsType        | Type of form items layout                         | `'group' \| 'flat'`                      | `'group'`      |
| onCollapse       | Callback when collapsible groups change           | `(key: (string \| number)[]) => void`    | -              |
| variant          | Style variant of the form                         | `'filled' \| 'outlined' \| 'borderless'` | `'borderless'` |

In addition to the above props, Form inherits all properties from Ant Design's Form component.

### Form.Item

| Property | Description                                   | Type               | Default |
| -------- | --------------------------------------------- | ------------------ | ------- |
| avatar   | Avatar to display next to form item title     | `ReactNode`        | -       |
| desc     | Description text for the form item            | `ReactNode`        | -       |
| divider  | Whether to show a divider after the form item | `boolean`          | `false` |
| hidden   | Whether to hide the form item                 | `boolean`          | `false` |
| minWidth | Minimum width of the form item                | `string \| number` | -       |
| tag      | Tag to display next to form item title        | `TagProps`         | -       |
| variant  | Style variant for the form item               | `FormVariant`      | -       |

Form.Item also inherits all properties from Ant Design's Form.Item component.

### Form.SubmitFooter

| Property             | Description                                   | Type                                                                             | Default |
| -------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- | ------- |
| buttonProps          | Props applied to both buttons                 | `Omit<ButtonProps, 'children'>`                                                  | -       |
| enableReset          | Whether to show the reset button              | `boolean`                                                                        | `true`  |
| enableUnsavedWarning | Show warning when there are unsaved changes   | `boolean`                                                                        | `false` |
| float                | Whether the footer should float at the bottom | `boolean`                                                                        | `false` |
| onReset              | Callback when reset button is clicked         | `(value: any, preValue: any) => void`                                            | -       |
| resetButtonProps     | Props for the reset button                    | `Omit<ButtonProps, 'children'>`                                                  | -       |
| saveButtonProps      | Props for the save/submit button              | `Omit<ButtonProps, 'children'>`                                                  | -       |
| texts                | Custom text for buttons and warnings          | `{ reset?: string; submit?: string; unSaved?: string; unSavedWarning?: string }` | -       |

Form.SubmitFooter also inherits all properties from Flexbox component except for 'onReset'.
