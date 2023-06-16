import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface TokenTagProps extends DivProps {
  maxValue: number;
  value: number;
}

const TokenTag = memo<TokenTagProps>(({ className, maxValue, value, ...props }) => {
  const valueLeft = maxValue - value;
  const percent = valueLeft / maxValue;
  let type: 'normal' | 'low' | 'overload';
  let emoji;

  if (percent > 0.3) {
    type = 'normal';
    emoji = '😀';
  } else if (percent > 0) {
    type = 'low';
    emoji = '😅';
  } else {
    type = 'overload';
    emoji = '🤯';
  }

  const { styles, cx } = useStyles(type);

  return (
    <div className={cx(styles.container, className)} {...props}>
      <span className={styles.emoji}>{emoji}</span>
      {valueLeft > 0 ? `Tokens ${valueLeft}` : `Overload`}
    </div>
  );
});

export default TokenTag;
