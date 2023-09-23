import { Space } from 'antd';
import { memo } from 'react';

import { ColorScaleItem } from '@/styles/colors/colors';

import ScaleRow from './ScaleRow';
import { useStyles } from './style';

export interface ColorScalesProps {
  /**
   * @description Index of the mid highlight color in the scale
   */
  midHighLight: number;
  /**
   * @description Name of the color scale
   */
  name: string;
  /**
   * @description Color scale item object
   */
  scale: ColorScaleItem;
}

const ColorScales = memo<ColorScalesProps>(({ name, scale, midHighLight }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.view}>
      <div style={{ padding: '8px 16px 32px 0' }}>
        <Space direction={'vertical'} size={2}>
          <Space key="scale-title" size={2}>
            <div className={styles.scaleRowTitle} key="scale-num" />
            {Array.from({ length: scale.light.length })
              .fill('')
              .map((_, index) => {
                if (index === 0 || index === 12) return false;

                const isMidHighlight = midHighLight === index;

                return (
                  <div className={styles.scaleBox} key={`num${index}`}>
                    <div className={styles.scaleBox}>
                      <div
                        className={styles.scaleItem}
                        style={{
                          fontWeight: isMidHighlight ? 700 : 400,
                          opacity: 0.5,
                        }}
                      >
                        {index}
                      </div>
                    </div>
                  </div>
                );
              })}
          </Space>
          <ScaleRow key="light" name={name} scale={scale.light} title="light" />
          <ScaleRow key="lightA" name={name} scale={scale.lightA} title="lightA" />
          <ScaleRow key="dark" name={name} scale={scale.dark} title="dark" />
          <ScaleRow key="darkA" name={name} scale={scale.darkA} title="darkA" />
        </Space>
      </div>
    </div>
  );
});

export default ColorScales;
