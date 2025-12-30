'use client';

import { type CSSProperties, type ElementType, type FC } from 'react';

import { NativeFlexBasicElement } from './FlexBasic.web';
import type { FlexBasicProps } from './type';
import { getCssValue, getFlexDirection, isHorizontal, isSpaceDistribution } from './utils';

export const ReactFlexBasic: FC<FlexBasicProps> = ({
  visible,
  flex,
  gap,
  direction,
  horizontal,
  align,
  justify,
  distribution,
  height,
  width,
  padding,
  paddingInline,
  paddingBlock,
  prefixCls,
  as: Container = 'div' as ElementType,
  className,
  style,
  children,
  wrap,
  ref,
  ...props
}) => {
  const justifyContent = justify || distribution;

  const calcWidth = () => {
    if (isHorizontal(direction, horizontal) && !width && isSpaceDistribution(justifyContent))
      return '100%';

    return getCssValue(width);
  };
  const finalWidth = calcWidth();

  const cssVars: Record<string, string | number> = {
    ...(flex !== undefined ? { '--lobe-flex': String(flex) } : {}),
    ...(direction || horizontal
      ? { '--lobe-flex-direction': getFlexDirection(direction, horizontal) }
      : {}),
    ...(wrap !== undefined ? { '--lobe-flex-wrap': wrap } : {}),
    ...(justifyContent !== undefined ? { '--lobe-flex-justify': justifyContent } : {}),
    ...(align !== undefined ? { '--lobe-flex-align': align } : {}),
    ...(finalWidth !== undefined ? { '--lobe-flex-width': finalWidth } : {}),
    ...(height !== undefined ? { '--lobe-flex-height': getCssValue(height) } : {}),
    ...(padding !== undefined ? { '--lobe-flex-padding': getCssValue(padding) } : {}),
    ...(paddingInline !== undefined
      ? { '--lobe-flex-padding-inline': getCssValue(paddingInline) }
      : {}),
    ...(paddingBlock !== undefined
      ? { '--lobe-flex-padding-block': getCssValue(paddingBlock) }
      : {}),
    ...(gap !== undefined ? { '--lobe-flex-gap': getCssValue(gap) } : {}),
  };

  const mergedStyle: CSSProperties = { ...(cssVars as CSSProperties), ...style };

  const baseClassName = 'lobe-flex';
  const mergedClassName = [
    baseClassName,
    visible === false ? `${baseClassName}--hidden` : undefined,
    prefixCls ? `${prefixCls}-flex` : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Container ref={ref} {...props} className={mergedClassName} style={mergedStyle}>
      {children}
    </Container>
  );
};

const FlexBasic: FC<FlexBasicProps> = (props) => {
  const { as } = props;

  // `as` cannot be supported by the native custom element (tagName is fixed),
  // so we fallback to the React implementation when `as` is provided and isn't `lobe-flex`.
  if (!as || as === ('lobe-flex' as unknown as ElementType)) {
    // Avoid leaking `as` onto the custom element as an attribute.
    const rest = { ...props } as any;
    delete rest.as;
    return <NativeFlexBasicElement {...(rest as any)} />;
  }

  return <ReactFlexBasic {...props} />;
};

export default FlexBasic;
