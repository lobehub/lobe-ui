import { Space, message } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { copyToClipboard } from '@/utils/copyToClipboard';

import { alphaBg, useStyles } from './style';

export interface IScaleRow {
  name: string;
  scale: string[];
  title: 'light' | 'lightA' | 'dark' | 'darkA';
}

const ScaleRow = memo<IScaleRow>(({ name, title, scale }) => {
  const { styles } = useStyles();

  let style = {};
  let isAlpha = false;

  switch (title) {
    case 'lightA': {
      style = { background: alphaBg.light, backgroundColor: '#fff' };
      isAlpha = true;
      break;
    }
    case 'darkA': {
      style = { background: alphaBg.dark, backgroundColor: '#000' };
      isAlpha = true;
      break;
    }
    default: {
      break;
    }
  }

  return (
    <Space size={2}>
      <div className={styles.scaleRowTitle} key={title}>
        <div className={styles.text}>{title}</div>
      </div>
      {scale.map((color, index) => {
        if (index === 0 || index === 12) return false;

        return (
          <div
            className={styles.scaleBox}
            key={index}
            onClick={async () => {
              const content = `token.${name}${index}${isAlpha ? 'A' : ''} /* ${color} */`;

              await copyToClipboard(content);
              message.success(content);
            }}
            style={style}
            title={color}
          >
            <Flexbox
              align={'center'}
              className={styles.scaleItem}
              horizontal
              justify={'center'}
              style={{ backgroundColor: color }}
            />
          </div>
        );
      })}
    </Space>
  );
});

export default ScaleRow;
