import { ThemeProvider } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const theme = useTheme();
  return (
    <Flexbox>
      <ThemeProvider>
        <p>Default Fonts</p>
        <h1>Hello World</h1>
      </ThemeProvider>
      <ThemeProvider
        customFonts={[
          'https://registry.npmmirror.com/@lobehub/webfont-mono/latest/files/css/index.css',
        ]}
        theme={{
          token: {
            fontFamily: `Hack, ${theme.fontFamily}`,
          },
        }}
      >
        <p>Custom Fonts</p>
        <h1>Hello World</h1>
      </ThemeProvider>
    </Flexbox>
  );
};
