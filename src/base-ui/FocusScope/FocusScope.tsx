'use client';

import { cx } from 'antd-style';
import { createContext, type HTMLAttributes, type Ref, use, useEffect, useId } from 'react';

import { registerScope, setActiveScope, useFocusScopeActive } from './store';
import { styles } from './style';

export interface FocusScopeProps extends HTMLAttributes<HTMLDivElement> {
  debugOutline?: boolean;
  id?: string;
  ref?: Ref<HTMLDivElement>;
}

const FocusScopeIdContext = createContext<string | null>(null);

export const useFocusScopeId = () => use(FocusScopeIdContext);

export const FocusScope = ({
  id,
  debugOutline = false,
  className,
  children,
  onKeyDown,
  ...rest
}: FocusScopeProps) => {
  const generatedId = useId();
  const scopeId = id ?? generatedId;
  const isActive = useFocusScopeActive(scopeId);

  useEffect(() => registerScope(scopeId), [scopeId]);

  return (
    <FocusScopeIdContext value={scopeId}>
      <div
        data-focus-scope={scopeId}
        data-scope-active={isActive ? '' : undefined}
        tabIndex={-1}
        {...rest}
        className={cx(styles.root, debugOutline && styles.debugOutline, className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === 'Escape') setActiveScope(null);
        }}
      >
        {children}
      </div>
    </FocusScopeIdContext>
  );
};

FocusScope.displayName = 'FocusScope';
