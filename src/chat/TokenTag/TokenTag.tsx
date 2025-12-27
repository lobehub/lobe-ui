'use client';

import { Progress } from 'antd';
import { cssVar } from 'antd-style';
import numeral from 'numeral';
import { type FC, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import chatMessages from '@/i18n/resources/en/chat';
import { useTranslation } from '@/i18n/useTranslation';

import type { TokenTagProps } from './type';

const format = (number: number) => numeral(number).format('0,0');

const TokenTag: FC<TokenTagProps> = ({
  mode = 'remained',
  maxValue,
  value,
  text,
  showInfo,
  size = 20,
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
          mode === 'remained' ? format(valueLeft) : format(value),
        ].join(' ')
      : overloadText;

  return (
    <ActionIcon
      icon={
        <Progress
          percent={percent * 100}
          showInfo={false}
          size={Number(typeof size === 'object' ? size?.size || 20 : size) || 20}
          strokeColor={data.color}
          type="circle"
        />
      }
      size={size}
      title={showInfo ? title : undefined}
      {...rest}
    />
  );
};

TokenTag.displayName = 'TokenTag';

export default TokenTag;
