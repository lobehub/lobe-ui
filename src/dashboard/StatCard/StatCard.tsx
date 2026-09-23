'use client';

import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import Text from '@/base-ui/Text';
import Block from '@/Block';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

import { styles as surfaceStyles } from '../Surface/style';
import { styles } from './style';
import type { StatCardProps, StatDirection } from './type';

const deltaIcon = {
  down: TrendingDown,
  flat: Minus,
  up: TrendingUp,
} satisfies Record<StatDirection, typeof Minus>;

function StatCard({
  action,
  delta,
  direction = 'flat',
  hint,
  label,
  mark,
  prominent = false,
  value,
  wash,
}: StatCardProps) {
  const deltaClass = {
    down: styles.deltaDown,
    flat: styles.deltaFlat,
    up: styles.deltaUp,
  }[direction];

  return (
    <div className={styles.lift}>
      <Block
        className={`${styles.root} ${surfaceStyles.card}${wash ? ` ${styles.wash} ${styles[wash]}` : ''} ${styles.frame}`}
        variant="borderless"
      >
        <Flexbox className={styles.body} gap={prominent ? 0 : 8}>
          <Flexbox horizontal align="center" justify="space-between">
            <Flexbox horizontal align="center" className={styles.copy} gap={6}>
              <Text ellipsis className={prominent ? styles.metricLabel : styles.label}>
                {label}
              </Text>
              {action}
            </Flexbox>
            {mark ? (
              <span aria-hidden className={styles.badge}>
                <Icon icon={mark} size={14} />
              </span>
            ) : null}
          </Flexbox>
          <div className={prominent ? styles.metricValue : styles.value}>{value}</div>
          {delta || hint ? (
            <Flexbox
              horizontal
              align="center"
              className={prominent ? styles.metricFoot : undefined}
              gap={8}
              wrap="wrap"
            >
              {delta ? (
                <span className={`${styles.delta} ${deltaClass}`}>
                  <Icon icon={deltaIcon[direction]} size={14} />
                  {delta}
                </span>
              ) : null}
              {hint ? (
                <Text className={prominent ? styles.metricHint : styles.hint}>{hint}</Text>
              ) : null}
            </Flexbox>
          ) : null}
        </Flexbox>
      </Block>
    </div>
  );
}

StatCard.displayName = 'StatCard';

export default StatCard;
