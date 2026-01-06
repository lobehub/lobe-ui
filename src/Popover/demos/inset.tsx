import { Button, Flexbox, Popover } from '@lobehub/ui';

export default () => {
  return (
    <Flexbox align="center" gap={24} horizontal justify="center" style={{ padding: 24 }}>
      <Popover content="Normal popover with arrow" placement="bottom">
        <Button>Normal</Button>
      </Popover>
      <Popover arrow={false} content="Popover without arrow" placement="bottom">
        <Button>No Arrow</Button>
      </Popover>
      <Popover content="Inset popover renders inside trigger" inset placement="bottom">
        <Button type="primary">Inset</Button>
      </Popover>
    </Flexbox>
  );
};
