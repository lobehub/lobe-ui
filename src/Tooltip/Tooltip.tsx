'use client';

import { Tooltip as AntdTooltip } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Hotkey from '@/Hotkey';

import { useStyles } from './style';
import type { TooltipProps } from './type';

const Tooltip = memo<TooltipProps>(
  ({ ref, hotkey, className, arrow = false, title, hotkeyProps, ...rest }) => {
    const { styles, cx } = useStyles();

    return (
      <AntdTooltip
        arrow={arrow}
        classNames={{
          root: cx(styles.tooltip, className),
        }}
        ref={ref}
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

Tooltip.displayName = 'Tooltip';

export default Tooltip;
