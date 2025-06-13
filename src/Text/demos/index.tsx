import { Text } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();

  const controls = useControls(
    {
      as: {
        options: ['div', 'h1', 'h2', 'h3', 'h4', 'p'],
        value: 'div',
      },
      code: false,
      delete: false,
      disabled: false,
      ellipsis: {
        value: false,
      },
      ellipsisRows: {
        max: 3,
        min: 1,
        render: (get) => get('ellipsis'),
        step: 1,
        value: 1,
      },
      italic: false,
      mark: false,
      strong: false,
      type: {
        options: ['default', 'secondary', 'success', 'warning', 'danger', 'info'],
        value: 'default',
      },
      underline: false,
      weight: {
        options: ['bold', 'bolder'],
        value: '',
      },
    },
    { store },
  ) as any;

  return (
    <StoryBook levaStore={store}>
      <div style={{ width: 300 }}>
        <Text
          {...controls}
          ellipsis={
            controls.ellipsis
              ? {
                  rows: controls?.ellipsisRows,
                }
              : undefined
          }
        >
          This is a very long text that will be truncated with ellipsis when it exceeds the
          container width. This is a very long text that will be truncated with ellipsis when it
          exceeds the container width.
        </Text>
      </div>
    </StoryBook>
  );
};
