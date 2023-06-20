import { ThemeProvider } from '@lobehub/ui';
import { useOutlet } from 'dumi';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

import Favicons from '@/components/Favicons';
import { useThemeStore } from '@/store';

export default memo(() => {
  const themeMode = useThemeStore((st) => st.themeMode, isEqual);
  const outlet = useOutlet();

  return (
    <>
      <Favicons />
      <ThemeProvider themeMode={themeMode}>{outlet}</ThemeProvider>
    </>
  );
});
