import { ThemeProvider } from '@lobehub/ui';

export default () => (
  <ThemeProvider
    customFonts={['https://fonts.googleapis.com/css2?family=Roboto&display=swap']}
    customTheme={{
      neutralColor: 'slate',
      primaryColor: 'blue',
    }}
  >
    {/* Your application content */}
  </ThemeProvider>
);
