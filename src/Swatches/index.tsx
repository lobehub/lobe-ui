import { useTheme } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStyles } from './style';

export interface SwatchesProps {
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

const Swatches = memo<SwatchesProps>(({ colors, activeColor, onSelect, size = 24 }) => {
  const theme = useTheme();
  const { cx, styles } = useStyles(size);

  return (
    <Flexbox gap={8} horizontal style={{ flexWrap: 'wrap' }}>
      <Flexbox
        className={cx(styles.container, !activeColor && styles.active)}
        onClick={() => {
          onSelect?.();
        }}
        style={{
          background: theme.colorBgContainer,
        }}
      />
      {colors.map((c) => {
        const isActive = c === activeColor;

        return (
          <Flexbox
            className={cx(styles.container, isActive && styles.active)}
            key={c}
            onClick={() => {
              onSelect?.(c);
            }}
            style={{
              background: c,
            }}
          />
        );
      })}
    </Flexbox>
  );
});

export default Swatches;
