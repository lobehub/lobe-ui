import { Flexbox } from '@lobehub/ui';
import { Button, DatePicker } from '@lobehub/ui/base-ui';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';

export default () => {
  const [expiresAt, setExpiresAt] = useState<Dayjs | null>(null);

  return (
    <Flexbox gap={16} padding={16} style={{ maxWidth: 320 }}>
      <DatePicker
        minDate={dayjs()}
        renderExtraFooter={() => <Button onClick={() => setExpiresAt(null)}>Never expires</Button>}
        value={expiresAt}
        onChange={setExpiresAt}
      />
      <DatePicker picker="month" variant="filled" />
    </Flexbox>
  );
};
