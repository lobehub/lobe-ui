import { Space, message } from 'antd';
import copy from 'copy-to-clipboard';
import { memo } from 'react';
import { alphaBg, useStyles } from './style';

export interface IScaleRow {
  title: 'light' | 'lightA' | 'dark' | 'darkA';
  scale: string[];
}

const ScaleRow = memo<IScaleRow>(({ title, scale }) => {
  const { styles } = useStyles();

  let style = {};

  switch (title) {
    case 'lightA':
      style = { backgroundColor: '#fff', background: alphaBg.light };
      break;
    case 'darkA':
      style = { backgroundColor: '#000', background: alphaBg.dark };
      break;
    default:
      break;
  }

  return (
    <Space size={2}>
      <div className={styles.scaleRowTitle} key={title}>
        <div className={styles.text}>{title}</div>
      </div>
      {scale.map((color, index) => {
        return (
          <div
            className={styles.scaleBox}
            key={index}
            title={color}
            style={style}
            onClick={() => {
              copy(color);
              message.success(color);
            }}
          >
            <div className={styles.scaleItem} style={{ backgroundColor: color }} />
          </div>
        );
      })}
    </Space>
  );
});

export default ScaleRow;
