'use client';

import clsx from 'clsx';
import { type FC, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import chatMessages from '@/i18n/resources/en/chat';
import { useTranslation } from '@/i18n/useTranslation';
import Progress from '@/Progress';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { toDataAttributes } from '@/utils/bem';
import { formatNumber } from '@/utils/formatNumber';

import { chatTokenTagClasses } from './stable';
import type { TokenTagProps } from './type';

const TokenTag: FC<TokenTagProps> = ({
  mode = 'remained',
  maxValue,
  value,
  text,
  showInfo,
  size = 20,
  className,
  ...rest
}) => {
  const { t } = useTranslation(chatMessages);
  const valueLeft = maxValue - value;
  const percent = value / maxValue;
  const remainedText = text?.remained ?? t('tokenTag.remained');
  const usedText = text?.used ?? t('tokenTag.used');
  const overloadText = text?.overload ?? t('tokenTag.overload');

  const data = useMemo(() => {
    let type: 'normal' | 'low' | 'overload';
    let color;

    if (percent < 0.7) {
      type = 'normal';
      color = cssVar.colorText;
    } else if (percent < 0.9) {
      type = 'low';
      color = cssVar.colorWarning;
    } else {
      type = 'overload';
      color = cssVar.colorError;
    }
    return {
      color,
      type,
    };
  }, [percent]);

  const title =
    valueLeft > 0
      ? [
          mode === 'remained' ? remainedText : usedText,
          mode === 'remained' ? formatNumber(valueLeft) : formatNumber(value),
        ].join(' ')
      : overloadText;

  return (
    <ActionIcon
      className={clsx(chatTokenTagClasses(), className)}
      size={size}
      title={showInfo ? title : undefined}
      icon={
        <Progress
          className={chatTokenTagClasses('progress')}
          percent={percent * 100}
          showInfo={false}
          size={Number(typeof size === 'object' ? size?.size || 20 : size) || 20}
          strokeColor={data.color}
          type="circle"
        />
      }
      {...toDataAttributes({ mode, status: data.type })}
      {...rest}
    />
  );
};

TokenTag.displayName = 'TokenTag';

export default TokenTag;
