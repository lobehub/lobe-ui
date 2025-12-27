import { Space, message } from 'antd';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { copyToClipboard } from '@/utils/copyToClipboard';

import { styles } from './style';

export interface IScaleRow {
  name: string;
  scale: string[];
  title: 'light' | 'dark';
}

const ScaleRow = memo<IScaleRow>(({ name, title, scale }) => {
  let style = {};
  let isAlpha = false;

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
