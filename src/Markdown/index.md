---
nav: Components
group: Data Display
title: Markdown
description: Markdown is a React component used to render markdown text. It supports various markdown syntax such as headings, lists, links, images, code blocks and more. It is commonly used in documentation, blogs, and other text-heavy applications.
---

## Basic

Create sophisticated formatting for your prose and code with simple syntax.

The Markdown component is a React component that renders markdown text with GitHub-flavored markdown support, syntax highlighting, mathematical expressions, and interactive features.

### Headings

To create a heading, add one to six `#` symbols before your heading text. The number of `#` you use will determine the hierarchy level and typeface size of the heading.

<code src="./demos/basic/headings.tsx" iframe nopadding></code>

### Styling text

You can indicate emphasis with bold, italic, strikethrough, subscript, or superscript text in comment fields and `.md` files.

| Style                  | Syntax             | Example                                  | Output                                 |
| ---------------------- | ------------------ | ---------------------------------------- | -------------------------------------- |
| Bold                   | `** **` or `__ __` | `**This is bold text**`                  | **This is bold text**                  |
| Italic                 | `* *` or `_ _`     | `_This text is italicized_`              | _This text is italicized_              |
| Strikethrough          | `~~ ~~`            | `~~This was mistaken text~~`             | ~~This was mistaken text~~             |
| Bold and nested italic | `** **` and `_ _`  | `**This text is _extremely_ important**` | **This text is _extremely_ important** |
| All bold and italic    | `*** ***`          | `***All this text is important***`       | **_All this text is important_**       |
| Underline              | `<ins> </ins>`     | `This is a <ins>underline</ins> text`    | This is a <ins>underline</ins> text    |
| Subscript              | `<sub> </sub>`     | `This is a <sub>subscript</sub> text`    | This is a <sub>subscript</sub> text    |
| Superscript            | `<sup> </sup>`     | `This is a <sup>superscript</sup> text`  | This is a <sup>superscript</sup> text  |
| Keyboard               | `<kbd> </kbd>`     | `Press <kbd>mod+c</kbd>`                 | Press <kbd>mod+c</kbd>                 |

<code src="./demos/basic/stylingText.tsx" iframe nopadding></code>

### Break Lines

Support `<br>` tags to create a line break.

<code src="./demos/basic/br.tsx" iframe nopadding></code>

### Quoting text

You can quote text with a `>`.

Quoted text is rendered with a vertical line on the left and displayed using gray type.

<code src="./demos/basic/quotes.tsx" iframe nopadding></code>

### Links

You can create an inline link by wrapping link text in brackets `[ ]`, and then wrapping the URL in parentheses `( )`.

The component automatically creates links when valid URLs are written in the markdown content.

<code src="./demos/basic/links.tsx" iframe nopadding></code>

### Tables

You can create tables by assembling a list of words and dividing them with hyphens `-` (for the first row), and then separating each column with a pipe `|`.

<code src="./demos/basic/tables.tsx" iframe nopadding></code>

---

## Media

### Images

You can display an image by adding `!` and wrapping the alt text in `[ ]`. Alt text is a short text equivalent of the information in the image. Then, wrap the link for the image in parentheses `()`.

```markdown
![Screenshot](https://myoctocat.com/assets/images/base-octocat.svg)
```

<code src="./demos/media/images.tsx" iframe nopadding></code>

The component supports embedding images from various sources. You can display images from URLs, relative paths, or data URIs.

### Videos

```markdown
<video src="https://github.com/lobehub/lobe-chat/assets/28616219/f29475a3-f346-4196-a435-41a6373ab9e2"/>
```

<code src="./demos/media/videos.tsx" iframe nopadding></code>

---

## Lists

You can organize items into ordered and unordered lists.

<code src="./demos/basic/lists/basic-lists.tsx" iframe nopadding></code>

### Task lists

To create a task list, preface list items with a hyphen and space followed by `[ ]`. To mark a task as complete, use `[x]`.

<code src="./demos/basic/lists/task-lists.tsx" iframe nopadding></code>

For more information, see [About task lists](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists).

---

## Code

### Inline code

You can call out code or a command within a sentence with single backticks. The text within the backticks will not be formatted.

```javascript
function greetUser(name) {
  console.log(`Hello, ${name}!`);
}
```

<code src="./demos/code/code.tsx" iframe nopadding></code>

### Color models

You can call out colors within a sentence by using backticks. A supported color model within backticks will display a visualization of the color.

| Color | Syntax       | Example              |
| :---- | :----------- | :------------------- |
| HEX   | `#RRGGBB`    | `#0969DA`            |
| RGB   | `rgb(R,G,B)` | `rgb(9, 105, 218)`   |
| HSL   | `hsl(H,S,L)` | `hsl(212, 92%, 45%)` |

<code src="./demos/code/colors.tsx" iframe nopadding></code>

### Code blocks

You can add an optional language identifier to enable syntax highlighting in your fenced code block.

For more information, see [Creating and highlighting code blocks](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks).

<code src="./demos/code/codeBlocks.tsx" iframe nopadding></code>

#### Shiki Transformers

For more information, see [Shiki Transformers](https://shiki.style/guide/transformers).

<code src="./demos/code/transformer.tsx" iframe nopadding></code>

### Custom Highlight

<code src="./demos/code/customHighlight.tsx" iframe nopadding></code>

---

## Math and Diagrams

### LaTeX Math

You can enable the display of mathematical expressions in Markdown by using `$` delimiters for inline expressions and `$$` delimiters for block expressions.

For more information, see [KaTeX](https://katex.org).

<code src="./demos/advanced/math.tsx" iframe nopadding></code>

### Mermaid diagrams

Mermaid is a Markdown-inspired syntax for generating diagrams.

For more information, see [Mermaid](https://www.mermaidchart.com).

<code src="./demos/advanced/mermaid.tsx" iframe nopadding></code>

---

## Footnotes

You can add footnotes to your content by using this bracket syntax:

```markdown
Here is a simple footnote[^1].

[^1]: My reference.
```

The position of a footnote in your Markdown does not influence where the footnote will be rendered. Footnotes will always render at the bottom of the content.

<code src="./demos/footnotes/footnotes.tsx" iframe nopadding></code>

### Custom Footnotes

<code src="./demos/footnotes/customFootnotes.tsx" iframe nopadding></code>

---

## Alerts

Alerts are a Markdown extension based on the blockquote syntax that you can use to emphasize critical information. They are displayed with distinctive colors and icons to indicate the significance of the content.

Use alerts only when they are crucial for user success and limit them to one or two per article to prevent overloading the reader. Additionally, you should avoid placing alerts consecutively. Alerts cannot be nested within other elements.

To add an alert, use a special blockquote line specifying the alert type, followed by the alert information in a standard blockquote. Five types of alerts are available:

```markdown
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

<code src="./demos/advanced/alerts.tsx" iframe nopadding></code>

## Variants

Explore different component variants `default` and `chat`.

<code src="./demos/variant.tsx" iframe nopadding></code>

## Streamdown

<code src="./demos/streaming.tsx" iframe nopadding></code>

## Custom

### Markdown Components

<code src="./demos/custom/components.tsx" iframe nopadding></code>

### Citations

<code src="./demos/custom/citations/index.tsx" iframe nopadding></code>

### Custom Plugins

<code src="./demos/custom/plugins/index.tsx" nopadding iframe nopadding></code>

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
