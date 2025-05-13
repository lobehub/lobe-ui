export const content = `# This is an H1
## This is an H2
### This is an H3
#### This is an H4
##### This is an H5

The point of reference-style links is not that they’re easier to write. The point is that with reference-style links, your document source is vastly more readable. Compare the above examples: using reference-style links, the paragraph itself is only 81 characters long; with inline-style links, it’s 176 characters; and as raw \`HTML\`, it’s 234 characters. In the raw \`HTML\`, there’s more markup than there is text.

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

an example | *an example* | **an example**

~~这是删除线~~ (两个波浪线)

~这不会被渲染为删除线~ (单个波浪线)

---

![](https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp)

![](https://gw.alipayobjects.com/zos/kitchen/8Ab%24hLJ5ur/cover.webp)

<video
  poster="https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp"
  src="https://github.com/lobehub/lobe-chat/assets/28616219/f29475a3-f346-4196-a435-41a6373ab9e2"/>

---

1. Bird
1. McHale
1. Parish
    1. Bird
    1. McHale
        1. Parish

---

- Red
- Green
- Blue
    - Red
    - Green
        - Blue

---

This is [an example](http://example.com/ "Title") inline link.

<http://example.com/>


| title | title | title |
| --- | --- | --- |
| content | content | content |


\`\`\`bash
$ pnpm install
\`\`\`


\`\`\`javascript
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useDropNodeOnCanvas } from './useDropNodeOnCanvas';
\`\`\`


\`\`\`mermaid
graph TD
A[Enter Chart Definition] --> B(Preview)
B --> C{decide}
C --> D[Keep]
C --> E[Edit Definition]
E --> B
D --> F[Save Image and Code]
F --> B
\`\`\`


---

以下是一段Markdown格式的LaTeX数学公式：

我是一个行内公式：$E=mc^2$

我是一个独立的傅里叶公式：
$$
f(x) = a_0 + \\sum_{n=1}^{\\infty} \\left( a_n \\cos(nx) + b_n \\sin(nx) \\right)
$$

其中，带有积分符号的项：
$$
a_0 = \\frac{1}{2\\pi} \\int_{-\\pi}^{\\pi} f(x) \\, dx
$$

$$
a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos(nx) \\, dx \\quad \\text{for} \\quad n \\geq 1
$$

$$
b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\sin(nx) \\, dx \\quad \\text{for} \\quad n \\geq 1
$$

我是一个带有分式、测试长度超长的泰勒公式：

$$
\\begin{equation}
f(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2!}(x - a)^2 + \\frac{f'''(a)}{3!}(x - a)^3 + \\cdots + \\frac{f^{(n)}(a)}{n!}(x - a)^n + R_n(x)
\\end{equation}
$$

我是上面公式的行内版本，看看我会不会折行：$ f(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2!}(x - a)^2 + \\frac{f'''(a)}{3!}(x - a)^3 + \\cdots + \\frac{f^{(n)}(a)}{n!}(x - a)^n + R_n(x) $


我是一个带有上下标的公式：
$$
q_1 q_2 = (w_1 w_2 - \\vec{v}_1^T \\vec{v}_2, \\, w_1 \\vec{v}_2 + w_2 \\vec{v}_1 + \\vec{v}_1 \\times \\vec{v}_2)
$$

我是一个带有 tag 的公式：
$$
q = a + bi + cj + dk \\tag{1}
$$

---

我是一个嵌套测试：
\`\`\`
$1
\`\`\`
`;

export const content2 = `# Customize Markdown Components
#### Customize Anchor Behavior
This is [an example](http://example.com/ "Title") inline link.

<http://example.com/>


#### Customize Hr

---

#### Customize Image Display

![](https://gw.alipayobjects.com/zos/kitchen/sLO%24gbrQtp/lobe-chat.webp)
`;

export const code = `

#### Notation Diff

\`\`\`ts
export function foo() {
  console.log('hewwo') // [!code --]
  console.log('hello') // [!code ++]
}
\`\`\`

#### Notation Highlight

\`\`\`ts
export function foo() {
  console.log('Highlighted') // [!code highlight]
}
\`\`\`

#### Notation WordHighlight

\`\`\`ts
export function foo() { // [!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // 打印 Hello World
}
\`\`\`

#### Notation Focus

\`\`\`ts
export function foo() {
  console.log('Focused') // [!code focus]
}
\`\`\`

#### Notation ErrorLevel

\`\`\`ts
export function foo() {
  console.error('Error') // [!code error]
  console.warn('Warning') // [!code warning]
}
\`\`\`
`;

export const fullContent = `# AI Assistant Response

Hello! I'm an AI assistant. I can help you with various tasks like:

1. Answering questions
2. Providing information
3. Writing code examples
4. Explaining concepts

## Code Example

Here's a simple React component:

\`\`\`tsx
'use client';

import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

import { PreviewGroup } from '@/Image';
import { useMarkdown } from '@/hooks/useMarkdown';

import { SyntaxMarkdownProps } from '../type';

const SyntaxMarkdown = memo<SyntaxMarkdownProps>(
  ({
    children,
    fullFeaturedCodeBlock,
    animated,
    enableLatex = true,
    enableMermaid = true,
    enableImageGallery = true,
    enableCustomFootnotes,
    componentProps,
    allowHtml,
    showFootnotes,
    variant = 'default',
    reactMarkdownProps,
    rehypePlugins,
    remarkPlugins,
    remarkPluginsAhead,
    components = {},
    customRender,
    citations,
  }) => {
    // Use our new hook to handle Markdown processing
    const { escapedContent, memoComponents, rehypePluginsList, remarkPluginsList } = useMarkdown({
      allowHtml,
      animated,
      children,
      citations,
      componentProps,
      components,
      enableCustomFootnotes,
      enableImageGallery,
      enableLatex,
      enableMermaid,
      fullFeaturedCodeBlock,
      rehypePlugins,
      remarkPlugins,
      remarkPluginsAhead,
      showFootnotes,
      variant,
    });

    // 渲染默认内容
    const defaultDOM = useMemo(
      () => (
        <PreviewGroup enable={enableImageGallery}>
          <ReactMarkdown
            {...reactMarkdownProps}
            components={memoComponents}
            rehypePlugins={rehypePluginsList}
            remarkPlugins={remarkPluginsList}
          >
            {escapedContent}
          </ReactMarkdown>
        </PreviewGroup>
      ),
      [
        escapedContent,
        memoComponents,
        rehypePluginsList,
        remarkPluginsList,
        enableImageGallery,
        reactMarkdownProps,
      ],
    );

    // 应用自定义渲染
    const markdownContent = customRender
      ? customRender(defaultDOM, { text: escapedContent || '' })
      : defaultDOM;

    return markdownContent;
  },
);

SyntaxMarkdown.displayName = 'SyntaxMarkdown';

export default SyntaxMarkdown;
\`\`\`

## Math Support

I can also render mathematical formulas:

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$

## Data Visualization

\`\`\`mermaid
graph TD
  A[User Input] --> B[AI Processing]
  B --> C[Response Generation]
  C --> D[Content Display]
\`\`\`

Thank you for your attention!
`;
