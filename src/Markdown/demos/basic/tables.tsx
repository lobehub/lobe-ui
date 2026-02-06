import { Markdown, type MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const tablesContent = `| Name | Age | City |
| --- | --- | --- |
| Alice | 25 | New York |
| Bob | 30 | London |
| Charlie | 35 | Tokyo |

**Aligned Tables**

| Left-aligned | Center-aligned | Right-aligned |
| :--- | :---: | ---: |
| This text is left aligned | This text is center aligned | This text is right aligned |
| \`left\` | \`center\` | \`right\` |
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: tablesContent,
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
    },
    { store },
  ) as MarkdownProps;
  return (
    <StoryBook levaStore={store}>
      <Markdown {...options} />
    </StoryBook>
  );
};
