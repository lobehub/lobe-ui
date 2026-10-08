'use client';

import * as stylex from '@stylexjs/stylex';
import { X } from 'lucide-react';
import { memo } from 'react';

import common from '@/i18n/resources/en/common';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';

import { styles } from './style';

interface ClearButtonProps {
  onClear: () => void;
  xstyle?: stylex.StyleXStyles;
}

const ClearButton = memo<ClearButtonProps>(({ xstyle, onClear }) => {
  const { t } = useTranslation(common);

  return (
    <button
      aria-label={t('common.clear')}
      data-lobe-input-clear=""
      tabIndex={-1}
      type="button"
      onClick={onClear}
      onMouseDown={(event) => event.preventDefault()}
      {...stylex.props(styles.clear, xstyle)}
    >
      <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />
    </button>
  );
});

ClearButton.displayName = 'InputClearButton';

export default ClearButton;
