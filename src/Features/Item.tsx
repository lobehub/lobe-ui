import { CSSProperties, memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import Icon, { IconProps } from '@/Icon';
import type { DivProps } from '@/types';

import { useStyles } from './style';

export interface FeatureItem {
  /**
   * @description The number of columns the item spans.
   */
  column?: number;
  /**
   * @description The description of the feature item.
   */
  description?: string;
  /**
   * @description Whether this item is a hero item.
   */
  hero?: boolean;
  /**
   * @description The name of the icon to display on the feature item.
   */
  icon?: IconProps['icon'];
  /**
   * @description The URL of the image to display on the feature item.
   */
  image?: string;
  /**
   * @description The CSS style of the image to display on the feature item.
   */
  imageStyle?: CSSProperties;
  /**
   * @description The type of the image to display on the feature item.
   * @default 'normal'
   */
  imageType?: 'light' | 'primary' | 'soon';
  /**
   * @description The link to navigate to when clicking on the feature item.
   */
  link?: string;
  /**
   * @description Whether to open the link in a new tab when clicking on the feature item.
   * @default false
   */
  openExternal?: boolean;
  /**
   * @description The number of rows the item spans.
   */
  row?: number;
  /**
   * @description The title of the feature item.
   */
  title: string;
}

export interface FeatureItemProps extends FeatureItem, Omit<DivProps, 'title'> {}

const Image = memo<{ className?: string; image: string; style?: CSSProperties; title: string }>(
  ({ image, className, title, style }) => {
    return image.startsWith('http') ? (
      <img alt={title} className={className} src={image} style={style} />
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
    ...props
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
        {...props}
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
