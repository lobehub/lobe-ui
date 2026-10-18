'use client';

import * as stylex from '@stylexjs/stylex';
import { X } from 'lucide-react';
import { memo } from 'react';

import common from '@/i18n/resources/en/common';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';

interface ClearButtonProps {
  className?: string;
  onClear: () => void;
  xstyle?: stylex.StyleXStyles;
}

const ClearButton = memo<ClearButtonProps>(({ className, xstyle, onClear }) => {
  const { t } = useTranslation(common);

  return (
    <button
      aria-label={t('common.clear')}
      data-lobe-input-clear=""
      tabIndex={-1}
      type="button"
      onClick={onClear}
      onMouseDown={(event) => event.preventDefault()}
      {...styleProps([styles.clear, xstyle], className)}
    >
      <Icon icon={X} size={10} {...stylex.props(styles.clearIcon)} />
    </button>
  );
});

ClearButton.displayName = 'InputClearButton';

export default ClearButton;
