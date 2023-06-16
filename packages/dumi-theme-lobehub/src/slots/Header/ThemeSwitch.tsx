import { ThemeSwitch as ThemeSwitchButton } from '@lobehub/ui';
import { memo } from 'react';

import { useThemeStore } from '@/store/useThemeStore';

const ThemeSwitch = memo(() => {
  const themeMode = useThemeStore((s) => s.themeMode);

  return (
    <ThemeSwitchButton
      onThemeSwitch={(themeMode) => {
        useThemeStore.setState({ themeMode });
      }}
      themeMode={themeMode}
    />
  );
});

export default ThemeSwitch;
