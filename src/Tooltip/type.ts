import type { TooltipProps as AntdTooltipProps } from 'antd';
import type { TooltipRef } from 'antd/lib/tooltip';
import type { ReactNode, Ref } from 'react';

import type { HotkeyProps } from '@/Hotkey';

export type TooltipProps = Omit<AntdTooltipProps, 'title'> & {
  hotkey?: string;
  hotkeyProps?: Omit<HotkeyProps, 'keys'>;
  ref?: Ref<TooltipRef>;
  title: ReactNode;
};
