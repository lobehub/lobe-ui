---
nav: Components
group: Data Display
title: Highlighter
description: The Highlighter component is used to display syntax-highlighted code blocks with powerful features like code copying, language selection, custom themes, and transformers. It supports multiple display variants, expandable views, and customizable actions.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Full Featured

<code src="./demos/FullFeatured.tsx" nopadding></code>

## Actions Render

<code src="./demos/ActionsRender.tsx"></code>

## APIs

### Highlighter

| Property            | Description                                  | Type                                                                                                                             | Default |
| ------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| children            | Code content to highlight                    | `string`                                                                                                                         | -       |
| language            | Programming language for syntax highlighting | `string`                                                                                                                         | -       |
| variant             | Visual style variant                         | `'filled' \| 'outlined' \| 'borderless'`                                                                                         | -       |
| theme               | Syntax highlighting theme                    | `'lobe-theme' \| BuiltinTheme`                                                                                                   | -       |
| copyable            | Whether to show copy button                  | `boolean`                                                                                                                        | `true`  |
| showLanguage        | Whether to display language label            | `boolean`                                                                                                                        | `true`  |
| fileName            | Filename to display                          | `string`                                                                                                                         | -       |
| icon                | Custom icon                                  | `ReactNode`                                                                                                                      | -       |
| shadow              | Whether to show shadow                       | `boolean`                                                                                                                        | `false` |
| wrap                | Whether to enable text wrapping              | `boolean`                                                                                                                        | `false` |
| fullFeatured        | Whether to enable all features               | `boolean`                                                                                                                        | `false` |
| defaultExpand       | Default expansion state when fullFeatured    | `boolean`                                                                                                                        | `true`  |
| allowChangeLanguage | Whether to allow language switching          | `boolean`                                                                                                                        | `false` |
| enableTransformer   | Whether to enable content transformers       | `boolean`                                                                                                                        | `false` |
| actionIconSize      | Size of action icons                         | `ActionIconProps['size']`                                                                                                        | -       |
| actionsRender       | Custom render function for actions           | `(props: { actionIconSize: ActionIconProps['size']; content: string; language: string; originalNode: ReactNode; }) => ReactNode` | -       |
| bodyRender          | Custom render function for body content      | `(props: { content: string; language: string; originalNode: ReactNode }) => ReactNode`                                           | -       |

### SyntaxHighlighter

| Property          | Description                                  | Type                                     | Default |
| ----------------- | -------------------------------------------- | ---------------------------------------- | ------- |
| children          | Code content to highlight                    | `string`                                 | -       |
| language          | Programming language for syntax highlighting | `string`                                 | -       |
| theme             | Syntax highlighting theme                    | `'lobe-theme' \| BuiltinTheme`           | -       |
| variant           | Visual style variant                         | `'filled' \| 'outlined' \| 'borderless'` | -       |
| enableTransformer | Whether to enable content transformers       | `boolean`                                | -       |
