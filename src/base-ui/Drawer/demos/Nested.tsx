import { Flexbox, Text } from '@lobehub/ui';
import { Button, Drawer } from '@lobehub/ui/base-ui';
import { useState } from 'react';

const TIMELINE = [
  '09:14 · Alert fired on p99 latency',
  '09:18 · On-call acknowledged',
  '09:26 · Routing change identified',
  '09:31 · Rollback deployed',
  '09:38 · Metrics back to baseline',
];

export default () => {
  const [outer, setOuter] = useState(false);
  const [inner, setInner] = useState(false);

  return (
    <>
      <Button onClick={() => setOuter(true)}>Review incident</Button>

      <Drawer open={outer} title="INC-2481 · Elevated p99 latency" onClose={() => setOuter(false)}>
        <Flexbox gap={12}>
          <Text as="p" style={{ margin: 0, opacity: 0.65 }}>
            Latency on the inference gateway crossed the 1.2s threshold for 14 minutes. Rollback of
            the routing change restored baseline.
          </Text>
          <Button onClick={() => setInner(true)}>Open timeline</Button>
        </Flexbox>

        <Drawer open={inner} title="Timeline" width={320} onClose={() => setInner(false)}>
          <Flexbox gap={12}>
            {TIMELINE.map((entry) => (
              <Text key={entry} style={{ fontSize: 13, opacity: 0.7 }}>
                {entry}
              </Text>
            ))}
          </Flexbox>
        </Drawer>
      </Drawer>
    </>
  );
};
