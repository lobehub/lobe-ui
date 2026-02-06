import { Markdown, type MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const basicListsContent = `**Unordered Lists**

- First item
- Second item
  - Nested item
  - Another nested item
    - Double nested item

**Ordered Lists**

1. First item
2. Second item
   1. Nested ordered item
   2. Another nested ordered
      1. Triple nested item

**Mixed Lists**

1. First ordered item
2. Second ordered item
   - Unordered nested item
   - Another unordered nested
     1. Back to ordered nesting

**Lists with Formatting**

- **Bold item**
- *Italic item*
- Item with \`inline code\`
- Item with [a link](https://example.com)
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: basicListsContent,
      },
      fontSize: {
        max: 32,
        min: 12,
        step: 1,
        value: 16,
      },
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
      variant: {
        options: ['default', 'chat'],
        value: 'chat',
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
