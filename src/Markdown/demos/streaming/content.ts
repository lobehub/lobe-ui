export const fullContent = `# Complete Markdown Integration Example

This demonstrates a comprehensive real-world example of how different markdown features work together in a cohesive document.

## AI Assistant Capabilities

Hello! I'm an AI assistant powered by advanced language models. I can help you with various tasks:

1. **Question Answering** - Provide detailed responses to complex queries
2. **Information Research** - Gather and synthesize information from multiple sources
3. **Code Development** - Write, review, and debug code in multiple languages
4. **Concept Explanation** - Break down complex topics into understandable parts

## Long Paragraph Example

This is the first paragraph demonstrating the text-box-trim and text-edge properties. In modern web design, typography plays a crucial role in creating readable and visually appealing content. When browsers support the text-box-trim property, we can achieve more precise control over vertical spacing, eliminating unnecessary whitespace that can affect the overall layout.

This is the second paragraph showing how margin-inline-start and margin-inline-end create horizontal spacing for paragraphs. By setting appropriate inline margins, we can create visual separation between paragraphs while maintaining a clean, structured appearance. This approach is particularly effective for long-form content like articles, documentation, and blog posts.

This is the third paragraph illustrating the line-height property set to 2. A generous line height significantly improves readability by providing more breathing room between lines of text. This spacing reduces visual fatigue and makes it easier for readers to follow along, especially when reading extended passages of text.

This is the fourth paragraph explaining the text-box-trim: trim-both property. When supported by the browser, this CSS feature automatically trims the leading and trailing whitespace of text boxes, allowing for more precise control over paragraph spacing. Combined with text-edge: cap alphabetic, we can achieve professional typographic alignment.

This is the fifth paragraph discussing practical applications of these typography techniques. These styling approaches are particularly well-suited for displaying long articles, blog content, technical documentation, and any scenario where excellent readability is essential. Proper spacing and line height can transform dense text into an enjoyable reading experience.

This is the sixth paragraph covering the separation of concerns in typography. Paragraph spacing is controlled through margin-block-start and margin-block-end, while horizontal spacing uses margin-inline-start and margin-inline-end. This separation provides flexibility in controlling layout effects independently, allowing designers to fine-tune the visual presentation.

This is the seventh paragraph exploring modern CSS capabilities. New CSS features like text-box-trim and text-edge give us unprecedented control over text rendering. These properties enable more precise typographic control, helping us achieve professional-grade layouts that were previously difficult to implement with traditional CSS approaches.

This is the eighth paragraph demonstrating the visual effect of multiple paragraphs. Each paragraph benefits from appropriate horizontal margins and a line-height of 2, creating a comfortable reading rhythm. This design approach proves highly effective in long-form reading scenarios, where user comfort and comprehension are paramount.

This is the ninth paragraph emphasizing the importance of typography in user experience. Text formatting is not merely a technical concern but a fundamental component of user experience design. Well-crafted typography helps users understand content more easily, reduces reading burden, and enhances overall usability. This is why attention to these details matters.

This is the tenth and final paragraph concluding our exploration of paragraph styling. Through thoughtful spacing and line-height settings, we can create text layouts that are both aesthetically pleasing and highly functional. This design approach deserves consideration and application in real-world projects where readability and user experience are priorities.

Thank you for exploring these markdown capabilities!

## React Component Implementation

Here's a complete React component that demonstrates markdown integration:

\`\`\`tsx
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

import { PreviewGroup } from '@/Image';
import { useMarkdown } from '@/hooks/useMarkdown';

import { SyntaxMarkdownProps } from '../type';
\`\`\`

## Mathematical Formula Support

Advanced mathematical expressions are fully supported through LaTeX integration:

### Fourier Transform
The Fourier transform converts signals between time and frequency domains:

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$

### Complex Analysis
For complex functions, we can express relationships like:

$$
\\frac{d}{dz}f(z) = \\lim_{h \\to 0} \\frac{f(z+h) - f(z)}{h}
$$

## Data Flow Visualization

\`\`\`mermaid
graph TD
  A[User Input] --> B[Markdown Parser]
  B --> C[Plugin Processing]
  C --> D[Component Rendering]
  D --> E[Final Output]

  B --> F[LaTeX Processing]
  F --> D

  B --> G[Mermaid Processing]
  G --> D

  B --> H[Code Highlighting]
  H --> D
\`\`\`

## Feature Integration Summary

| Feature | Status | Implementation |
|---------|--------|----------------|
| Headers | ✅ | Native markdown |
| Text Formatting | ✅ | Bold, italic, strikethrough |
| Code Blocks | ✅ | Syntax highlighting + annotations |
| Math Formulas | ✅ | LaTeX via KaTeX |
| Diagrams | ✅ | Mermaid integration |
| Tables | ✅ | GitHub-flavored markdown |
| Task Lists | ✅ | Interactive checkboxes |
| Footnotes | ✅ | Reference system |

`;

export const fullContentCN = `# 完整 Markdown 集成示例

这是一个展示不同 Markdown 功能如何在文档中协同工作的综合示例。

## AI 助手能力

你好！我是由先进语言模型驱动的 AI 助手。我可以帮助你完成各种任务：

1. **问题解答** - 对复杂查询提供详细回复
2. **信息研究** - 收集并综合多来源信息
3. **代码开发** - 编写、审查和调试多种语言的代码
4. **概念解释** - 将复杂主题分解为易于理解的部分

## 长段落示例

这是第一段，演示 text-box-trim 和 text-edge 属性。在现代网页设计中，排版在创建可读且视觉上吸引人的内容方面起着至关重要的作用。当浏览器支持 text-box-trim 属性时，我们可以更精确地控制垂直间距，消除可能影响整体布局的不必要空白。

这是第二段，展示 margin-inline-start 和 margin-inline-end 如何为段落创建水平间距。通过设置适当的行内边距，我们可以在保持整洁、结构化外观的同时，在段落之间创建视觉分隔。这种方法特别适用于长篇内容，如文章、文档和博客文章。

这是第三段，说明设置为 2 的 line-height 属性。宽敞的行高通过在文本行之间提供更多呼吸空间，显著提高了可读性。这种间距减少了视觉疲劳，使读者更容易跟随，尤其是在阅读长篇文本时。

这是第四段，解释 text-box-trim: trim-both 属性。当浏览器支持时，此 CSS 功能会自动修剪文本框的前导和尾随空白，允许更精确地控制段落间距。结合 text-edge: cap alphabetic，我们可以实现专业的排版对齐。

这是第五段，讨论这些排版技术的实际应用。这些样式方法特别适合显示长篇文章、博客内容、技术文档以及任何需要出色可读性的场景。适当的间距和行高可以将密集的文本转化为愉快的阅读体验。

这是第六段，涵盖排版中的关注点分离。段落间距通过 margin-block-start 和 margin-block-end 控制，而水平间距使用 margin-inline-start 和 margin-inline-end。这种分离提供了独立控制布局效果的灵活性，允许设计师微调视觉呈现。

这是第七段，探索现代 CSS 能力。像 text-box-trim 和 text-edge 这样的新 CSS 功能使我们能够前所未有地控制文本渲染。这些属性实现了更精确的排版控制，帮助我们实现以前使用传统 CSS 方法难以达到的专业级布局。

这是第八段，演示多个段落的视觉效果。每个段落都受益于适当的水平边距和 2 的行高，创造了舒适的阅读节奏。这种设计方法在长篇阅读场景中被证明是非常有效的，在这些场景中，用户的舒适度和理解力至关重要。

这是第九段，强调排版在用户体验中的重要性。文本格式不仅仅是一个技术问题，也是用户体验设计的一个基本组成部分。精心制作的排版有助于用户更容易地理解内容，减少阅读负担，并增强整体可用性。这就是为什么关注这些细节很重要的原因。

这是第十段也是最后一段，总结我们对段落样式的探索。通过深思熟虑的间距和行高设置，我们可以创建既美观又高度实用的文本布局。这种设计方法值得在可读性和用户体验优先的实际项目中考虑和应用。

感谢你探索这些 Markdown 功能！

## React 组件实现

这是一个演示 Markdown 集成的完整 React 组件：

\`\`\`tsx
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

import { PreviewGroup } from '@/Image';
import { useMarkdown } from '@/hooks/useMarkdown';

import { SyntaxMarkdownProps } from '../type';
\`\`\`

## 数学公式支持

通过 LaTeX 集成完全支持高级数学表达式：

### 傅里叶变换
傅里叶变换在时域和频域之间转换信号：

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$

### 复分析
对于复函数，我们可以表达如下关系：

$$
\\frac{d}{dz}f(z) = \\lim_{h \\to 0} \\frac{f(z+h) - f(z)}{h}
$$

## 数据流可视化

\`\`\`mermaid
graph TD
  A[用户输入] --> B[Markdown 解析器]
  B --> C[插件处理]
  C --> D[组件渲染]
  D --> E[最终输出]

  B --> F[LaTeX 处理]
  F --> D

  B --> G[Mermaid 处理]
  G --> D

  B --> H[代码高亮]
  H --> D
\`\`\`

## 功能集成摘要

| 功能 | 状态 | 实现 |
|---|---|---|
| 标题 | ✅ | 原生 markdown |
| 文本格式 | ✅ | 粗体、斜体、删除线 |
| 代码块 | ✅ | 语法高亮 + 注释 |
| 数学公式 | ✅ | 通过 KaTeX 实现 LaTeX |
| 图表 | ✅ | Mermaid 集成 |
| 表格 | ✅ | GitHub 风格 markdown |
| 任务列表 | ✅ | 交互式复选框 |
| 脚注 | ✅ | 引用系统 |
`;
