'use client';

import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { memo, useState } from 'react';

import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

import Input from './Input';
import { inputPasswordClasses } from './stable';
import { styles } from './style';
import type { InputPasswordProps } from './type';

const InputPassword = memo<InputPasswordProps>(
  ({ className, visibilityToggle = true, visibilityToggleLabels, suffix, ...rest }) => {
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
                {...styleProps(styles.passwordToggle, inputPasswordClasses('toggle'))}
              >
                <Icon icon={visible ? Eye : EyeOff} size={16} />
              </button>
            )}
          </>
        }
        {...rest}
        className={clsx(inputPasswordClasses(), className)}
      />
    );
  },
);

InputPassword.displayName = 'InputPassword';

export default Object.assign(InputPassword, { formBinding: { emptyValue: '' } as const });
