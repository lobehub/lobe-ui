import { Text } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();

  const { ellipsisRows, tooltip, tooltipWhenOverflow, ...controls } = useControls(
    {
      as: {
        options: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'span'],
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
      lineClamp: {
        max: 10,
        min: 1,
        step: 1,
        value: 0,
      },
      lineHeight: {
        value: '',
      },
      mark: false,
      noWrap: false,
      strong: false,
      textDecoration: {
        value: '',
      },
      textTransform: {
        options: ['', 'none', 'capitalize', 'uppercase', 'lowercase'],
        value: '',
      },
      tooltip: {
        render: (get) => get('ellipsis'),
        value: false,
      },
      tooltipWhenOverflow: {
        render: (get) => get('ellipsis'),
        value: false,
      },
      type: {
        options: ['default', 'secondary', 'success', 'warning', 'danger', 'info'],
        value: 'default',
      },
      underline: false,
      weight: {
        options: ['bold', 'bolder'],
        value: '',
      },
      whiteSpace: {
        value: '',
      },
      wordBreak: {
        options: ['', 'normal', 'break-all', 'keep-all', 'break-word'],
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
          lineClamp={controls.lineClamp ? controls.lineClamp : undefined}
          lineHeight={controls.lineHeight || undefined}
          textDecoration={controls.textDecoration || undefined}
          textTransform={controls.textTransform || undefined}
          whiteSpace={controls.whiteSpace || undefined}
          wordBreak={controls.wordBreak || undefined}
          ellipsis={
            controls.ellipsis
              ? {
                  rows: ellipsisRows,
                  tooltip,
                  tooltipWhenOverflow,
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
