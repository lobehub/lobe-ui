'use client';

import { Collapsible as BaseUICollapsible } from '@base-ui/react/collapsible';
import { cx } from 'antd-style';
import { memo } from 'react';

import { accordionStyles } from '../Accordion/atoms';
import type { CollapsibleProps } from './type';

const Collapsible = memo<CollapsibleProps>(
  ({ open, keepMounted, children, className, contentClassName, contentStyle, style }) => (
    <BaseUICollapsible.Root open={open}>
      <BaseUICollapsible.Panel
        className={cx(accordionStyles.panel, className)}
        keepMounted={keepMounted}
        style={style}
      >
        <div className={cx(accordionStyles.content, contentClassName)} style={contentStyle}>
          {children}
        </div>
      </BaseUICollapsible.Panel>
    </BaseUICollapsible.Root>
  ),
);

Collapsible.displayName = 'Collapsible';

export default Collapsible;
