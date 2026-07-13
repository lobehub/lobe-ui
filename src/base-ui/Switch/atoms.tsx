'use client';

import { Switch } from '@base-ui/react/switch';
import { cx } from 'antd-style';
import { useReducedMotion } from 'motion/react';
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
        nativeButton
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
  transition = { damping: 24, stiffness: 360, type: 'spring' },
  children,
  ...rest
}: SwitchThumbProps) => {
  const Motion = useMotionComponent();
  const { isPressed } = useSwitchContext();
  const shouldReduceMotion = useReducedMotion();
  const baseClassName = thumbVariants({ size });

  const defaultPressedAnimation = {
    width: size === 'small' ? 16 : 22,
  };

  const effectiveAnimate =
    !shouldReduceMotion && isPressed ? pressedAnimation || defaultPressedAnimation : undefined;
  const effectiveTransition = shouldReduceMotion ? { duration: 0 } : transition;

  return (
    <Switch.Thumb
      render={
        <Motion.span
          layout
          animate={effectiveAnimate}
          className={cx(baseClassName, className)}
          transition={effectiveTransition}
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
  size = 'default',
  transition = { bounce: 0, type: 'spring' },
  ...rest
}: SwitchIconProps) => {
  const Motion = useMotionComponent();
  const { isChecked } = useSwitchContext();
  const shouldReduceMotion = useReducedMotion();

  const isAnimated = useMemo(() => {
    if (position === 'right') return !isChecked;
    if (position === 'left') return isChecked;
    if (position === 'thumb') return true;
    return false;
  }, [position, isChecked]);

  const positionClass = getIconPositionClass(position, size);
  const effectiveTransition = shouldReduceMotion ? { duration: 0 } : transition;

  return (
    <Motion.span
      animate={isAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      className={cx(styles.icon, positionClass, className)}
      transition={effectiveTransition}
      {...rest}
    >
      {children}
    </Motion.span>
  );
};

SwitchIcon.displayName = 'SwitchIcon';

export { styles as switchStyles } from './style';
