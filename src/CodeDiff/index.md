---
nav: Components
group: Data Display
title: CodeDiff
description: The CodeDiff component is used to display code differences with syntax highlighting. It supports split and unified view modes, full-featured collapsible headers, patch rendering, custom actions, and visual variants for different display styles.
---

## Default

<code src="./demos/index.tsx" nopadding ></code>

## Unified View

<code src="./demos/Unified.tsx" ></code>

## Actions Render

Customize the header action area with `actionsRender`.

<code src="./demos/ActionsRender.tsx" ></code>

## Patch Diff

Render from a unified diff patch string.

<code src="./demos/Patch.tsx" ></code>

## Patch Full Featured

<code src="./demos/PatchFullFeatured.tsx" nopadding></code>

## Variants

<code src="./demos/Variants.tsx" ></code>

## APIs

### CodeDiff

| Property      | Description                                  | Type                                                                                        | Default    |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------- |
| oldContent    | Old content (before changes)                 | `string`                                                                                    | -          |
| newContent    | New content (after changes)                  | `string`                                                                                    | -          |
| language      | Programming language for syntax highlighting | `string`                                                                                    | -          |
| fileName      | File name to display                         | `string`                                                                                    | -          |
| viewMode      | View mode for diff display                   | `'split' \| 'unified'`                                                                      | `'split'`  |
| variant       | Visual style variant                         | `'filled' \| 'outlined' \| 'borderless'`                                                    | `'filled'` |
| showHeader    | Whether to show file header                  | `boolean`                                                                                   | `true`     |
| fullFeatured  | Whether to enable full-featured mode         | `boolean`                                                                                   | `true`     |
| defaultExpand | Default expansion state when fullFeatured    | `boolean`                                                                                   | `true`     |
| diffOptions   | Options for the underlying diff engine       | `FileDiffOptions<string>`                                                                   | -          |
| classNames    | Custom class names for different parts       | `{ header?: string; body?: string }`                                                        | -          |
| styles        | Custom inline styles for different parts     | `{ header?: CSSProperties; body?: CSSProperties }`                                          | -          |
| actionsRender | Custom render function for header actions    | `(props: { oldContent: string; newContent: string; originalNode: ReactNode }) => ReactNode` | -          |

### PatchDiff

| Property      | Description                                                 | Type                                                               | Default    |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ | ---------- |
| patch         | Unified diff patch string                                   | `string`                                                           | -          |
| language      | Programming language for syntax highlighting                | `string`                                                           | -          |
| fileName      | File name to display (extracted from patch if not provided) | `string`                                                           | -          |
| viewMode      | View mode for diff display                                  | `'split' \| 'unified'`                                             | `'split'`  |
| variant       | Visual style variant                                        | `'filled' \| 'outlined' \| 'borderless'`                           | `'filled'` |
| showHeader    | Whether to show file header                                 | `boolean`                                                          | `true`     |
| fullFeatured  | Whether to enable full-featured mode                        | `boolean`                                                          | `true`     |
| defaultExpand | Default expansion state when fullFeatured                   | `boolean`                                                          | `true`     |
| diffOptions   | Options for the underlying diff engine                      | `FileDiffOptions<string>`                                          | -          |
| classNames    | Custom class names for different parts                      | `{ header?: string; body?: string }`                               | -          |
| styles        | Custom inline styles for different parts                    | `{ header?: CSSProperties; body?: CSSProperties }`                 | -          |
| actionsRender | Custom render function for header actions                   | `(props: { patch: string; originalNode: ReactNode }) => ReactNode` | -          |
