'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';
import { memo, useState } from 'react';

import { ActionIconImpl as ActionIcon } from '@/ActionIcon/ActionIcon';
import { Flexbox } from '@/Flex';
import Img from '@/Img';
import { styleProps } from '@/styles/stylex/props';
import { stylish } from '@/styles/stylex/stylish';
import { useThemeMode } from '@/styles/theme/scope';
import { toDataAttributes } from '@/utils/bem';

import { guideCardClasses } from './stable';
import { styles } from './style';
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
        ref={ref}
        {...toDataAttributes({ shadow, variant })}
        className={
          styleProps(
            [
              styles.root,
              variant === 'borderless' && stylish.variantBorderlessWithoutHover,
              variant === 'outlined' && stylish.variantOutlinedWithoutHover,
              shadow && styles.shadow,
              variant === 'filled' && (isDarkMode ? styles.filledDark : styles.filledLight),
            ],
            clsx(guideCardClasses(), className),
          ).className
        }
        {...rest}
      >
        {closable && (
          <ActionIcon
            size={'small'}
            {...closeIconProps}
            className={clsx(guideCardClasses('close'), closeIconProps?.className)}
            icon={X}
            xstyle={styles.close}
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
            height={height}
            src={cover}
            width={width}
            {...styleProps(
              styles.cover,
              clsx(guideCardClasses('cover'), classNames?.cover),
              customStyles?.cover,
            )}
            {...coverProps}
          />
        )}
        <Flexbox
          gap={8}
          {...styleProps(
            styles.content,
            clsx(guideCardClasses('content'), classNames?.content),
            customStyles?.content,
          )}
        >
          {title && <div {...styleProps(styles.title, guideCardClasses('title'))}>{title}</div>}
          {desc && <div {...styleProps(styles.desc, guideCardClasses('desc'))}>{desc}</div>}
        </Flexbox>
      </Flexbox>
    );
  },
);

GuideCard.displayName = 'GuideCard';

export default GuideCard;
