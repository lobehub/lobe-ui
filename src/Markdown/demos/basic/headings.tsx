import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const headingsContent = `# Heading Level 1

## Heading Level 2

### Heading Level 3

#### Heading Level 4

##### Heading Level 5
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: headingsContent,
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
