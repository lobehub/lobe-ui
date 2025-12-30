import { Button, Tooltip, TooltipGroup } from '@lobehub/ui';
import { StoryBook, useCreateStore } from '@lobehub/ui/storybook';
import { useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';

export default () => {
  const store = useCreateStore();
  const [standaloneMounted, setStandaloneMounted] = useState(true);
  const [standalonePending, setStandalonePending] = useState(false);
  const standaloneTimerRef = useRef<number | null>(null);
  const [groupMounted, setGroupMounted] = useState(true);
  const [groupPending, setGroupPending] = useState(false);
  const groupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (standaloneTimerRef.current) window.clearTimeout(standaloneTimerRef.current);
      if (groupTimerRef.current) window.clearTimeout(groupTimerRef.current);
    };
  }, []);

  const clearStandalonePending = () => {
    if (standaloneTimerRef.current) window.clearTimeout(standaloneTimerRef.current);
    standaloneTimerRef.current = null;
    setStandalonePending(false);
  };

  const clearGroupPending = () => {
    if (groupTimerRef.current) window.clearTimeout(groupTimerRef.current);
    groupTimerRef.current = null;
    setGroupPending(false);
  };

  const toggleStandaloneMounted = () => {
    clearStandalonePending();
    setStandaloneMounted((prev) => !prev);
  };

  const toggleGroupMounted = () => {
    clearGroupPending();
    setGroupMounted((prev) => !prev);
  };

  const removeStandaloneLater = () => {
    if (!standaloneMounted) return;
    clearStandalonePending();
    setStandalonePending(true);
    standaloneTimerRef.current = window.setTimeout(() => {
      setStandaloneMounted(false);
      setStandalonePending(false);
      standaloneTimerRef.current = null;
    }, 1000);
  };

  const removeGroupLater = () => {
    if (!groupMounted) return;
    clearGroupPending();
    setGroupPending(true);
    groupTimerRef.current = window.setTimeout(() => {
      setGroupMounted(false);
      setGroupPending(false);
      groupTimerRef.current = null;
    }, 1000);
  };

  const hintStyle = { fontSize: 12, opacity: 0.6 };
  const titleStyle = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.4,
    opacity: 0.7,
    textTransform: 'uppercase' as const,
  };

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={16}>
        <div style={hintStyle}>
          Hover the trigger, then remove it while the tooltip is open. Both variants should close
          immediately.
        </div>
        <Flexbox gap={20}>
          <Flexbox gap={12}>
            <div style={titleStyle}>Standalone Tooltip</div>
            <Flexbox align="center" gap={12} horizontal wrap="wrap">
              <Button onClick={toggleStandaloneMounted}>
                {standaloneMounted ? 'Unmount trigger' : 'Mount trigger'}
              </Button>
              <Button
                disabled={!standaloneMounted || standalonePending}
                onClick={removeStandaloneLater}
              >
                {standalonePending ? 'Removing...' : 'Remove in 1s'}
              </Button>
              {standaloneMounted && (
                <Tooltip
                  closeDelay={10_000}
                  openDelay={0}
                  title="Tooltip should be destroyed on unmount"
                >
                  <Button type="primary">Hover me</Button>
                </Tooltip>
              )}
            </Flexbox>
          </Flexbox>
          <Flexbox gap={12}>
            <div style={titleStyle}>Tooltip Group (Singleton)</div>
            <Flexbox align="center" gap={12} horizontal wrap="wrap">
              <Button onClick={toggleGroupMounted}>
                {groupMounted ? 'Unmount trigger' : 'Mount trigger'}
              </Button>
              <Button disabled={!groupMounted || groupPending} onClick={removeGroupLater}>
                {groupPending ? 'Removing...' : 'Remove in 1s'}
              </Button>
              <TooltipGroup closeDelay={10_000} openDelay={0}>
                {groupMounted && (
                  <Tooltip title="Tooltip should be destroyed on unmount">
                    <Button type="primary">Hover me</Button>
                  </Tooltip>
                )}
              </TooltipGroup>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    </StoryBook>
  );
};
