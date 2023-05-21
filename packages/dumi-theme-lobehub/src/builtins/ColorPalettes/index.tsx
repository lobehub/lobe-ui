import { Center, Flexbox } from 'react-layout-kit';

import { Radio } from 'antd';
import { darkColorPalettes } from '../../styles/theme/dark';
import { lightColorPalettes } from '../../styles/theme/light';
import ColorPalette from './ColorPalette';

import { useStore } from './store';

interface Palette {
  key: string;
  colors: string[];
}

const lightColorMaps: Palette[] = Object.entries(lightColorPalettes).map(([key, value]) => ({
  key,
  colors: value,
}));

const darkColorMaps: Palette[] = Object.entries(darkColorPalettes).map(([key, value]) => ({
  key,
  colors: value,
}));

export default () => {
  const { mode } = useStore();
  return (
    <Flexbox>
      <Flexbox align={'center'} horizontal gap={12} style={{ marginBottom: 8, alignSelf: 'end' }}>
        色彩模型
        <Radio.Group
          value={mode}
          options={[
            { label: 'OKLCH', value: 'oklch' },
            { label: 'HEX', value: 'hex' },
            { label: 'HSL', value: 'hsl' },
            { label: 'HSV', value: 'hsv' },
          ]}
          onChange={(e) => {
            useStore.setState({ mode: e.target.value });
          }}
        />
      </Flexbox>
      <Center padding={24} style={{ background: '#fafafa' }}>
        <ColorPalette palette={lightColorMaps} />
      </Center>
      <Center padding={24} style={{ background: '#000' }}>
        <ColorPalette palette={darkColorMaps} />
      </Center>
    </Flexbox>
  );
};
