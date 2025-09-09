import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const footnotesContent = `Here is a simple footnote[^1].

A footnote can also have multiple lines[^2].

[^1]: My reference.
[^2]: To add line breaks within a footnote, prefix new lines with 2 spaces.`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: footnotesContent,
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
        maxValue: 5,
        minValue: 0,
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
