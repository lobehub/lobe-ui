'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import { ToastHost } from '@/Toast';
import { toDataAttributes } from '@/utils/bem';

import { type ColorScaleItem } from '../types';
import ScaleRow from './ScaleRow';
import { cssVarClasses } from './stable';
import { styles } from './style';
import VarRow from './VarRow';

export interface ColorScalesProps {
  className?: string;
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
  style?: CSSProperties;
}

const ColorScales = memo<ColorScalesProps>(({ className, name, scale, midHighLight, style }) => {
  const { isDarkMode } = useThemeMode();
  return (
    <Flexbox
      horizontal
      align={'center'}
      className={clsx(cssVarClasses(), className)}
      flex={1}
      justify={'center'}
      style={style}
    >
      <div {...styleProps(styles.content, cssVarClasses('content'))}>
        <Flexbox gap={2}>
          <Flexbox
            horizontal
            align={'center'}
            className={cssVarClasses('header')}
            gap={2}
            key="scale-title"
          >
            <Flexbox
              horizontal
              align={'center'}
              {...styleProps(styles.scaleRowTitle, cssVarClasses('row-title'))}
              key="scale-num"
            />
            {Array.from({ length: scale.light.length })
              .fill('')
              .map((_, index) => {
                if (index === 0 || index === 12) return false;

                const isMidHighlight = midHighLight === index;

                return (
                  <div {...styleProps(styles.scaleBox, cssVarClasses('cell'))} key={`num${index}`}>
                    <div {...stylex.props(styles.scaleBox)}>
                      <Flexbox
                        horizontal
                        align={'center'}
                        justify={'center'}
                        {...styleProps(
                          [styles.scaleItem, styles.index, isMidHighlight && styles.indexHighlight],
                          cssVarClasses('index'),
                        )}
                        {...toDataAttributes({ highlight: isMidHighlight })}
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
