'use client';

import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import Img from '@/Img';

import { useStyles } from './style';
import type { GuideCardProps } from './type';

const GuideCard = memo<GuideCardProps>(
  ({
    cover,
    onClose,
    shadow,
    closable = true,
    afterClose,
    alt,
    className,
    title,
    desc,
    width,
    styles: customStyles,
    height,
    coverProps,
    variant = 'filled',
    closeIconProps,
    classNames,
    ref,
    ...rest
  }) => {
    const [show, setShow] = useState(true);
    const { cx, styles } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shadow: false,
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            shadow: {
              false: null,
              true: styles.shadow,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    if (!show) return null;

    return (
      <Flexbox className={cx(variants({ shadow, variant }), className)} ref={ref} {...rest}>
        {closable && (
          <ActionIcon
            size={'small'}
            {...closeIconProps}
            className={cx(styles.close, closeIconProps?.className)}
            icon={X}
            onClick={(e) => {
              setShow(false);
              onClose?.(e);
              afterClose?.();
            }}
          />
        )}
        {cover && (
          <Img
            alt={alt}
            className={cx(styles.cover, classNames?.cover)}
            height={height}
            src={cover}
            style={customStyles?.cover}
            width={width}
            {...coverProps}
          />
        )}
        <Flexbox
          className={cx(styles.content, classNames?.content)}
          gap={8}
          style={customStyles?.content}
        >
          {title && <div className={styles.title}>{title}</div>}
          {desc && <div className={styles.desc}>{desc}</div>}
        </Flexbox>
      </Flexbox>
    );
  },
);

GuideCard.displayName = 'GuideCard';

export default GuideCard;
