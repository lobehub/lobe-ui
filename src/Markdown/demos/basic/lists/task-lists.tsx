import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const taskListsContent = `**Basic Task Lists**

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

**Nested Task Lists**

- [ ] Frontend Development
  - [x] Setup project structure
  - [ ] Footer component
- [ ] Backend Development
  - [x] Define endpoints
  - [ ] Implement authentication
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: taskListsContent,
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
