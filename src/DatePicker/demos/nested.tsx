import {
  Button,
  DayjsDatePicker as DatePicker,
  DayjsDateRangePicker as DateRangePicker,
  Flexbox,
  Modal,
  Popover,
  Text,
} from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [open, setOpen] = useState(false);

  // rc-trigger fits the popup inside every scrollable ancestor, so leave it room below.
  return (
    <Flexbox horizontal gap={8} padding={16} style={{ minHeight: 560 }}>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal footer={null} open={open} title="Pick dates" onCancel={() => setOpen(false)}>
        <Flexbox gap={12}>
          <Text type="secondary">Picking a date keeps the modal open.</Text>
          <DatePicker />
          <DateRangePicker />
        </Flexbox>
      </Modal>
      <Popover
        trigger="click"
        content={
          <Flexbox gap={12} style={{ width: 280 }}>
            <DatePicker />
            <DateRangePicker />
          </Flexbox>
        }
      >
        <Button>Open Popover</Button>
      </Popover>
    </Flexbox>
  );
};
