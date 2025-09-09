import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export const content = `# Markdown Showcase

## Text Formatting

**Bold**, *italic*, ***bold italic***, ~~strikethrough~~

This is <sub>subscript</sub> and <sup>superscript</sup>

## Lists

- Unordered list
- Another item
  - Nested item

1. Ordered list
2. Another item
   1. Nested item

## Task Lists

- [x] Completed task
- [ ] Incomplete task

## Code

Inline \`code\` and code blocks:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Tables

| Feature | Status |
| --- | --- |
| Markdown | ✅ |
| Syntax Highlighting | ✅ |

## Math

Inline math: $E = mc^2$

Block math:
$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

## Mermaid

\`\`\`mermaid
graph LR
  A --> B
  B --> C
\`\`\`
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      allowHtml: false,
      children: {
        rows: true,
        value: content,
      },
      fontSize: {
        max: 32,
        min: 12,
        step: 1,
        value: 16,
      },
      fullFeaturedCodeBlock: true,
      headerMultiple: {
        max: 3,
        min: 0,
        step: 0.1,
        value: 1,
      },
      lineHeight: {
        max: 3,
        min: 1,
        step: 0.1,
        value: 1.8,
      },
      marginMultiple: {
        max: 5,
        min: 0,
        step: 0.1,
        value: 2,
      },
    },
    { store },
  ) as MarkdownProps;

  return (
    <StoryBook levaStore={store}>
      <Markdown {...options} />
    </StoryBook>
  );
};
