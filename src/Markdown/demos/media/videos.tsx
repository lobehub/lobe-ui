import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const vidoesContent = `<video src="https://github.com/lobehub/lobe-chat/assets/28616219/f29475a3-f346-4196-a435-41a6373ab9e2"/>`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: vidoesContent,
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
