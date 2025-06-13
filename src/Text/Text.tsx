'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import Tooltip from '@/Tooltip';

import { useStyles } from './styles';
import type { TextProps } from './type';

const Text = memo<TextProps>(
  ({
    as: Container = 'div',
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
    const { styles, cx } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.text, {
          defaultVariants: {},
          variants: {
            as: {
              h1: styles.h1,
              h2: styles.h2,
              h3: styles.h3,
              h4: styles.h4,
              h5: styles.h5,
              p: styles.p,
            },
            code: {
              true: styles.code,
            },
            delete: {
              true: styles.delete,
            },
            disabled: {
              true: styles.disabled,
            },
            ellipsis: {
              multi: styles.ellipsisMulti,
              true: styles.ellipsis,
            },
            italic: {
              true: styles.italic,
            },
            mark: {
              true: styles.mark,
            },
            strong: {
              true: styles.strong,
            },
            type: {
              danger: styles.danger,
              info: styles.info,
              secondary: styles.secondary,
              success: styles.success,
              warning: styles.warning,
            },
            underline: {
              true: styles.underline,
            },
          },
        }),
      [styles],
    );

    const textStyle = {
      ...(color && { color }),
      ...(weight && { fontWeight: weight }),
      ...(typeof ellipsis === 'object' &&
        ellipsis.rows && {
          WebkitLineClamp: ellipsis.rows,
        }),
      ...(fontSize && { fontSize }),
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
  },
);

Text.displayName = 'Text';

export default Text;
