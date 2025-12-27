'use client';

import { cx } from 'antd-style';
import { type FC } from 'react';

import Tooltip from '@/Tooltip';

import { variants } from './styles';
import type { TextProps } from './type';

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
  mark,
  code,
  color,
  weight,
  ellipsis,
  ...rest
}) => {
  const textStyle = {
    ...(color && { color }),
    ...(weight && { fontWeight: weight }),
    ...(typeof ellipsis === 'object' &&
      ellipsis.rows && {
        WebkitLineClamp: ellipsis.rows,
      }),
    ...(fontSize && { fontSize }),
    ...(align && { textAlign: align }),
    ...style,
  };

  const content = (
    <Container
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
      style={textStyle}
      {...rest}
    >
      {children}
    </Container>
  );

  // 处理带有 tooltip 的省略
  if (ellipsis && typeof ellipsis === 'object' && ellipsis.tooltip) {
    const title = typeof ellipsis.tooltip === 'string' ? ellipsis.tooltip : children;
    if (typeof ellipsis.tooltip === 'object')
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
