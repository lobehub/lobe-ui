'use client';

import { InfoIcon } from 'lucide-react';

import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import Tooltip from '@/Tooltip';

import type { TitleWithTipsProps } from './type';

/** A column or field title with an info icon that explains it on hover. */
const TitleWithTips = ({ className, tips, title }: TitleWithTipsProps) => (
  <Flexbox horizontal align={'center'} className={className} gap={4}>
    <span>{title}</span>
    <Tooltip title={tips}>
      <Icon color={cssVar.colorTextTertiary} icon={InfoIcon} style={{ cursor: 'help' }} />
    </Tooltip>
  </Flexbox>
);

TitleWithTips.displayName = 'TitleWithTips';

export default TitleWithTips;
