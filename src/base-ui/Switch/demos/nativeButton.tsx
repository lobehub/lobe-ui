import { Button, Flexbox, Text } from '@lobehub/ui';
import { Switch } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitCount((count) => count + 1);
      }}
    >
      <Flexbox gap={12}>
        <Text>
          Toggle the Switch. The submission count must remain unchanged because its native type is
          button.
        </Text>
        <Flexbox horizontal align="center" gap={8}>
          <Switch checked={checked} onChange={setChecked} />
          <Text>Switch state: {checked ? 'on' : 'off'}</Text>
        </Flexbox>
        <Text code>Switch type: button</Text>
        <Text code>Form submissions: {submitCount}</Text>
        <Button htmlType="submit" style={{ alignSelf: 'flex-start' }}>
          Submit form explicitly
        </Button>
      </Flexbox>
    </form>
  );
};
