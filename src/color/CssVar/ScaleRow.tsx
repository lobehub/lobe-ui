import { message, Space } from 'antd';
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
  const style = {};
  const isAlpha = false;

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
            style={style}
            title={color}
            onClick={async () => {
              const content = `token.${name}${index}${isAlpha ? 'A' : ''} /* ${color} */`;

              await copyToClipboard(content);
              message.success(content);
            }}
          >
            <Flexbox
              horizontal
              align={'center'}
              className={styles.scaleItem}
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
