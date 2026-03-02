'use client';

import { Switch } from '@base-ui/react/switch';
import { cx } from 'antd-style';
import type { KeyboardEvent, MouseEvent } from 'react';
import { createContext, use, useMemo, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

import { useMotionComponent } from '@/MotionProvider';

import { rootVariants, styles, thumbVariants } from './style';
import type {
  SwitchChangeEventHandler,
  SwitchContextType,
  SwitchIconPosition,
  SwitchIconProps,
  SwitchRootProps,
  SwitchThumbProps,
} from './type';

const SwitchContext = createContext<SwitchContextType | null>(null);

export const useSwitchContext = () => {
  const context = use(SwitchContext);
  if (!context) {
    throw new Error('useSwitchContext must be used within a SwitchRoot');
  }
  return context;
};

type SwitchRootInternalProps = Omit<SwitchRootProps, 'onCheckedChange' | 'onClick'> & {
  onCheckedChange?: SwitchChangeEventHandler;
  onClick?: SwitchChangeEventHandler;
};

export const SwitchRoot = ({
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
}: SwitchRootInternalProps) => {
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
    <SwitchContext value={contextValue}>
      <Switch.Root
        checked={isChecked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        inputRef={inputRef}
        name={name}
        readOnly={readOnly}
        required={required}
        render={
          <Motion.button
            {...rest}
            className={cx(baseClassName, className)}
            initial={false}
            whileTap="tap"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onTap={() => setIsPressed(false)}
            onTapCancel={() => setIsPressed(false)}
            onTapStart={() => setIsPressed(true)}
          />
        }
        onCheckedChange={setIsChecked}
      >
        {children}
      </Switch.Root>
    </SwitchContext>
  );
};

SwitchRoot.displayName = 'SwitchRoot';

export const SwitchThumb = ({
  className,
  pressedAnimation,
  size = 'default',
  transition = { damping: 25, stiffness: 300, type: 'spring' },
  children,
  ...rest
}: SwitchThumbProps) => {
  const Motion = useMotionComponent();
  const { isPressed } = useSwitchContext();
  const baseClassName = thumbVariants({ size });

  const defaultPressedAnimation = {
    width: size === 'small' ? 16 : 22,
  };

  return (
    <Switch.Thumb
      render={
        <Motion.span
          layout
          animate={isPressed ? pressedAnimation || defaultPressedAnimation : undefined}
          className={cx(baseClassName, className)}
          transition={transition}
          {...rest}
        >
          {children}
        </Motion.span>
      }
    />
  );
};

SwitchThumb.displayName = 'SwitchThumb';

const getIconPositionClass = (position: SwitchIconPosition, size: 'default' | 'small') => {
  if (position === 'thumb') return styles.iconThumb;
  if (position === 'left') return size === 'small' ? styles.iconLeftSmall : styles.iconLeft;
  return size === 'small' ? styles.iconRightSmall : styles.iconRight;
};

export const SwitchIcon = ({
  children,
  className,
  position,
  transition = { bounce: 0, type: 'spring' },
  ...rest
}: SwitchIconProps & { children?: React.ReactNode; size?: 'default' | 'small' }) => {
  const Motion = useMotionComponent();
  const { isChecked } = useSwitchContext();
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

SwitchIcon.displayName = 'SwitchIcon';

export { styles as switchStyles } from './style';
