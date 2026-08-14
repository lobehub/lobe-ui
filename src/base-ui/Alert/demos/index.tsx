import { Flexbox } from '@lobehub/ui';
import { Alert, Button } from '@lobehub/ui/base-ui';
import { useState } from 'react';

const types = ['info', 'success', 'warning', 'error', 'secondary'] as const;

export default () => {
  const [alertKey, setAlertKey] = useState(0);

  return (
    <Flexbox gap={20} padding={16}>
      <Flexbox gap={8}>
        <span style={{ fontSize: 12, opacity: 0.6 }}>Neutral-first semantic tones</span>
        {types.map((type) => (
          <Alert
            description="The supporting description keeps the next action clear."
            key={type}
            type={type}
            title={
              type === 'secondary'
                ? 'Neutral notice'
                : `${type[0].toUpperCase()}${type.slice(1)} notice`
            }
          />
        ))}
      </Flexbox>

      <Flexbox gap={8}>
        <span style={{ fontSize: 12, opacity: 0.6 }}>Surface variants</span>
        <Alert title="Soft surface" type="success" variant="soft" />
        <Alert title="Outlined surface" type="warning" variant="outlined" />
        <Alert title="Plain surface" type="secondary" variant="plain" />
      </Flexbox>

      <Flexbox gap={8}>
        <span style={{ fontSize: 12, opacity: 0.6 }}>Dismissal and action</span>
        <Alert
          action={<Button size="small">Review</Button>}
          closable={{ 'aria-label': 'Dismiss deployment notice' }}
          key={alertKey}
          title="A new deployment is ready for review."
          type="info"
        />
        <Button
          size="small"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => setAlertKey((v) => v + 1)}
        >
          Restore dismissed alert
        </Button>
      </Flexbox>
    </Flexbox>
  );
};
