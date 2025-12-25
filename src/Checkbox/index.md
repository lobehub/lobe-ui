---
nav: Components
group:
  title: General
  order: -1
title: Checkbox
description: Checkbox is a component for rendering checkbox inputs with customizable size, styling, and optional text labels. It supports controlled and uncontrolled modes.
---

## Introduction

Checkbox is a versatile checkbox component that provides a clean and customizable way to create checkbox inputs. It supports both controlled and uncontrolled modes, customizable sizes, and optional text labels.

## Basic Usage

<code src="./demos/index.tsx" nopadding></code>

## Size

Checkbox supports custom size values. You can set the size by passing a number value.

<code src="./demos/Size.tsx" center></code>

## With Text

Checkbox can display text labels alongside the checkbox. Simply pass the text as children.

<code src="./demos/WithText.tsx" center></code>

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
| onChange        | Change event handler                 | `(checked: boolean) => void`                                                  | -       |
| shape           | Checkbox shape                       | `'square' \| 'circle'`                                                        | -       |
| size            | Checkbox size                        | `number`                                                                      | `16`    |
| style           | Custom styles                        | `CSSProperties`                                                               | -       |
| styles          | Custom styles for sub-elements       | `{ checkbox?: CSSProperties; text?: CSSProperties; wrapper?: CSSProperties }` | -       |
| textProps       | Additional props for text element    | `Omit<TextProps, 'children' \| 'className' \| 'style'>`                       | -       |
