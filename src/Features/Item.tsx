import { Icon } from '@lobehub/ui';
import { ImageContainerType } from 'dumi-theme-lobehub/src';
import * as LucideIcon from 'lucide-react';
import { CSSProperties, memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import type { DivProps } from '@/types';

import { useStyles } from './Item.style';

export interface FeatureItem {
  column?: number;
  description?: string;
  hero?: boolean;
  icon?: string;
  image?: string;
  imageStyle?: CSSProperties;
  imageType?: ImageContainerType;
  link?: string;
  openExternal?: boolean;
  row?: number;
  title: string;
}

// @ts-ignore
export interface FeatureItemProps extends FeatureItem, DivProps {}

const Image = memo<{ className?: string; image: string; title: string }>(
  ({ image, className, title }) => {
    return image.startsWith('http') ? (
      <img alt={title} className={className} src={image} />
    ) : (
      <Center className={className}>{image}</Center>
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
    ...props
  }) => {
    const rowNumber = row || 7;
    const { styles, cx } = useStyles({ hasLink: Boolean(link), rowNum: rowNumber });

    // @ts-ignore
    const FeatureIcon = icon && LucideIcon[icon];

    return (
      <div
        className={cx(styles.container, className)}
        style={{
          gridColumn: `span ${column || 1}`,
          gridRow: `span ${rowNumber}`,
          ...style,
        }}
        {...props}
      >
        <div className={styles.cell}>
          {image ||
            (FeatureIcon && (
              <Center className={styles.imgContainer} style={imageStyle}>
                {FeatureIcon && <Icon className={styles.img} icon={FeatureIcon} />}
                {image && <Image className={styles.img} image={image} title={title} />}
              </Center>
            ))}

          {title && (
            <Flexbox align={'center'} as={'h3'} className={styles.title} gap={8} horizontal>
              {title}
            </Flexbox>
          )}
          {description && (
            <p className={styles.desc} dangerouslySetInnerHTML={{ __html: description }} />
          )}
          {link && (
            <div className={styles.link}>
              <a href={link} rel="noreferrer" target={openExternal ? '_blank' : undefined}>
                Read More
              </a>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default Item;
