import { useTheme } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

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
}

const Swatches = memo<SwatchesProps>(({ colors, activeColor, onSelect }) => {
  const theme = useTheme();

  return (
    <Flexbox gap={8} horizontal>
      <Flexbox
        onClick={() => {
          onSelect?.();
        }}
        style={{
          background: theme.colorBgContainer,
          borderRadius: '50%',
          boxShadow: `inset 0 0 0px 2px ${activeColor ? 'rgba(0,0,0,0.1)' : theme.colorPrimary}`,
          cursor: 'pointer',
          height: 24,
          width: 24,
        }}
      />
      {colors.map((c) => {
        const borderColor = c === activeColor ? theme.colorPrimary : 'rgba(0,0,0,0.1)';

        return (
          <Flexbox
            key={c}
            onClick={() => {
              onSelect?.(c);
            }}
            style={{
              background: c,
              borderRadius: '50%',
              boxShadow: `inset 0 0 0px 2px ${borderColor}`,
              cursor: 'pointer',
              height: 24,
              width: 24,
            }}
          />
        );
      })}
    </Flexbox>
  );
});

export default Swatches;
