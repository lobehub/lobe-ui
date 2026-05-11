---
nav: Components
group: Data Display
title: HtmlPreview
description: HtmlPreview renders LLM-generated HTML inline using a hardened iframe sandbox. It mirrors how Mermaid is embedded in Markdown, but treats the content as code rather than data — scripts execute inside an isolated frame that cannot reach the host page.
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Full report

A complete LLM-output-style analytics report: Tailwind for the layout, Chart.js for three different chart types, and an inline script that boots the dashboard once the CDNs settle. This is the kind of document a "give me a weekly product report" prompt produces.

<code src="./demos/Report.tsx" nopadding></code>

## Head resources (CDN scripts, stylesheets, fonts)

`<script src>`, `<link rel="stylesheet">`, `<meta>` and other `<head>` children are preserved and replayed inside the iframe — so full documents that depend on Tailwind, p5.js, Chart.js, custom fonts, etc. just work.

The demo below loads **two** CDN scripts from `<head>` (Tailwind + Chart.js), then wires a body-level inline script to a live chart driven by three sliders. Multiple co-operating scripts, head + body, all running inside the sandbox.

Head extras are only mounted once the document's `</head>` (or `<body>`) actually arrives in the stream, so partial CDN URLs never trigger 404s mid-flight.

<code src="./demos/HeadResources.tsx" nopadding></code>

## Streaming

The `streamingMode` prop controls how the iframe behaves while content is
still arriving:

- `'auto'` (default) — mount the iframe live for script-less content,
  defer until `</html>` for content containing a `<script>` tag. Best of
  both worlds for most LLM output.
- `'live'` — always mount immediately. Scripts re-run on every chunk; only
  use for pure markup.
- `'defer'` — always wait for the closing tag. Safest for `p5.js` /
  `three.js` style demos where `setup()` must run once.

<code src="./demos/Streaming.tsx" nopadding></code>

## Inside Markdown

<code src="./demos/InMarkdown.tsx"></code>

## Security model

The default `sandbox` attribute is:

```
allow-scripts allow-forms allow-modals
```

`allow-same-origin` is deliberately **not** included, so user HTML cannot:

- read cookies or `localStorage` from the host page,
- call internal APIs that rely on cookie auth,
- bridge the IPC boundary inside Electron-style desktop apps.

To keep demos that touch `localStorage` / `sessionStorage` from throwing under
the stricter sandbox, the component injects an in-memory storage shim before
any user script runs. State is per-frame and does not survive a reload.

The `sandbox` prop can override the default, but doing so **transfers the
security responsibility to the caller**. Avoid it.

## Streaming

While the parent Markdown component is still streaming tokens (`animated`),
`HtmlPreview` renders the source view only. The iframe mounts once the
content stabilizes — either when `animated` flips to `false`, or when a
closing `</html>` tag is seen. This avoids rebooting scripts (e.g. `p5.js`
`setup()`) on every token.

## Fragments

Snippets without an `<html>` or `<!DOCTYPE>` root are treated as fragments
and are **not** auto-mounted as an iframe — they fall back to source view.
Inline-rendering an arbitrary fragment produces a worse experience than
showing the code.

## APIs

| Property      | Description                                                          | Type                                     | Default                                    |
| ------------- | -------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------ |
| children      | HTML content as a string                                             | `string`                                 | -                                          |
| variant       | Container style variant                                              | `'filled' \| 'outlined' \| 'borderless'` | `'filled'`                                 |
| shadow        | Show shadow                                                          | `boolean`                                | -                                          |
| copyable      | Show the copy button in the inline toolbar                           | `boolean`                                | `true`                                     |
| downloadable  | Show the download (`.html`) button in the inline toolbar             | `boolean`                                | `true`                                     |
| theme         | Background tone hint applied to the iframe body                      | `'light' \| 'dark'`                      | -                                          |
| defaultHeight | Initial iframe height before auto-height messages arrive             | `number`                                 | `400`                                      |
| defaultMode   | Initial body mode                                                    | `'preview' \| 'source'`                  | `'preview'`                                |
| animated      | Treat content as still-streaming; affects when the iframe mounts     | `boolean`                                | -                                          |
| streamingMode | How to handle the preview during streaming                           | `'defer' \| 'live' \| 'auto'`            | `'auto'`                                   |
| onExpand      | Callback for the expand button — receives the full HTML string       | `(content: string) => void`              | -                                          |
| sandbox       | Override the iframe sandbox (discouraged — transfers responsibility) | `string`                                 | `'allow-scripts allow-forms allow-modals'` |
| fileName      | Suggested file name for download                                     | `string`                                 | -                                          |
| actionsRender | Custom renderer for the inline toolbar contents                      | `(props) => ReactNode`                   | -                                          |
| bodyRender    | Custom renderer for the body                                         | `(props) => ReactNode`                   | -                                          |
