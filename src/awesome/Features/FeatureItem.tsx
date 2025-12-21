'use client';

import { CSSProperties, memo } from 'react';

import A from '@/A';
import { Center, Flexbox } from '@/Flex';
import Icon from '@/Icon';
import Img from '@/Img';
import Text from '@/Text';

import { useStyles } from './style';
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
    const { styles, cx } = useStyles({ hasLink: Boolean(link), rowNum: rowNumber });

    return (
      <div
        className={cx(styles.container, className)}
        style={{
          gridColumn: `span ${column || 1}`,
          gridRow: `span ${rowNumber}`,
          ...style,
        }}
        {...rest}
      >
        <div className={styles.cell}>
          {image ||
            (icon && (
              <Center className={styles.imgContainer} style={imageStyle}>
                {icon && <Icon className={styles.img} icon={icon} />}
                {image && <Image className={styles.img} image={image} title={title} />}
              </Center>
            ))}
          {title && (
            <Flexbox align={'center'} as={'h3'} className={styles.title} gap={8} horizontal>
              {title}
            </Flexbox>
          )}
          {description && (
            <Text
              className={styles.desc}
              ellipsis={{
                rows: 4,
              }}
            >
              {description}
            </Text>
          )}
          {link && (
            <div className={styles.link}>
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
