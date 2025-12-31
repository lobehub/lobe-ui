import { Button, DropdownMenuV2 } from '@lobehub/ui';

export default () => {
  return (
    <DropdownMenuV2
      items={() => [
        { key: 'new', label: 'New File' },
        { key: 'open', label: 'Open...' },
        { type: 'divider' },
        { key: 'exit', label: 'Exit' },
      ]}
    >
      <Button>Lazy Items</Button>
    </DropdownMenuV2>
  );
};
