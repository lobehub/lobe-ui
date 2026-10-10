'use client';

import * as stylex from '@stylexjs/stylex';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import Text from '@/Text';

import { styles as surfaceStyles } from '../Surface/style';
import { styles } from './style';
import type { StatCardProps, StatDirection } from './type';

const deltaIcon = {
  down: TrendingDown,
  flat: Minus,
  up: TrendingUp,
} satisfies Record<StatDirection, typeof Minus>;

const deltaStyles = {
  down: styles.deltaDown,
  flat: styles.deltaFlat,
  up: styles.deltaUp,
};

const textStyles = {
  hint: { color: cssVar.colorTextTertiary, fontSize: cssVar.fontSizeSM },
  label: { color: cssVar.colorTextSecondary, fontSize: cssVar.fontSizeSM },
  metricHint: { color: cssVar.colorText, fontSize: cssVar.fontSize },
  metricLabel: { color: cssVar.colorText, fontSize: cssVar.fontSize, fontWeight: 500 },
};

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
  return (
    <div {...stylex.props(styles.lift)}>
      <Flexbox
        {...stylex.props(
          styles.root,
          surfaceStyles.card,
          wash && [styles.wash, styles[wash]],
          styles.frame,
        )}
      >
        <Flexbox gap={prominent ? 0 : 8} {...stylex.props(styles.body)}>
          <Flexbox horizontal align="center" justify="space-between">
            <Flexbox horizontal align="center" gap={6} {...stylex.props(styles.copy)}>
              <Text ellipsis style={prominent ? textStyles.metricLabel : textStyles.label}>
                {label}
              </Text>
              {action}
            </Flexbox>
            {mark ? (
              <span aria-hidden {...stylex.props(styles.badge)}>
                <Icon icon={mark} size={14} />
              </span>
            ) : null}
          </Flexbox>
          <div {...stylex.props(prominent ? styles.metricValue : styles.value)}>{value}</div>
          {delta || hint ? (
            <Flexbox
              horizontal
              align="center"
              gap={8}
              wrap="wrap"
              {...stylex.props(prominent && styles.metricFoot)}
            >
              {delta ? (
                <span {...stylex.props(styles.delta, deltaStyles[direction])}>
                  <Icon icon={deltaIcon[direction]} size={14} />
                  {delta}
                </span>
              ) : null}
              {hint ? (
                <Text style={prominent ? textStyles.metricHint : textStyles.hint}>{hint}</Text>
              ) : null}
            </Flexbox>
          ) : null}
        </Flexbox>
      </Flexbox>
    </div>
  );
}

StatCard.displayName = 'StatCard';

export default StatCard;
