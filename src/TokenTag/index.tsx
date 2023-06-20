import { memo } from 'react';

import FluentEmoji from '@/FluentEmoji';
import { DivProps } from '@/types';

import { ICON_SIZE, useStyles } from './style';

export interface TokenTagProps extends DivProps {
  /**
   * @description Maximum value for the token
   */
  maxValue: number;
  /**
   * @description Current value of the token
   */
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
      <FluentEmoji emoji={emoji} size={ICON_SIZE} />
      {valueLeft > 0 ? `Tokens ${valueLeft}` : `Overload`}
    </div>
  );
});

export default TokenTag;
