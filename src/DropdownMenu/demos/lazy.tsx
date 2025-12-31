import { Button, DropdownMenu } from '@lobehub/ui';

export default () => {
  return (
    <DropdownMenu
      items={() => [
        { key: 'new', label: 'New File' },
        { key: 'open', label: 'Open...' },
        { type: 'divider' },
        { key: 'exit', label: 'Exit' },
      ]}
    >
      <Button>Lazy Items</Button>
    </DropdownMenu>
  );
};
