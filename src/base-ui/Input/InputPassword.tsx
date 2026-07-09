'use client';

import { Eye, EyeOff } from 'lucide-react';
import { memo, useState } from 'react';

import Icon from '@/Icon';

import Input from './Input';
import { styles } from './style';
import type { InputPasswordProps } from './type';

const InputPassword = memo<InputPasswordProps>(({ visibilityToggle = true, suffix, ...rest }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      type={visible ? 'text' : 'password'}
      suffix={
        <>
          {suffix}
          {visibilityToggle && (
            <button
              aria-label={visible ? 'Hide password' : 'Show password'}
              className={styles.passwordToggle}
              tabIndex={-1}
              type={'button'}
              onClick={() => setVisible((v) => !v)}
            >
              <Icon icon={visible ? Eye : EyeOff} size={16} />
            </button>
          )}
        </>
      }
      {...rest}
    />
  );
});

InputPassword.displayName = 'InputPassword';

export default InputPassword;
