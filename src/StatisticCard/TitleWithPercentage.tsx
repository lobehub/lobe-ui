'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import Tag from '@/Tag';
import Text from '@/Text';

import { styles } from './style';
import type { TitleWithPercentageProps } from './type';
import { calcGrowthPercentage } from './utils';

export const TitleWithPercentage = memo<TitleWithPercentageProps>(
  ({ inverseColor, title, prvCount, count }) => {
    const percentage = calcGrowthPercentage(count || 0, prvCount || 0);

    const isUp = inverseColor ? percentage < 0 : percentage > 0;

    return (
      <Flexbox
        horizontal
        align={'center'}
        gap={4}
        justify={'flex-start'}
        style={{ overflow: 'hidden', position: 'inherit' }}
      >
        <Text
          as={'h2'}
          ellipsis={{ rows: 1, tooltip: title }}
          style={{
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
            margin: 0,
            overflow: 'hidden',
          }}
        >
          {title}
        </Text>
        {count && prvCount && percentage && percentage !== 0 ? (
          <Tag className={isUp ? styles.percentUp : styles.percentDown} variant={'borderless'}>
            {percentage > 0 ? '↑' : '↓'} {Math.abs(percentage).toFixed(1)}%
          </Tag>
        ) : null}
      </Flexbox>
    );
  },
);

TitleWithPercentage.displayName = 'TitleWithPercentage';
