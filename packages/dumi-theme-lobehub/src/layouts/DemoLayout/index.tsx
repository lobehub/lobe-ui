import { useThemeStore } from '@/store';
import { ThemeProvider } from '@lobehub/ui';
import { useOutlet } from 'dumi';
import isEqual from 'fast-deep-equal';

export default () => {
  const themeMode = useThemeStore((st) => st.themeMode, isEqual);
  const outlet = useOutlet();

  return <ThemeProvider themeMode={themeMode}>{outlet}</ThemeProvider>;
};
