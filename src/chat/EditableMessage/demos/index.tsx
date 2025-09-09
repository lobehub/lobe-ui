import { EditableMessage } from '@lobehub/ui/chat';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { button } from 'leva';
import { useState } from 'react';

const content = `# Markdown Showcase

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
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEdit] = useState(false);
  const store = useCreateStore();

  useControls(
    {
      editing: button(() => {
        setEdit(true);
      }),
      openModal: button(() => {
        setOpenModal(true);
      }),
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <EditableMessage
        editing={editing}
        onEditingChange={setEdit}
        onOpenChange={setOpenModal}
        openModal={openModal}
        value={content}
      />
    </StoryBook>
  );
};
