import { Text } from '@lobehub/ui';

export default () => (
  <Text ellipsis={{ rows: 2, tooltip: 'Full text content' }}>
    This is a very long text that will be truncated with ellipsis when it exceeds the container
    width. This is a very long text that will be truncated with ellipsis when it exceeds the
    container width. This is a very long text that will be truncated with ellipsis when it exceeds
    the container width. This is a very long text that will be truncated with ellipsis when it
    exceeds the container width.
  </Text>
);
