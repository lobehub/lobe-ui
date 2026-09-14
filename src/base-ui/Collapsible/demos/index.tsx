import { Button, Collapsible } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>{open ? 'Collapse' : 'Expand'}</Button>
      <Collapsible open={open}>
        <p>Height animates open and closed; content fades and slides with it.</p>
      </Collapsible>
    </div>
  );
};
