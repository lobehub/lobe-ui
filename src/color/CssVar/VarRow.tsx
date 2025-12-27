import { Space, message } from 'antd';
import { cssVar } from 'antd-style';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { copyToClipboard } from '@/utils/copyToClipboard';

import { styles } from './style';

export interface IScaleRow {
  name: string;
}

const ScaleRow = memo<IScaleRow>(({ name }) => {
  return (
    <Space size={2}>
      <div className={styles.scaleRowTitle} key={name}>
        <div className={styles.text}>cssVar</div>
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((color) => {
        return (
          <div
            className={styles.scaleBox}
            key={color}
            onClick={async () => {
              const content = (cssVar as any)[`${name}${color}`] as any;

              await copyToClipboard(content);
              message.success(content);
            }}
            title={(cssVar as any)[`${name}${color}`] as any}
          >
            <Flexbox
              align={'center'}
              className={styles.scaleItem}
              horizontal
              justify={'center'}
              style={{ backgroundColor: (cssVar as any)[`${name}${color}`] as any }}
            />
          </div>
        );
      })}
    </Space>
  );
});

export default ScaleRow;
