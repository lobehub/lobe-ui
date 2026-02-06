import { Markdown, type MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const content = `1. Fast conversion: Convert web applications to desktop applications in minutes[^1]
2. Usage:
- Provides the ToDesktop Builder desktop application
- Guides users through the conversion process through step-by-step instructions[^2]

[^1]: [ToDesktop Official Website](https://www.todesktop.com/)
[^2]: [ToDesktop Basics Introduction](https://www.todesktop.com/docs/introduction/basics)
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: content,
      },
      enableCustomFootnotes: true,
      showFootnotes: true,
    },
    { store },
  ) as MarkdownProps;
  return (
    <StoryBook levaStore={store}>
      <Markdown {...options} />
    </StoryBook>
  );
};
