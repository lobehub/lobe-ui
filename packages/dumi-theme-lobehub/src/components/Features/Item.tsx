import { ArrowRightOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { history, Link } from 'dumi';
import { memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { IFeature } from '@/types';

import { useStyles } from './Item.style';

const Image = memo<{ className?: string; image: string; title: string }>(
  ({ image, className, title }) => {
    return image.startsWith('http') ? (
      <img alt={title} className={className} src={image} />
    ) : (
      <Center className={className}>{image}</Center>
    );
  },
);

const FeatureItem = memo<IFeature>(
  ({ imageType, row, column, hero, description, image, title, link, imageStyle, openExternal }) => {
    const rowNum = row || 7;
    const { styles, theme } = useStyles({ rowNum, hasLink: Boolean(link) });

    return (
      <div
        className={styles.container}
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
        }}
      >
        <div className={styles.cell}>
          {image && (
            <Center className={styles.imgContainer} image-style={imageType} style={imageStyle}>
              <Image className={styles.img} image={image} title={title} />
            </Center>
          )}
          {title && (
            <Flexbox align={'center'} as={'h3'} className={styles.title} gap={8} horizontal>
              {title}
              {imageType === 'soon' ? (
                <Tag
                  color={theme.isDarkMode ? 'pink-inverse' : 'cyan-inverse'}
                  // style={{ border: 'none' }}
                >
                  SOON
                </Tag>
              ) : null}
            </Flexbox>
          )}
          {description && (
            <p className={styles.desc} dangerouslySetInnerHTML={{ __html: description }} />
          )}
          {link && (
            <div className={styles.link}>
              <Link to={link}>
                立即了解 <ArrowRightOutlined />
              </Link>
            </div>
          )}
        </div>
        {hero && <div className={styles.blur} />}
      </div>
    );
  },
);

export default FeatureItem;
