'use client';

import { X } from 'lucide-react';
import { memo } from 'react';

import common from '@/i18n/resources/en/common';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
import { cx } from '@/styles';

import { styles } from './style';

interface ClearButtonProps {
  className?: string;
  onClear: () => void;
}

const ClearButton = memo<ClearButtonProps>(({ className, onClear }) => {
  const { t } = useTranslation(common);

  return (
    <button
      aria-label={t('common.clear')}
      className={cx(styles.clear, className)}
      data-lobe-input-clear=""
      tabIndex={-1}
      type="button"
      onClick={onClear}
      onMouseDown={(event) => event.preventDefault()}
    >
      <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />
    </button>
  );
});

ClearButton.displayName = 'InputClearButton';

export default ClearButton;
