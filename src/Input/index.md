---
nav: Components
group: Data Entry
title: Input
description: A basic widget for getting the user input is a text field. Keyboard and mouse can be used for providing or changing data.
---

## Default

The rest of the props of Input are exactly the same as the original [input](https://ant.design/components/input).

<code src="./demos/index.tsx" nopadding></code>

## TextArea

<code src="./demos/TextArea.tsx" nopadding></code>

## InputNumber

<code src="./demos/InputNumber.tsx" nopadding></code>

## InputPassword

<code src="./demos/InputPassword.tsx" nopadding></code>

## InputOPT

<code src="./demos/InputOPT.tsx" nopadding></code>

## APIs

### Input

| Property | Description                        | Type                                     | Default                                            |
| -------- | ---------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| shadow   | Enable shadow effect for the input | `boolean`                                | `false`                                            |
| variant  | Style variant of the input         | `'filled' \| 'outlined' \| 'borderless'` | Dark mode: `'filled'`<br/>Light mode: `'outlined'` |

Input inherits all properties from Ant Design's Input component.

### Input.TextArea

| Property | Description                           | Type                                     | Default                                            |
| -------- | ------------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| shadow   | Enable shadow effect for the textarea | `boolean`                                | `false`                                            |
| variant  | Style variant of the textarea         | `'filled' \| 'outlined' \| 'borderless'` | Dark mode: `'filled'`<br/>Light mode: `'outlined'` |
| resize   | Whether textarea is resizable         | `boolean`                                | `false`                                            |

TextArea inherits all properties from Ant Design's Input.TextArea component.

### Input.Number

| Property | Description                        | Type                                     | Default                                            |
| -------- | ---------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| shadow   | Enable shadow effect for the input | `boolean`                                | `false`                                            |
| variant  | Style variant of the input         | `'filled' \| 'outlined' \| 'borderless'` | Dark mode: `'filled'`<br/>Light mode: `'outlined'` |

InputNumber inherits all properties from Ant Design's InputNumber component.

### Input.Password

| Property | Description                        | Type                                     | Default                                            |
| -------- | ---------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| shadow   | Enable shadow effect for the input | `boolean`                                | `false`                                            |
| variant  | Style variant of the input         | `'filled' \| 'outlined' \| 'borderless'` | Dark mode: `'filled'`<br/>Light mode: `'outlined'` |

InputPassword inherits all properties from Ant Design's Input.Password component.

### Input.OPT

| Property | Description                        | Type                                     | Default                                            |
| -------- | ---------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| shadow   | Enable shadow effect for the input | `boolean`                                | `false`                                            |
| variant  | Style variant of the input         | `'filled' \| 'outlined' \| 'borderless'` | Dark mode: `'filled'`<br/>Light mode: `'outlined'` |

InputOPT inherits all properties from Ant Design's Input.OTP component.
