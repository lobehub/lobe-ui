import { Swatches } from '@unitalkai/ui';
import { useTheme } from 'antd-style';
import { useState } from 'react';

export default () => {
  const [activeColor, setActiveColor] = useState<string>();
  const theme = useTheme();
  return (
    <Swatches
      activeColor={activeColor}
      colors={[
        theme.red,
        theme.orange,
        theme.gold,
        theme.yellow,
        theme.lime,
        theme.green,
        theme.cyan,
        theme.blue,
        theme.geekblue,
        theme.purple,
        theme.magenta,
        theme.volcano,
      ]}
      onSelect={setActiveColor}
    />
  );
};
