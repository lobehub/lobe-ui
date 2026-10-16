'use client';

import * as stylex from '@stylexjs/stylex';
import { Eye, EyeOff } from 'lucide-react';
import { memo, useState } from 'react';

import Icon from '@/Icon';

import Input from './Input';
import { styles } from './style';
import type { InputPasswordProps } from './type';

const InputPassword = memo<InputPasswordProps>(
  ({ visibilityToggle = true, visibilityToggleLabels, suffix, ...rest }) => {
    const [visible, setVisible] = useState(false);
    const toggleLabel = visible
      ? (visibilityToggleLabels?.hide ?? 'Hide password')
      : (visibilityToggleLabels?.show ?? 'Show password');

    return (
      <Input
        type={visible ? 'text' : 'password'}
        suffix={
          <>
            {suffix}
            {visibilityToggle && (
              <button
                aria-label={toggleLabel}
                tabIndex={-1}
                title={toggleLabel}
                type={'button'}
                onClick={() => setVisible((v) => !v)}
                {...stylex.props(styles.passwordToggle)}
              >
                <Icon icon={visible ? Eye : EyeOff} size={16} />
              </button>
            )}
          </>
        }
        {...rest}
      />
    );
  },
);

InputPassword.displayName = 'InputPassword';

export default Object.assign(InputPassword, { formBinding: { emptyValue: '' } as const });
