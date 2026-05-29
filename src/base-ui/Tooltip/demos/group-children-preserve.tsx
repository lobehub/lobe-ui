import { Button, Tooltip, TooltipGroup } from '@lobehub/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';

const NeighborProbe = ({ onMount }: { onMount: () => void }) => {
  useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <input
      defaultValue=""
      placeholder="type here, then force a reset"
      style={{
        border: '1px solid currentColor',
        borderRadius: 6,
        opacity: 0.7,
        padding: '4px 10px',
      }}
    />
  );
};

export default () => {
  const [mountCount, setMountCount] = useState(0);
  const [hidden, setHidden] = useState(false);
  const baselineRef = useRef<number | null>(null);

  const handleMount = useCallback(() => {
    setMountCount((count) => count + 1);
  }, []);

  if (baselineRef.current === null && mountCount > 0) {
    baselineRef.current = mountCount;
  }

  const remounted = baselineRef.current !== null && mountCount > baselineRef.current;

  return (
    <Flexbox gap={16}>
      <Flexbox gap={4} style={{ fontSize: 12, opacity: 0.6 }}>
        <div>1. Type something into the neighbor input.</div>
        <div>2. Hover the button so its tooltip opens (closeDelay is 10s, so it stays open).</div>
        <div>
          3. Click <b>Hide active trigger</b> — the open trigger becomes <code>display:none</code>,
          which forces a group reset.
        </div>
        <div>
          Expected after the reset: the input text is preserved and the neighbor does NOT remount.
        </div>
      </Flexbox>

      <Flexbox horizontal align="center" gap={8} style={{ fontSize: 13, fontWeight: 600 }}>
        <span>Neighbor mount count: {mountCount}</span>
        <span style={{ color: remounted ? '#c0392b' : '#27ae60' }}>
          {remounted ? '✗ remounted on reset' : '✓ stable'}
        </span>
      </Flexbox>

      <TooltipGroup closeDelay={10_000} openDelay={0}>
        <Flexbox horizontal align="center" gap={12} wrap="wrap">
          <NeighborProbe onMount={handleMount} />
          <div style={{ display: hidden ? 'none' : 'block' }}>
            <Tooltip title="Hover me, then hide this trigger to force a group reset">
              <Button type="primary">Hover me</Button>
            </Tooltip>
          </div>
        </Flexbox>
      </TooltipGroup>

      <Flexbox horizontal gap={12}>
        <Button onClick={() => setHidden((prev) => !prev)}>
          {hidden ? 'Show trigger' : 'Hide active trigger (force reset)'}
        </Button>
        <Button
          onClick={() => {
            baselineRef.current = null;
            setMountCount(0);
          }}
        >
          Reset counter
        </Button>
      </Flexbox>
    </Flexbox>
  );
};
