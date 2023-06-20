import { Icon } from '@lobehub/ui';
import * as LucideIcon from 'lucide-react';
import { CSSProperties, memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import type { DivProps } from '@/types';

import { useStyles } from './Item.style';

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
  icon?: string;
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
