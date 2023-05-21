import { ArrowRightOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { history, Link } from 'dumi';
import { type FC } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { IFeature } from '../../types';
import { useStyles } from './Item.style';

const Image: FC<{ image: string; className?: string; title: string }> = ({
  image,
  className,
  title,
}) => {
  return image.startsWith('http') ? (
    <img className={className} src={image} alt={title} />
  ) : (
    <Center className={className}>{image}</Center>
  );
};

const FeatureItem: FC<IFeature> = ({
  imageType,
  row,
  column,
  hero,
  description,
  image,
  title,
  link,
  imageStyle,
  openExternal,
}) => {
  const rowNum = row || 7;
  const { styles, theme } = useStyles({ rowNum, hasLink: !!link });

  return (
    <div
      className={styles.container}
      style={{
        gridRow: `span ${rowNum}`,
        gridColumn: `span ${column || 1}`,
        cursor: link ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (!link) return;

        if (openExternal) {
          window.open(link);
        } else {
          history.push(link);
        }
      }}
    >
      <div className={styles.cell}>
        {image && (
          <Center image-style={imageType} className={styles.imgContainer} style={imageStyle}>
            <Image className={styles.img} image={image} title={title} />
          </Center>
        )}
        {title && (
          <Flexbox as={'h3'} horizontal gap={8} align={'center'} className={styles.title}>
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
          <p dangerouslySetInnerHTML={{ __html: description }} className={styles.desc} />
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
};

export default FeatureItem;
