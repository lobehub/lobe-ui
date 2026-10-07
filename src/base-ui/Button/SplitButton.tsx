'use client';

import { ChevronDownIcon } from 'lucide-react';
import { createContext, type CSSProperties, type ReactNode, use, useMemo } from 'react';

import { DropdownMenu, type DropdownMenuProps } from '@/base-ui/DropdownMenu';
import { styleProps } from '@/styles/stylex/props';

import { ButtonImpl } from './Button';
import { splitStyles } from './style';
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
        {...styleProps(
          [
            splitStyles.root,
            type === 'primary' && (danger ? splitStyles.solidDanger : splitStyles.solidPrimary),
            (disabled || loading) && splitStyles.interactionDisabled,
          ],
          className,
          style,
        )}
      >
        {children}
      </div>
    </SplitButtonContext>
  );
};

const itemStyle = (shared: SharedVisualProps, type: ButtonProps['type']) => {
  const solid = shared.type === 'primary';
  return [
    splitStyles.item,
    (shared.disabled || shared.loading) && splitStyles.itemInteractionDisabled,
    solid && splitStyles.itemSolid,
    solid &&
      type === 'primary' &&
      (shared.danger ? splitStyles.itemSolidDanger : splitStyles.itemSolidPrimary),
  ];
};

const SplitButtonMain = (props: ButtonProps) => {
  const shared = use(SplitButtonContext);
  return (
    <ButtonImpl {...shared} {...props} xstyle={itemStyle(shared, props.type ?? shared.type)} />
  );
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
      <ButtonImpl
        {...shared}
        disabled={interactionDisabled}
        icon={icon}
        xstyle={itemStyle(shared, shared.type)}
      />
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
