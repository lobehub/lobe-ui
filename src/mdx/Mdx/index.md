---
nav: Mdx
group: Components
title: Mdx
atomId: Mdx
description: A component that renders MDX content with enhanced features like LaTeX support, Mermaid diagrams, and customized MDX components.
apiHeader:
  pkg: '@lobehub/ui/mdx'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/Mdx/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/mdx/Mdx/index.ts'
---

## Usage

<code src="./demos/index.tsx" nopadding></code>

## APIs

| Property              | Description                                | Type                 | Default    |
| --------------------- | ------------------------------------------ | -------------------- | ---------- |
| children              | The MDX content as a string                | `string`             | -          |
| components            | Custom MDX components to override defaults | `any[]`              | `{}`       |
| enableImageGallery    | Enable image preview gallery for images    | `boolean`            | `true`     |
| enableLatex           | Enable LaTeX math rendering                | `boolean`            | `true`     |
| enableMermaid         | Enable Mermaid diagram rendering           | `boolean`            | `true`     |
| fallback              | Content to display while MDX is compiling  | `ReactNode`          | `null`     |
| fullFeaturedCodeBlock | Enable full features in code blocks        | `boolean`            | `true`     |
| onDoubleClick         | Handler for double-click events            | `() => void`         | -          |
| rehypePlugins         | Additional rehype plugins                  | `Pluggable[]`        | -          |
| remarkPlugins         | Additional remark plugins                  | `Pluggable[]`        | -          |
| variant               | Styling variant                            | `'normal' \| 'chat'` | `'normal'` |
| className             | Additional CSS class                       | `string`             | -          |
| style                 | Additional styles                          | `CSSProperties`      | -          |

_Note: The component also accepts typography-related props from the Typography component._
