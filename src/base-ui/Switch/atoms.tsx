'use client';

import { Switch } from '@base-ui/react/switch';
import { cx } from 'antd-style';
import { animate, motionValue } from 'motion';
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { createContext, use, useEffect, useMemo, useRef, useState } from 'react';
import useControlledState from 'use-merge-value';

import { rootVariants, styles, thumbVariants } from './style';
import type {
  SwitchChangeEventHandler,
  SwitchContextType,
  SwitchIconPosition,
  SwitchIconProps,
  SwitchRootProps,
  SwitchSize,
  SwitchThumbProps,
} from './type';

const THUMB_METRICS: Record<
  SwitchSize,
  { checkedX: number; pressedCheckedX: number; pressedWidth: number; width: number }
> = {
  default: { checkedX: 14, pressedCheckedX: 10, pressedWidth: 22, width: 18 },
  small: { checkedX: 12, pressedCheckedX: 8, pressedWidth: 16, width: 12 },
};

const THUMB_SPRING = { damping: 24, stiffness: 360, type: 'spring' as const };

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
  onKeyDown,
  onKeyUp,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
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

  const isInteractive = !disabled && !readOnly;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      lastEventRef.current = event;
    }
    if (event.key === ' ' && isInteractive) {
      setIsPressed(true);
    }
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ') {
      setIsPressed(false);
    }
    onKeyUp?.(event);
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (isInteractive) {
      setIsPressed(true);
    }
    onPointerDown?.(event);
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onPointerUp?.(event);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onPointerCancel?.(event);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onPointerLeave?.(event);
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
          <button
            {...rest}
            className={cx(baseClassName, className)}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onPointerCancel={handlePointerCancel}
            onPointerDown={handlePointerDown}
            onPointerLeave={handlePointerLeave}
            onPointerUp={handlePointerUp}
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
  size = 'default',
  style,
  children,
  ...rest
}: SwitchThumbProps) => {
  const { isChecked, isPressed } = useSwitchContext();
  const ref = useRef<HTMLSpanElement>(null);
  const baseClassName = thumbVariants({ size });

  const metrics = THUMB_METRICS[size];
  const targetX = isChecked ? (isPressed ? metrics.pressedCheckedX : metrics.checkedX) : 0;
  const targetWidth = isPressed ? metrics.pressedWidth : metrics.width;

  const [values] = useState(() => ({
    width: motionValue(targetWidth),
    x: motionValue(targetX),
  }));

  // animated keys stay referentially stable so React never rewrites mid-flight inline values
  const [initialStyle] = useState<CSSProperties>(
    () => ({ '--switch-x': `${targetX}px`, 'width': targetWidth }) as CSSProperties,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const unsubscribeX = values.x.on('change', (x) => {
      el.style.setProperty('--switch-x', `${x}px`);
    });
    const unsubscribeWidth = values.width.on('change', (width) => {
      el.style.setProperty('width', `${width}px`);
    });
    return () => {
      unsubscribeX();
      unsubscribeWidth();
    };
  }, [values]);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const transition = reduceMotion ? { duration: 0 } : THUMB_SPRING;
    const animations = [
      animate(values.x, targetX, transition),
      animate(values.width, targetWidth, transition),
    ];
    return () => {
      for (const animation of animations) animation.stop();
    };
  }, [values, targetX, targetWidth]);

  return (
    <Switch.Thumb
      render={
        <span
          {...rest}
          className={cx(baseClassName, className)}
          ref={ref}
          style={{ ...initialStyle, ...style }}
        >
          {children}
        </span>
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
  ...rest
}: SwitchIconProps) => {
  const positionClass = getIconPositionClass(position, size);

  return (
    <span className={cx(styles.icon, positionClass, className)} {...rest}>
      {children}
    </span>
  );
};

SwitchIcon.displayName = 'SwitchIcon';

export { styles as switchStyles } from './style';
