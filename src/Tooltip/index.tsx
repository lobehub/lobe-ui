'use client';

import { Tooltip as AntdTooltip, type TooltipProps as AntdTooltipProps } from 'antd';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Hotkey, { type HotkeyProps } from '@/Hotkey';

import { useStyles } from './style';

export type TooltipProps = Omit<AntdTooltipProps, 'title'> & {
  hotkey?: string;
  hotkeyProps?: Omit<HotkeyProps, 'keys'>;
  title: ReactNode;
};

const Tooltip = memo<TooltipProps>(
  ({ hotkey, className, arrow = false, title, hotkeyProps, ...rest }) => {
    const { styles, cx } = useStyles();

    return (
      <AntdTooltip
        arrow={arrow}
        classNames={{
          root: cx(styles.tooltip, className),
        }}
        title={
          hotkey ? (
            <Flexbox align={'center'} gap={8} horizontal justify={'space-between'}>
              <span>{title}</span>
              <Hotkey inverseTheme keys={hotkey} {...hotkeyProps} />
            </Flexbox>
          ) : (
            title
          )
        }
        {...rest}
      />
    );
  },
);

export default Tooltip;
