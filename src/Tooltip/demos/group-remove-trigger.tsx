import { Button, Tooltip, TooltipGroup } from '@lobehub/ui';
import { StoryBook, useCreateStore } from '@lobehub/ui/storybook';
import { useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';

export default () => {
  const store = useCreateStore();
  const [mounted, setMounted] = useState(true);
  const [pending, setPending] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const clearPending = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setPending(false);
  };

  const toggleMounted = () => {
    clearPending();
    setMounted((prev) => !prev);
  };

  const removeLater = () => {
    if (!mounted) return;
    clearPending();
    setPending(true);
    timerRef.current = window.setTimeout(() => {
      setMounted(false);
      setPending(false);
      timerRef.current = null;
    }, 1000);
  };

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={12}>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          Hover the primary button, then remove the trigger while the tooltip is open.
        </div>
        <Flexbox align="center" gap={12} horizontal wrap="wrap">
          <Button onClick={toggleMounted}>{mounted ? 'Unmount trigger' : 'Mount trigger'}</Button>
          <Button disabled={!mounted || pending} onClick={removeLater}>
            {pending ? 'Removing...' : 'Remove in 1s'}
          </Button>
          <TooltipGroup closeDelay={10_000} openDelay={0}>
            {mounted && (
              <Tooltip title="Tooltip should be destroyed on unmount">
                <Button type="primary">Hover me</Button>
              </Tooltip>
            )}
          </TooltipGroup>
        </Flexbox>
      </Flexbox>
    </StoryBook>
  );
};
