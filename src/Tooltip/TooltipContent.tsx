'use client';

import { memo, type ReactNode, useMemo } from 'react';

import Hotkey, { type HotkeyProps } from '@/Hotkey';

type TooltipContentProps = {
  hotkey?: string;
  hotkeyProps?: Omit<HotkeyProps, 'keys'>;
  title: ReactNode;
};

const TooltipContent = memo<TooltipContentProps>(({ title, hotkey, hotkeyProps }) => {
  const resolvedHotkeyProps = useMemo(
    () => ({
      compact: true,
      ...hotkeyProps,
    }),
    [hotkeyProps],
  );

  return (
    <>
      {title}
      {hotkey ? <Hotkey keys={hotkey} {...resolvedHotkeyProps} /> : null}
    </>
  );
});

TooltipContent.displayName = 'TooltipContent';

export default TooltipContent;
