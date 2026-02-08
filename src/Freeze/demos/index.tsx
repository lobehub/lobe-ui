import { Block, Button, Freeze } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [frozen, setFrozen] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type={frozen ? 'primary' : 'default'} onClick={() => setFrozen((f) => !f)}>
          {frozen ? 'Unfreeze' : 'Freeze'}
        </Button>
        <Button onClick={() => setCount((c) => c + 1)}>Increment: {count}</Button>
      </div>

      <Freeze frozen={frozen}>
        <Block padding={16}>
          <p style={{ margin: 0 }}>Count: {count}</p>
          <p style={{ fontSize: 14, margin: '8px 0 0', opacity: 0.8 }}>
            {frozen
              ? 'This content is frozen. The count above will not update until unfrozen.'
              : 'This content is live. Click "Freeze" to prevent DOM updates.'}
          </p>
        </Block>
      </Freeze>
    </div>
  );
};
