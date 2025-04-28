---
nav: Components
group: Feedback
title: Modal
description: Modal component displays content in a layer that appears above the page, requiring user interaction before continuing. It provides a focused and contextual way to present information or gather input.
---

## Default

<code src="./demos/index.tsx" center></code>

## APIs

### Modal

| Property          | Description                                          | Type                                    | Default           |
| ----------------- | ---------------------------------------------------- | --------------------------------------- | ----------------- |
| allowFullscreen   | Whether the modal can be expanded to full screen     | `boolean`                               | `false`           |
| enableResponsive  | Auto switch to Drawer component on mobile screens    | `boolean`                               | `true`            |
| height            | Height of the modal content area                     | `string \| number`                      | `'75dvh'`         |
| open              | Whether the modal is visible                         | `boolean`                               | `false`           |
| paddings          | Custom padding for different screen sizes            | `{ desktop?: number; mobile?: number }` | `{ desktop: 16 }` |
| title             | Title of the modal                                   | `ReactNode`                             | `' '`             |
| width             | Width of the modal                                   | `string \| number`                      | `700`             |
| onCancel          | Callback when the modal is closed                    | `(e) => void`                           | -                 |
| onOk              | Callback when the OK button is clicked               | `(e) => void`                           | -                 |
| okText            | Text of the OK button                                | `ReactNode`                             | `'OK'`            |
| cancelText        | Text of the cancel button                            | `ReactNode`                             | `'Cancel'`        |
| okButtonProps     | Props of the OK button                               | `ButtonProps`                           | -                 |
| cancelButtonProps | Props of the cancel button                           | `ButtonProps`                           | -                 |
| confirmLoading    | Whether to show a loading indicator on the OK button | `boolean`                               | `false`           |
| footer            | Footer content of the modal                          | `ReactNode \| null \| false`            | Default buttons   |

Modal inherits most properties from Ant Design's Modal component, except for 'okType' and 'wrapClassName'. When displayed on mobile screens (when enableResponsive is true), it automatically switches to a Drawer component with a bottom placement.

#### Responsive Behavior

On desktop screens, the component renders as a traditional modal dialog. On mobile screens, it transforms into a bottom drawer for better mobile user experience. The responsiveness is handled automatically, but can be disabled by setting `enableResponsive` to `false`.
