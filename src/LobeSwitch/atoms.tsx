'use client';

import { Switch } from '@base-ui/react/switch';
import { cx } from 'antd-style';
import type { KeyboardEvent, MouseEvent } from 'react';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

import { useMotionComponent } from '@/MotionProvider';

import { rootVariants, styles, thumbVariants } from './style';
import type {
  LobeSwitchChangeEventHandler,
  LobeSwitchContextType,
  LobeSwitchIconPosition,
  LobeSwitchIconProps,
  LobeSwitchRootProps,
  LobeSwitchThumbProps,
} from './type';

const LobeSwitchContext = createContext<LobeSwitchContextType | null>(null);

export const useLobeSwitchContext = () => {
  const context = useContext(LobeSwitchContext);
  if (!context) {
    throw new Error('useLobeSwitchContext must be used within a LobeSwitchRoot');
  }
  return context;
};

type LobeSwitchRootInternalProps = Omit<LobeSwitchRootProps, 'onCheckedChange' | 'onClick'> & {
  onCheckedChange?: LobeSwitchChangeEventHandler;
  onClick?: LobeSwitchChangeEventHandler;
};

export const LobeSwitchRoot = ({
  checked,
  className,
  defaultChecked,
  onCheckedChange,
  onClick,
  size = 'default',
  children,
  disabled,
  readOnly,
  required,
  inputRef,
  id,
  name,
  ...rest
}: LobeSwitchRootInternalProps) => {
  const Motion = useMotionComponent();
  const [isPressed, setIsPressed] = useState(false);
  const lastEventRef = useRef<MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>>(
    null,
  );

  const [isChecked, setIsChecked] = useControlledState(defaultChecked ?? false, {
    defaultValue: defaultChecked,
    onChange: (value: boolean) => {
      if (lastEventRef.current) {
        onCheckedChange?.(value, lastEventRef.current);
      }
    },
    value: checked,
  });

  const baseClassName = rootVariants({ size });

  const contextValue = useMemo(
    () => ({
      isChecked: Boolean(isChecked),
      isPressed,
      setIsChecked: (value: boolean) => setIsChecked(value),
      setIsPressed,
    }),
    [isChecked, isPressed, setIsChecked],
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    lastEventRef.current = event;
    onClick?.(!isChecked, event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      lastEventRef.current = event;
    }
    (rest as any).onKeyDown?.(event);
  };

  return (
    <LobeSwitchContext.Provider value={contextValue}>
      <Switch.Root
        checked={isChecked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        inputRef={inputRef}
        name={name}
        onCheckedChange={setIsChecked}
        readOnly={readOnly}
        render={
          <Motion.button
            {...rest}
            className={cx(baseClassName, className)}
            initial={false}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onTap={() => setIsPressed(false)}
            onTapCancel={() => setIsPressed(false)}
            onTapStart={() => setIsPressed(true)}
            whileTap="tap"
          />
        }
        required={required}
      >
        {children}
      </Switch.Root>
    </LobeSwitchContext.Provider>
  );
};

LobeSwitchRoot.displayName = 'LobeSwitchRoot';

export const LobeSwitchThumb = ({
  className,
  pressedAnimation,
  size = 'default',
  transition = { damping: 25, stiffness: 300, type: 'spring' },
  children,
  ...rest
}: LobeSwitchThumbProps) => {
  const Motion = useMotionComponent();
  const { isPressed } = useLobeSwitchContext();
  const baseClassName = thumbVariants({ size });

  const defaultPressedAnimation = {
    width: size === 'small' ? 16 : 22,
  };

  return (
    <Switch.Thumb
      render={
        <Motion.span
          animate={isPressed ? pressedAnimation || defaultPressedAnimation : undefined}
          className={cx(baseClassName, className)}
          layout
          transition={transition}
          {...rest}
        >
          {children}
        </Motion.span>
      }
    />
  );
};

LobeSwitchThumb.displayName = 'LobeSwitchThumb';

const getIconPositionClass = (position: LobeSwitchIconPosition, size: 'default' | 'small') => {
  if (position === 'thumb') return styles.iconThumb;
  if (position === 'left') return size === 'small' ? styles.iconLeftSmall : styles.iconLeft;
  return size === 'small' ? styles.iconRightSmall : styles.iconRight;
};

export const LobeSwitchIcon = ({
  children,
  className,
  position,
  transition = { bounce: 0, type: 'spring' },
  ...rest
}: LobeSwitchIconProps & { children?: React.ReactNode; size?: 'default' | 'small' }) => {
  const Motion = useMotionComponent();
  const { isChecked } = useLobeSwitchContext();
  const size = (rest as any).size || 'default';

  const isAnimated = useMemo(() => {
    if (position === 'right') return !isChecked;
    if (position === 'left') return isChecked;
    if (position === 'thumb') return true;
    return false;
  }, [position, isChecked]);

  const positionClass = getIconPositionClass(position, size);

  return (
    <Motion.span
      animate={isAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      className={cx(styles.icon, positionClass, className)}
      transition={transition}
      {...rest}
    >
      {children}
    </Motion.span>
  );
};

LobeSwitchIcon.displayName = 'LobeSwitchIcon';

export { styles as lobeSwitchStyles } from './style';
