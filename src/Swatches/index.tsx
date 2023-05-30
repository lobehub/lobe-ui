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
  onSelect?: (c: string | null) => void;
}

const Swatches = memo<SwatchesProps>(({ colors, activeColor, onSelect }) => {
  const theme = useTheme();

  return (
    <Flexbox gap={8} horizontal>
      <Flexbox
        onClick={() => {
          onSelect?.(null);
        }}
        style={{
          width: 24,
          height: 24,
          background: theme.colorBgContainer,
          boxShadow: `inset 0 0 0px 2px ${!activeColor ? theme.colorPrimary : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '50%',
          cursor: 'pointer',
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
              width: 24,
              height: 24,
              background: c,
              boxShadow: `inset 0 0 0px 2px ${borderColor}`,
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          />
        );
      })}
    </Flexbox>
  );
});

export default Swatches;
