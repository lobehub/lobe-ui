'use client';

import { cx } from 'antd-style';
import { type FC, useRef } from 'react';

import { useTextOverflow } from '@/hooks/useTextOverflow';
import Tooltip from '@/Tooltip';

import { variants } from './styles';
import { type TextProps } from './type';

const Text: FC<TextProps> = ({
  as: Container = 'div',
  align,
  className,
  children,
  style,
  type,
  disabled,
  strong,
  italic,
  underline,
  delete: deleteStyle,
  fontSize,
  lineClamp,
  lineHeight,
  mark,
  code,
  color,
  weight,
  ellipsis,
  noWrap,
  textDecoration,
  textTransform,
  whiteSpace,
  wordBreak,
  ...rest
}) => {
  const textRef = useRef<HTMLElement>(null);
  const isOverflow = useTextOverflow(textRef, ellipsis, children);

  const isMultiEllipsis = typeof ellipsis === 'object' && !!ellipsis.rows && ellipsis.rows > 1;
  const tooltipWhenOverflow = typeof ellipsis === 'object' && ellipsis.tooltipWhenOverflow;

  const textStyle = {
    ...(color && { color }),
    ...(weight && { fontWeight: weight }),
    ...(lineHeight && { lineHeight }),
    ...(textTransform && { textTransform }),
    ...(textDecoration && { textDecoration }),
    ...(wordBreak && { wordBreak }),
    ...(typeof ellipsis === 'object' &&
      ellipsis.rows && {
        WebkitLineClamp: ellipsis.rows,
      }),
    ...(!ellipsis &&
      !!lineClamp && {
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lineClamp,
        display: '-webkit-box',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }),
    ...(fontSize && { fontSize }),
    ...(align && { textAlign: align }),
    ...(!isMultiEllipsis && noWrap && { whiteSpace: 'nowrap' as const }),
    ...(whiteSpace && { whiteSpace }),
    ...style,
  };

  const content = (
    <Container
      ref={textRef}
      style={textStyle}
      className={cx(
        variants({
          as: ['h1', 'h2', 'h3', 'h4', 'h5', 'p'].includes(Container as string)
            ? (Container as any)
            : undefined,
          code,
          delete: deleteStyle,
          disabled,
          ellipsis: ellipsis
            ? typeof ellipsis === 'object' && ellipsis.rows
              ? 'multi'
              : true
            : undefined,
          italic,
          mark,
          strong,
          type,
          underline,
        }),
        className,
      )}
      {...rest}
    >
      {children}
    </Container>
  );

  // 处理带有 tooltip 的省略
  if (
    ellipsis &&
    typeof ellipsis === 'object' &&
    (ellipsis.tooltip || ellipsis.tooltipWhenOverflow)
  ) {
    // 如果设置了 tooltipWhenOverflow，只在溢出时显示 tooltip
    if (tooltipWhenOverflow && !isOverflow) {
      return content;
    }

    const title = typeof ellipsis.tooltip === 'string' ? ellipsis.tooltip : children;
    if (ellipsis.tooltip && typeof ellipsis.tooltip === 'object')
      return (
        <Tooltip {...ellipsis.tooltip} title={ellipsis.tooltip?.title || title}>
          {content}
        </Tooltip>
      );
    return <Tooltip title={title}>{content}</Tooltip>;
  }

  return content;
};

Text.displayName = 'Text';

export default Text;
