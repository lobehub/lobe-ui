'use client';

import { createStaticStyles, cx } from 'antd-style';
import { ChevronDownIcon } from 'lucide-react';
import { createContext, type CSSProperties, type ReactNode, use, useMemo } from 'react';

import { DropdownMenu, type DropdownMenuProps } from '@/base-ui/DropdownMenu';

import Button from './Button';
import type { ButtonProps } from './type';

interface SharedVisualProps {
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonProps['size'];
  type?: ButtonProps['type'];
}

interface SplitButtonProps extends SharedVisualProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const SplitButtonContext = createContext<SharedVisualProps>({});

const styles = createStaticStyles(({ css, cssVar }) => ({
  interactionDisabled: css`
    opacity: 0.5;

    & > :where(button, a):disabled,
    & > :where(button, a)[aria-disabled='true'] {
      opacity: 1;
    }
  `,
  solid: css`
    & > :where(button, a):last-of-type::before {
      pointer-events: none;
      content: '';

      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;

      width: 1px;

      opacity: 0.2;
      background: currentcolor;
    }
  `,
  solidDanger: css`
    &:has(> :where(button, a):hover:not(:disabled, [aria-disabled='true'])) > :where(button, a) {
      border-color: ${cssVar.colorErrorHover};
      background: ${cssVar.colorErrorHover};
    }

    &:has(> :where(button, a):active:not(:disabled, [aria-disabled='true'])) > :where(button, a) {
      border-color: ${cssVar.colorErrorActive};
      background: ${cssVar.colorErrorActive};
    }
  `,
  solidPrimary: css`
    &:has(> :where(button, a):hover:not(:disabled, [aria-disabled='true'])) > :where(button, a) {
      border-color: ${cssVar.colorPrimaryHover};
      background: ${cssVar.colorPrimaryHover};
    }

    &:has(> :where(button, a):active:not(:disabled, [aria-disabled='true'])) > :where(button, a) {
      border-color: ${cssVar.colorPrimaryActive};
      background: ${cssVar.colorPrimaryActive};
    }
  `,
  splitButton: css`
    display: inline-flex;
    flex-direction: row;

    & > :where(button, a):first-of-type {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }

    & > :where(button, a):last-of-type {
      margin-inline-start: -1px;
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }
  `,
}));

const SplitButton = ({
  children,
  className,
  style,
  danger,
  disabled,
  loading,
  size,
  type,
}: SplitButtonProps) => {
  const shared = useMemo<SharedVisualProps>(
    () => ({ danger, disabled, loading, size, type }),
    [danger, disabled, loading, size, type],
  );
  return (
    <SplitButtonContext value={shared}>
      <div
        style={style}
        className={cx(
          styles.splitButton,
          type === 'primary' && styles.solid,
          type === 'primary' && (danger ? styles.solidDanger : styles.solidPrimary),
          (disabled || loading) && styles.interactionDisabled,
          className,
        )}
      >
        {children}
      </div>
    </SplitButtonContext>
  );
};

const SplitButtonMain = (props: ButtonProps) => {
  const shared = use(SplitButtonContext);
  return <Button {...shared} {...props} />;
};

interface SplitButtonMenuProps extends Omit<DropdownMenuProps, 'children'> {
  icon?: ReactNode;
}

const SplitButtonMenu = ({
  icon = <ChevronDownIcon size={14} />,
  disabled,
  ...menuProps
}: SplitButtonMenuProps) => {
  const shared = use(SplitButtonContext);
  const interactionDisabled = disabled || shared.disabled || shared.loading;

  return (
    <DropdownMenu {...menuProps} disabled={interactionDisabled}>
      <Button {...shared} disabled={interactionDisabled} icon={icon} />
    </DropdownMenu>
  );
};

type SplitButtonComponent = typeof SplitButton & {
  Main: typeof SplitButtonMain;
  Menu: typeof SplitButtonMenu;
};

(SplitButton as SplitButtonComponent).Main = SplitButtonMain;
(SplitButton as SplitButtonComponent).Menu = SplitButtonMenu;

export type { SplitButtonMenuProps, SplitButtonProps };
export default SplitButton as SplitButtonComponent;
