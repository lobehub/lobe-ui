'use client';

import { useResponsive } from 'antd-style';
import { cva } from 'class-variance-authority';
import numeral from 'numeral';
import { type FC, useMemo } from 'react';

import Button from '@/Button';
import FluentEmoji from '@/FluentEmoji';
import chatMessages from '@/i18n/resources/en/chat';
import { useTranslation } from '@/i18n/useTranslation';

import { useStyles } from './style';
import type { TokenTagProps } from './type';

const format = (number: number) => numeral(number).format('0,0');

const TokenTag: FC<TokenTagProps> = ({
  className,
  shape = 'round',
  mode = 'remained',
  maxValue,
  value,
  text,
  unoptimized,
  hideText,
  ref,
  ...rest
}) => {
  const { mobile } = useResponsive();
  const { t } = useTranslation(chatMessages);
  const valueLeft = maxValue - value;
  const percent = valueLeft / maxValue;
  const showText = !hideText && !mobile;
  const remainedText = text?.remained ?? t('tokenTag.remained');
  const usedText = text?.used ?? t('tokenTag.used');
  const overloadText = text?.overload ?? t('tokenTag.overload');

  const data = useMemo(() => {
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
    return {
      emoji,
      type,
    };
  }, [percent]);

  const { styles, cx } = useStyles();

  const variants = useMemo(
    () =>
      cva(styles.root, {
        defaultVariants: {
          type: 'normal',
        },
        /* eslint-disable sort-keys-fix/sort-keys-fix */
        variants: {
          type: {
            normal: styles.normal,
            low: styles.low,
            overload: styles.overload,
          },
        },
        /* eslint-enable sort-keys-fix/sort-keys-fix */
      }),
    [styles],
  );

  return (
    <Button
      className={cx(variants({ type: data.type }), className)}
      ref={ref}
      shape={shape}
      variant={'filled'}
      {...rest}
    >
      <FluentEmoji emoji={data.emoji} size={18} unoptimized={unoptimized} />
      {valueLeft > 0
        ? [
            showText ? (mode === 'remained' ? remainedText : usedText) : '',
            mode === 'remained' ? format(valueLeft) : format(value),
          ].join(' ')
        : overloadText}
    </Button>
  );
};

TokenTag.displayName = 'TokenTag';

export default TokenTag;
