import { Button, DropdownMenu, type DropdownMenuProps } from '@lobehub/ui';

const zones: [string, string][] = [
  ['Honolulu', 'GMT-10'],
  ['Anchorage', 'GMT-9'],
  ['Los Angeles', 'GMT-8'],
  ['Denver', 'GMT-7'],
  ['Chicago', 'GMT-6'],
  ['New York', 'GMT-5'],
  ['São Paulo', 'GMT-3'],
  ['London', 'GMT+0'],
  ['Berlin', 'GMT+1'],
  ['Cairo', 'GMT+2'],
  ['Moscow', 'GMT+3'],
  ['Dubai', 'GMT+4'],
  ['Karachi', 'GMT+5'],
  ['Dhaka', 'GMT+6'],
  ['Bangkok', 'GMT+7'],
  ['Shanghai', 'GMT+8'],
  ['Tokyo', 'GMT+9'],
  ['Sydney', 'GMT+10'],
];

const items: Exclude<DropdownMenuProps['items'], () => unknown> = zones.map(([city, offset]) => ({
  extra: offset,
  key: city,
  label: city,
}));

export default () => {
  return (
    <DropdownMenu
      header={<div style={{ fontSize: 13, fontWeight: 600 }}>Select time zone</div>}
      items={items}
      placement="bottomLeft"
      popupProps={{ style: { maxHeight: 300 } }}
      footer={
        <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>
          18 time zones · scroll to explore
        </div>
      }
    >
      <Button>Time zone</Button>
    </DropdownMenu>
  );
};
