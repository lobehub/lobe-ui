'use client';

import { cx, useThemeMode } from 'antd-style';
import { X } from 'lucide-react';
import { memo, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';
import Img from '@/Img';

import { styles, variants } from './style';
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
    const { isDarkMode } = useThemeMode();

    if (!show) return null;

    return (
      <Flexbox
        className={cx(variants({ isDarkMode, shadow, variant }), className)}
        ref={ref}
        {...rest}
      >
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
