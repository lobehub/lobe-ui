'use client';

import { cx } from 'antd-style';
import { isValidElement, type MouseEvent, type ReactNode, type Ref } from 'react';

import Icon, { type IconProps } from '@/Icon';
import { useMotionComponent } from '@/MotionProvider';

import { styles } from './style';
import type { ButtonProps } from './type';

const resolveIconNode = (node: ReactNode | IconProps['icon'] | undefined | null) => {
  if (node === undefined || node === null) return null;
  if (isValidElement(node) || typeof node === 'string' || typeof node === 'number') {
    return node;
  }
  return <Icon icon={node as any} size={'small'} />;
};

const resolveSizeCls = (size: ButtonProps['size']) => {
  if (size === 'small') return styles.sizeSmall;
  if (size === 'large') return styles.sizeLarge;
  return styles.sizeMiddle;
};

const resolveIconOnlySizeCls = (size: ButtonProps['size']) => {
  if (size === 'small') return styles.iconOnlySmall;
  if (size === 'large') return styles.iconOnlyLarge;
  return styles.iconOnlyMiddle;
};

const resolveVariantCls = ({
  danger,
  ghost,
  type,
}: {
  danger: boolean;
  ghost: boolean;
  type: NonNullable<ButtonProps['type']>;
}): string => {
  if (ghost) {
    if (danger) return styles.ghostDanger;
    if (type === 'primary') return styles.ghostPrimary;
    if (type === 'dashed') return cx(styles.ghostDefault, styles.ghostDashed);
    return styles.ghostDefault;
  }

  switch (type) {
    case 'primary': {
      return danger ? styles.dangerSolid : styles.variantPrimary;
    }
    case 'dashed': {
      return danger ? cx(styles.variantDashed, styles.dangerOutlined) : styles.variantDashed;
    }
    case 'fill': {
      return danger ? styles.dangerFill : styles.variantFill;
    }
    case 'text': {
      return danger ? cx(styles.variantText, styles.dangerInline) : styles.variantText;
    }
    case 'link': {
      return danger ? cx(styles.variantLink, styles.dangerInline) : styles.variantLink;
    }
    default: {
      return danger ? cx(styles.variantDefault, styles.dangerOutlined) : styles.variantDefault;
    }
  }
};

const tapAnim = { scale: 0.98 };
const motionTransition = {
  damping: 26,
  mass: 0.6,
  stiffness: 600,
  type: 'spring' as const,
};

const Button = ({
  block,
  children,
  className,
  classNames,
  danger = false,
  disabled,
  ghost = false,
  href,
  htmlType = 'button',
  icon,
  iconPosition = 'start',
  loading,
  onClick,
  ref,
  shape = 'default',
  size = 'middle',
  styles: userStyles,
  target,
  type = 'default',
  ...rest
}: ButtonProps) => {
  const Motion = useMotionComponent();
  const isInteractionDisabled = disabled || loading;
  const sizeCls = resolveSizeCls(size);
  const variantCls = resolveVariantCls({ danger, ghost, type });
  const shapeCls =
    shape === 'circle' ? styles.shapeCircle : shape === 'round' ? styles.shapeRound : undefined;

  const hasChildren =
    children !== undefined && children !== null && children !== false && children !== '';
  const renderIcon = loading || icon;
  const iconOnly = !hasChildren && !!renderIcon;
  const iconOnlySizeCls = iconOnly ? resolveIconOnlySizeCls(size) : undefined;

  const composedClassName = cx(
    styles.base,
    sizeCls,
    variantCls,
    shapeCls,
    block && styles.block,
    iconPosition === 'end' && styles.iconEnd,
    iconOnlySizeCls,
    className,
  );

  const spinnerNode = (
    <span
      aria-hidden={!loading}
      style={userStyles?.icon}
      className={cx(
        styles.iconBox,
        styles.spinnerSlot,
        loading && styles.spinnerSlotShow,
        iconPosition === 'end' && styles.spinnerSlotEnd,
        classNames?.icon,
      )}
    >
      <span className={styles.spinner} />
    </span>
  );

  const iconNode =
    icon && !loading ? (
      <span className={cx(styles.iconBox, classNames?.icon)} style={userStyles?.icon}>
        {resolveIconNode(icon)}
      </span>
    ) : null;

  const inner = (
    <>
      {spinnerNode}
      {iconNode}
      {children}
    </>
  );

  const motionGestures = isInteractionDisabled
    ? {}
    : { transition: motionTransition, whileTap: tapAnim };

  if (href !== undefined) {
    const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (isInteractionDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
    };

    return (
      <Motion.a
        aria-busy={loading || undefined}
        aria-disabled={isInteractionDisabled || undefined}
        href={disabled ? undefined : href}
        target={target}
        {...(rest as any)}
        className={composedClassName}
        ref={ref as Ref<HTMLAnchorElement>}
        onClick={handleAnchorClick}
        {...motionGestures}
      >
        {inner}
      </Motion.a>
    );
  }

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isInteractionDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <Motion.button
      type={htmlType}
      {...(rest as any)}
      aria-busy={loading || undefined}
      aria-disabled={isInteractionDisabled || undefined}
      className={composedClassName}
      disabled={disabled}
      ref={ref as Ref<HTMLButtonElement>}
      onClick={handleButtonClick}
      {...motionGestures}
    >
      {inner}
    </Motion.button>
  );
};

Button.displayName = 'BaseButton';

export default Button;
