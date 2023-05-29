import { ColorScaleItem } from '@/styles/colors';
import { Space } from 'antd';
import { memo } from 'react';
import ScaleRow from './ScaleRow';
import { useStyles } from './style';

export interface ColorScalesProps {
  name: string;
  scale: ColorScaleItem;
  midHighLight: number;
}

const ColorScales = memo<ColorScalesProps>(({ name, scale, midHighLight }) => {
  const { styles } = useStyles();
  return (
    <div className={styles.view}>
      <div style={{ padding: '8px 16px 32px 0' }}>
        <Space direction={'vertical'} size={2}>
          <Space key="scale-title" size={2}>
            <div className={styles.scaleRowTitle} key="scale-num" />
            {new Array(scale.light.length).fill('').map((_, index) => {
              const isMidHighlight = midHighLight === index;
              return (
                <div className={styles.scaleBox} key={'num' + index}>
                  <div className={styles.scaleBox}>
                    <div
                      className={styles.scaleItem}
                      style={{
                        opacity: 0.5,
                        fontWeight: isMidHighlight ? 700 : 400,
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </Space>
          <ScaleRow name={name} key="light" title="light" scale={scale.light} />
          <ScaleRow name={name} key="lightA" title="lightA" scale={scale.lightA} />
          <ScaleRow name={name} key="dark" title="dark" scale={scale.dark} />
          <ScaleRow name={name} key="darkA" title="darkA" scale={scale.darkA} />
        </Space>
      </div>
    </div>
  );
});

export default ColorScales;
