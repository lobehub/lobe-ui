import { Flexbox } from '@lobehub/ui';
import { Text } from '@lobehub/ui/base-ui';

const longText =
  'This is a very long text that will be truncated with ellipsis when it exceeds the container width. This is a very long text that will be truncated with ellipsis when it exceeds the container width.';

export default () => (
  <Flexbox gap={24} padding={16}>
    <Flexbox gap={8}>
      <Text>Default text</Text>
      <Text type="secondary">Secondary text</Text>
      <Text type="success">Success text</Text>
      <Text type="warning">Warning text</Text>
      <Text type="danger">Danger text</Text>
      <Text type="info">Info text</Text>
      <Text disabled>Disabled text</Text>
    </Flexbox>

    <Flexbox gap={8}>
      <Text as="h1">Heading 1</Text>
      <Text as="h2">Heading 2</Text>
      <Text as="h3">Heading 3</Text>
      <Text as="h4">Heading 4</Text>
      <Text as="h5">Heading 5</Text>
      <Text as="p">Paragraph</Text>
    </Flexbox>

    <Flexbox gap={8}>
      <Text strong>Bold text</Text>
      <Text italic>Italic text</Text>
      <Text underline>Underlined text</Text>
      <Text delete>Deleted text</Text>
      <Text mark>Marked text</Text>
      <Text code>Code text</Text>
      <Text shiny>Thinking in progress</Text>
      <Text shiny shinyDuration="3s">
        Thinking slowly
      </Text>
      <Text delete mark underline>
        Combined formatting
      </Text>
    </Flexbox>

    <div style={{ width: 240 }}>
      <Text ellipsis>{longText}</Text>
    </div>

    <div style={{ width: 280 }}>
      <Text ellipsis={{ rows: 2, tooltip: longText }}>{longText}</Text>
    </div>
  </Flexbox>
);
