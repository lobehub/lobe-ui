---
nav: Components
group: Data Entry
title: FormModal
description: FormModal combines Form and Modal components to create a modal dialog with an integrated form. It provides a convenient way to collect user input in a popup interface.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Flat Type

<code src="./demos/Flat.tsx" nopadding></code>

## Scroll To Error

<code src="./demos/Error.tsx" nopadding></code>

## APIs

### FormModal

| Property          | Description                                   | Type                                              | Default        |
| ----------------- | --------------------------------------------- | ------------------------------------------------- | -------------- |
| classNames        | Custom class names for modal elements         | `{ form?: string } & ModalProps['classNames']`    | -              |
| onSubmit          | Callback when the form is submitted           | `ModalProps['onOk']`                              | -              |
| styles            | Custom styles for modal elements              | `{ form?: CSSProperties } & ModalProps['styles']` | -              |
| submitButtonProps | Props for the submit button                   | `ButtonProps`                                     | -              |
| submitLoading     | Whether the submit button is in loading state | `boolean`                                         | `false`        |
| submitText        | Text for the submit button                    | `string`                                          | `'Submit'`     |
| variant           | Style variant for the form                    | `'filled' \| 'outlined' \| 'borderless'`          | `'borderless'` |

FormModal combines the properties from both Form and Modal components. It includes properties from Form (except for 'className', 'style', and 'title') and properties from Modal (including 'title', 'width', 'open', etc.).

#### Modal Properties

| Property         | Description                                    | Type                                    | Default |
| ---------------- | ---------------------------------------------- | --------------------------------------- | ------- |
| open             | Whether the modal is visible                   | `boolean`                               | `false` |
| title            | Title of the modal                             | `ReactNode`                             | -       |
| width            | Width of the modal                             | `string \| number`                      | `520`   |
| centered         | Whether to center the modal                    | `boolean`                               | `false` |
| onCancel         | Callback when the modal is closed              | `(e) => void`                           | -       |
| allowFullscreen  | Whether to allow the modal to be fullscreen    | `boolean`                               | `false` |
| enableResponsive | Enable responsive sizing for different screens | `boolean`                               | `false` |
| paddings         | Custom padding for the modal                   | `{ desktop?: number; mobile?: number }` | -       |

For a complete list of Modal properties, see the [Modal](/components/modal) documentation.

#### Form Properties

FormModal includes most properties from the Form component, such as 'onFinish', 'items', 'layout', etc. For a complete list of Form properties, see the [Form](/components/form) documentation.
