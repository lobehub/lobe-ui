'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { type CSSProperties, memo, useMemo } from 'react';

import A from '@/A';
import { Center, Flexbox } from '@/Flex';
import Icon from '@/Icon';
import Img from '@/Img';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';

import { childStyles, styles } from './style';
import type { FeatureItemProps } from './type';

const Image = memo<{ className?: string; image: string; style?: CSSProperties; title: string }>(
  ({ image, className, title, style }) => {
    return image.startsWith('http') ? (
      <Img alt={title} className={className} src={image} style={style} />
    ) : (
      <Center className={className} style={style}>
        {image}
      </Center>
    );
  },
);

const Item = memo<FeatureItemProps>(
  ({
    style,
    className,
    row,
    column,
    description,
    image,
    title,
    link,
    icon,
    imageStyle,
    openExternal,
    ...rest
  }) => {
    const rowNumber = row || 7;
    const hasLink = Boolean(link);

    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        '--features-row-num': String(rowNumber),
        '--features-title-hover-size': hasLink ? '14px' : '20px',
      }),
      [rowNumber, hasLink],
    );

    return (
      <div
        {...styleProps(styles.container, clsx('lobe-features-item', className), {
          ...cssVariables,
          gridColumn: `span ${column || 1}`,
          gridRow: `span ${rowNumber}`,
          ...style,
        })}
        {...rest}
      >
        <div {...stylex.props(styles.cell)}>
          {image ||
            (icon && (
              <Center {...styleProps(styles.imgContainer, undefined, imageStyle)}>
                {icon && <Icon icon={icon} style={childStyles.img} />}
                {image && <Image image={image} style={childStyles.img} title={title} />}
              </Center>
            ))}
          {title && (
            <Flexbox
              horizontal
              align={'center'}
              as={'h3'}
              className={stylex.props(styles.title).className}
              gap={8}
            >
              {title}
            </Flexbox>
          )}
          {description && (
            <Text
              style={childStyles.desc}
              ellipsis={{
                rows: 4,
              }}
            >
              {description}
            </Text>
          )}
          {link && (
            <div {...stylex.props(styles.link)}>
              <A href={link} rel="noreferrer" target={openExternal ? '_blank' : undefined}>
                Read More
              </A>
            </div>
          )}
        </div>
      </div>
    );
  },
);

Item.displayName = 'FeatureItem';

export default Item;
