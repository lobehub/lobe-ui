'use client';

import { cx } from 'antd-style';
import { type CSSProperties, memo, type RefObject, useRef } from 'react';

import Tooltip from '@/base-ui/Tooltip';
import { useTextOverflow } from '@/hooks/useTextOverflow';

import { variants } from './style';
import { type TextProps } from './type';

const Text = memo<TextProps>(
  ({
    align,
    as: Container = 'div',
    children,
    className,
    classNames,
    code,
    color,
    delete: deleteStyle,
    disabled,
    ellipsis,
    fontSize,
    italic,
    lineClamp,
    lineHeight,
    mark,
    noWrap,
    ref,
    strong,
    style,
    styles: customStyles,
    textDecoration,
    textTransform,
    type,
    underline,
    weight,
    whiteSpace,
    wordBreak,
    ...rest
  }) => {
    const innerRef = useRef<HTMLElement>(null);
    const isOverflow = useTextOverflow(innerRef, ellipsis, children);

    const isMultiEllipsis = typeof ellipsis === 'object' && !!ellipsis.rows && ellipsis.rows > 1;
    const tooltipWhenOverflow = typeof ellipsis === 'object' && ellipsis.tooltipWhenOverflow;

    const setNodeRef = (node: HTMLElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node as HTMLDivElement);
      else if (ref) (ref as RefObject<HTMLDivElement | null>).current = node as HTMLDivElement;
    };

    const textStyle: CSSProperties = {
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
      ...customStyles?.root,
    };

    const content = (
      <Container
        {...rest}
        ref={setNodeRef}
        style={textStyle}
        className={cx(
          variants({
            as: ['h1', 'h2', 'h3', 'h4', 'h5', 'p'].includes(Container as string)
              ? (Container as 'h1')
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
          classNames?.root,
        )}
      >
        {children}
      </Container>
    );

    if (
      ellipsis &&
      typeof ellipsis === 'object' &&
      (ellipsis.tooltip || ellipsis.tooltipWhenOverflow)
    ) {
      if (tooltipWhenOverflow && !isOverflow) return content;

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
  },
);

Text.displayName = 'Text';

export default Text;
