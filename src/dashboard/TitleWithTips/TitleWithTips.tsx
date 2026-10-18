'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { InfoIcon } from 'lucide-react';

import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import Tooltip from '@/Tooltip';

import { dashboardTitleWithTipsClasses } from './stable';
import type { TitleWithTipsProps } from './type';

const styles = stylex.create({
  icon: {
    cursor: 'help',
  },
});

/** A column or field title with an info icon that explains it on hover. */
const TitleWithTips = ({ className, tips, title }: TitleWithTipsProps) => (
  <Flexbox
    horizontal
    align={'center'}
    className={clsx(dashboardTitleWithTipsClasses(), className)}
    gap={4}
  >
    <span className={dashboardTitleWithTipsClasses('title')}>{title}</span>
    <Tooltip title={tips}>
      <Icon
        color={cssVar.colorTextTertiary}
        icon={InfoIcon}
        {...styleProps(styles.icon, dashboardTitleWithTipsClasses('icon'))}
      />
    </Tooltip>
  </Flexbox>
);

TitleWithTips.displayName = 'TitleWithTips';

export default TitleWithTips;
