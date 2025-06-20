---
nav: Components
group: Data Display
title: Markdown
description: Markdown is a React component used to render markdown text. It supports various markdown syntax such as headings, lists, links, images, code blocks and more. It is commonly used in documentation, blogs, and other text-heavy applications.
---

## Default

<code src="./demos/index.tsx" iframe nopadding></code>

## Chat Mode

<code src="./demos/chat.tsx" iframe nopadding></code>

## Streaming

<code src="./demos/streaming.tsx" iframe nopadding></code>

## Github Syntax Guide

<code src="./demos/github.tsx" iframe nopadding></code>

## Shiki Transformers

<code src="./demos/transformer.tsx" iframe nopadding></code>

## Custom Markdown Components

<code src="./demos/customComponents.tsx" iframe nopadding></code>

## Custom Highlight

<code iframe src="./demos/customHighlight.tsx"></code>

## Citations

<code iframe src="./demos/citations/index.tsx"></code>

<code iframe src="./demos/citations/footnotes.tsx"></code>

## Think

<code iframe src="./demos/thinking/index.tsx"></code>

## Custom Plugins

<code iframe src="./demos/customPlugins/index.tsx" nopadding></code>

## APIs

| Property              | Description                                            | Type                                                                                               | Default     |
| --------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ----------- |
| children              | Markdown content to render                             | `string`                                                                                           | -           |
| variant               | Determines the style variant of the markdown           | `'default' \| 'chat'`                                                                              | `'default'` |
| allowHtml             | Whether to allow HTML in markdown content              | `boolean`                                                                                          | `false`     |
| citations             | Citations data for footnotes                           | `CitationItem[]`                                                                                   | -           |
| enableLatex           | Enable LaTeX math expressions                          | `boolean`                                                                                          | `true`      |
| enableMermaid         | Enable Mermaid diagrams                                | `boolean`                                                                                          | `true`      |
| enableImageGallery    | Enable image gallery for images                        | `boolean`                                                                                          | `true`      |
| enableCustomFootnotes | Enable custom footnotes rendering                      | `boolean`                                                                                          | -           |
| fullFeaturedCodeBlock | Use full-featured code blocks with additional controls | `boolean`                                                                                          | -           |
| showFootnotes         | Show footnotes section                                 | `boolean`                                                                                          | -           |
| fontSize              | Base font size in pixels                               | `number`                                                                                           | `14`        |
| lineHeight            | Line height multiplier                                 | `number`                                                                                           | `1.6`       |
| headerMultiple        | Header size multiplier                                 | `number`                                                                                           | `0.25`      |
| marginMultiple        | Margin multiplier for spacing                          | `number`                                                                                           | `1`         |
| componentProps        | Props for internal components                          | `{ a?: object, highlight?: object, img?: object, mermaid?: object, pre?: object, video?: object }` | -           |
| components            | Custom components for markdown elements                | `Components & Record<string, FC>`                                                                  | -           |
| customRender          | Custom render function for markdown content            | `(dom: ReactNode, context: { text: string }) => ReactNode`                                         | -           |
| reactMarkdownProps    | Additional props for react-markdown                    | `object`                                                                                           | -           |
| rehypePlugins         | Additional rehype plugins                              | `Pluggable[]`                                                                                      | -           |
| remarkPlugins         | Additional remark plugins                              | `Pluggable[]`                                                                                      | -           |
| remarkPluginsAhead    | Remark plugins to run before built-in plugins          | `Pluggable[]`                                                                                      | -           |
