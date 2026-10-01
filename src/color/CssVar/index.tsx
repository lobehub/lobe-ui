'use client';

import { useThemeMode } from 'antd-style';
import { memo } from 'react';

import { ToastHost } from '@/base-ui/Toast';
import { Flexbox } from '@/Flex';

import { type ColorScaleItem } from '../types';
import ScaleRow from './ScaleRow';
import { styles } from './style';
import VarRow from './VarRow';

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
  const { isDarkMode } = useThemeMode();
  return (
    <Flexbox horizontal align={'center'} flex={1} justify={'center'}>
      <div style={{ padding: '8px 16px 32px 0' }}>
        <Flexbox gap={2}>
          <Flexbox horizontal align={'center'} gap={2} key="scale-title">
            <Flexbox horizontal align={'center'} className={styles.scaleRowTitle} key="scale-num" />
            {Array.from({ length: scale.light.length })
              .fill('')
              .map((_, index) => {
                if (index === 0 || index === 12) return false;

                const isMidHighlight = midHighLight === index;

                return (
                  <div className={styles.scaleBox} key={`num${index}`}>
                    <div className={styles.scaleBox}>
                      <Flexbox
                        horizontal
                        align={'center'}
                        className={styles.scaleItem}
                        justify={'center'}
                        style={{
                          fontWeight: isMidHighlight ? 700 : 400,
                          opacity: 0.5,
                        }}
                      >
                        {index}
                      </Flexbox>
                    </div>
                  </div>
                );
              })}
          </Flexbox>
          <VarRow name={name} />
          {isDarkMode ? (
            <>
              <ScaleRow key="dark" name={name} scale={scale.dark} title="dark" />
              <ScaleRow key="light" name={name} scale={scale.light} title="light" />
            </>
          ) : (
            <>
              {' '}
              <ScaleRow key="light" name={name} scale={scale.light} title="light" />
              <ScaleRow key="dark" name={name} scale={scale.dark} title="dark" />
            </>
          )}
        </Flexbox>
      </div>
      <ToastHost />
    </Flexbox>
  );
});

export default ColorScales;
