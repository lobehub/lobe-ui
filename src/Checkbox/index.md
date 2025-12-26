---
nav: Components
group:
  title: General
  order: -1
title: Checkbox
description: Checkbox is a component for rendering checkbox inputs with customizable size, styling, and optional text labels. It supports controlled and uncontrolled modes. CheckboxGroup allows you to manage multiple checkboxes together.
---

## Introduction

Checkbox is a versatile checkbox component that provides a clean and customizable way to create checkbox inputs. It supports both controlled and uncontrolled modes, customizable sizes, and optional text labels. CheckboxGroup allows you to manage multiple checkboxes together with shared state and styling.

## Basic Usage

<code src="./demos/index.tsx" nopadding></code>

## Size

Checkbox supports custom size values. You can set the size by passing a number value.

<code src="./demos/Size.tsx" center></code>

## With Text

Checkbox can display text labels alongside the checkbox. Simply pass the text as children.

<code src="./demos/WithText.tsx" center></code>

## Indeterminate

Checkbox supports indeterminate state, which is useful for "check all" scenarios. When some but not all items are selected, the checkbox shows an indeterminate state.

<code src="./demos/Indeterminate.tsx" center></code>

## CheckboxGroup

CheckboxGroup allows you to manage multiple checkboxes together. It supports both string arrays and object arrays for options. You can use it via `Checkbox.Group` or import `CheckboxGroup` directly.

### Basic Usage

<code src="./demos/CheckboxGroup.tsx" nopadding></code>

### Using Checkbox.Group

You can also use `Checkbox.Group` for a more convenient API:

<code src="./demos/CheckboxGroupUsage.tsx" center></code>

### With Options

You can use object arrays to provide more control over each option, including custom labels and disabled states.

<code src="./demos/CheckboxGroupOptions.tsx" center></code>

### Disabled State

CheckboxGroup supports both global disabled state and individual option disabled state.

<code src="./demos/CheckboxGroupDisabled.tsx" center></code>

## APIs

### Checkbox

| Property        | Description                          | Type                                                                          | Default |
| --------------- | ------------------------------------ | ----------------------------------------------------------------------------- | ------- |
| backgroundColor | Custom background color when checked | `string`                                                                      | -       |
| checked         | Controlled checked state             | `boolean`                                                                     | -       |
| children        | Text label content                   | `ReactNode`                                                                   | -       |
| className       | Custom class name                    | `string`                                                                      | -       |
| classNames      | Custom class names for sub-elements  | `{ checkbox?: string; text?: string; wrapper?: string }`                      | -       |
| defaultChecked  | Default checked state                | `boolean`                                                                     | `false` |
| disabled        | Disable the checkbox                 | `boolean`                                                                     | `false` |
| indeterminate   | Indeterminate state                  | `boolean`                                                                     | `false` |
| onChange        | Change event handler                 | `(checked: boolean) => void`                                                  | -       |
| shape           | Checkbox shape                       | `'square' \| 'circle'`                                                        | -       |
| size            | Checkbox size                        | `number`                                                                      | `16`    |
| style           | Custom styles                        | `CSSProperties`                                                               | -       |
| styles          | Custom styles for sub-elements       | `{ checkbox?: CSSProperties; text?: CSSProperties; wrapper?: CSSProperties }` | -       |
| textProps       | Additional props for text element    | `Omit<TextProps, 'children' \| 'className' \| 'style'>`                       | -       |

### CheckboxGroup

| Property     | Description                        | Type                                                    | Default |
| ------------ | ---------------------------------- | ------------------------------------------------------- | ------- |
| defaultValue | Default selected values            | `string[]`                                              | -       |
| disabled     | Disable all checkboxes             | `boolean`                                               | `false` |
| onChange     | Change event handler               | `(value: string[]) => void`                             | -       |
| options      | Options array                      | `string[] \| CheckboxGroupOption[]`                     | -       |
| textProps    | Additional props for text elements | `Omit<TextProps, 'children' \| 'className' \| 'style'>` | -       |
| value        | Controlled selected values         | `string[]`                                              | -       |

### CheckboxGroupOption

| Property | Description                   | Type        | Default |
| -------- | ----------------------------- | ----------- | ------- |
| disabled | Disable this option           | `boolean`   | `false` |
| label    | Option label content          | `ReactNode` | -       |
| value    | Option value (must be string) | `string`    | -       |

**Note:** CheckboxGroup extends `FlexboxProps`, so you can use all Flexbox properties like `gap`, `horizontal`, `vertical`, `align`, `justify`, etc.
