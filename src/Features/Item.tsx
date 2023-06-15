import { Icon } from '@lobehub/ui';
import { Link, history } from 'dumi';
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
    const rowNum = row || 7;
    const { styles, cx } = useStyles({ rowNum, hasLink: Boolean(link) });

    // @ts-ignore
    const FeatureIcon = icon && LucideIcon[icon];

    return (
      <div
        className={cx(styles.container, className)}
        onClick={() => {
          if (!link) return;

          if (openExternal) {
            window.open(link);
          } else {
            history.push(link);
          }
        }}
        style={{
          gridRow: `span ${rowNum}`,
          gridColumn: `span ${column || 1}`,
          cursor: link ? 'pointer' : 'default',
          ...style,
        }}
        {...props}
      >
        <div className={styles.cell}>
          {image && (
            <Center className={styles.imgContainer} style={imageStyle}>
              <Image className={styles.img} image={image} title={title} />
            </Center>
          )}
          {FeatureIcon && (
            <Center className={styles.imgContainer} style={imageStyle}>
              <Icon className={styles.img} icon={FeatureIcon} />
            </Center>
          )}
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
              <Link to={link}>Read More</Link>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default Item;
