'use client';

import { CheckIcon } from 'lucide-react';
import { darken } from 'polished';
import { memo } from 'react';
import { Center, Flexbox, FlexboxProps } from 'react-layout-kit';

import Icon from '@/Icon';

import { useStyles } from './style';

export interface SwatchesProps extends Omit<FlexboxProps, 'onSelect'> {
  /**
   * @description The currently active color
   * @default undefined
   */
  activeColor?: string;
  /**
   * @description An array of colors to be displayed as swatches
   */
  colors: string[];
  /**
   * @description A function to be called when a swatch is selected
   * @default undefined
   */
  onSelect?: (c?: string | undefined) => void;
  /**
   * @description The size of swatch
   * @default 24
   */
  size?: number;
}

const Swatches = memo<SwatchesProps>(
  ({ style, colors, activeColor, onSelect, size = 24, ...rest }) => {
    const { cx, styles } = useStyles(size);

    return (
      <Flexbox gap={8} horizontal style={{ flexWrap: 'wrap', ...style }} {...rest}>
        {colors.map((c, index) => {
          const isActive = c === activeColor;
          return (
            <Center
              className={cx(styles.container, isActive && styles.active)}
              key={`${c}_${index}`}
              onClick={() => {
                onSelect?.(c);
              }}
              style={{
                background: c,
              }}
            >
              {isActive && (
                <Icon
                  color={darken(0.3, c)}
                  icon={CheckIcon}
                  size={{ fontSize: 14, strokeWidth: 4 }}
                />
              )}
            </Center>
          );
        })}
      </Flexbox>
    );
  },
);

export default Swatches;
