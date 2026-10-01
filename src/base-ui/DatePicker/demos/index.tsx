import { Flexbox } from '@lobehub/ui';
import { Button, DatePicker } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  return (
    <Flexbox gap={16} padding={16} style={{ maxWidth: 320 }}>
      <DatePicker
        footer={<Button onClick={() => setExpiresAt(null)}>Never expires</Button>}
        min={new Date()}
        value={expiresAt}
        onChange={setExpiresAt}
      />
      <DatePicker mode="month" variant="filled" />
    </Flexbox>
  );
};
