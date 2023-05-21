import { createStyles } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

import chroma from 'chroma-js';
import { useStore } from 'dumi-theme-lobehub/builtins/ColorPalettes/store';
import { FC, useMemo } from 'react';
import { invertColor } from './invertColor';

const useStyles = createStyles(({ css }) => ({
  title: css`
    height: 32px;
  `,
  palette: css`
    border-radius: 6px;
    overflow: hidden;
  `,
  color: css`
    height: 40px;
    font-family: Monaco, Consolas, 'Courier New', monospace;
  `,
}));

interface Palette {
  key: string;
  colors: string[];
}

const ColorItem = ({ color, index }: { color: string; index: number }) => {
  const { styles } = useStyles();
  const { mode } = useStore();

  const colorValue = useMemo(() => {
    const safeFixed = (num: number) => (isNaN(num) ? '/' : num.toFixed(0));

    switch (mode) {
      case 'hex':
        return color;

      case 'oklch':
        // eslint-disable-next-line no-case-declarations
        const [light, ch, hue] = chroma(color).oklch();

        return `${safeFixed(light * 100)},${safeFixed(ch * 100)},${safeFixed(hue)}`;

      case 'hsl':
        // eslint-disable-next-line no-case-declarations
        const hsl = chroma(color).hsl();

        return `${safeFixed(hsl[0])},${safeFixed(hsl[1] * 100)}%,${safeFixed(hsl[2] * 100)}%`;

      case 'hsv':
        // eslint-disable-next-line no-case-declarations
        const hsv = chroma(color).hsv();

        return `${safeFixed(hsv[0])},${safeFixed(hsv[1] * 100)}%,${safeFixed(hsv[2] * 100)}%`;
    }
  }, [mode, color]);
  return (
    <Flexbox
      horizontal
      align={'center'}
      gap={24}
      distribution={'space-between'}
      style={{ background: color, color: invertColor(color) }}
      className={styles.color}
      width={160}
    >
      <Flexbox style={{ paddingLeft: 8 }}>{index}</Flexbox>
      <Flexbox style={{ paddingRight: 12 }}>{colorValue}</Flexbox>
    </Flexbox>
  );
};

interface ColorPaletteProps {
  palette: Palette[];
}
const ColorPalette: FC<ColorPaletteProps> = ({ palette }) => {
  const { styles } = useStyles();

  return (
    <Flexbox horizontal gap={12}>
      {palette.map((map) => {
        return (
          <Flexbox width={160} key={map.key} align={'center'}>
            <div className={styles.title} style={{ color: map.colors[6] }}>
              {map.key}
            </div>
            <Flexbox className={styles.palette}>
              {map.colors.map((hex, index) => (
                <ColorItem index={index} color={hex} key={hex} />
              ))}
            </Flexbox>
          </Flexbox>
        );
      })}
    </Flexbox>
  );
};

export default ColorPalette;
