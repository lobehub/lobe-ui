import { Button, DatePicker,Flexbox  } from '@lobehub/ui';
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
