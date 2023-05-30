import { useThemeStore } from '@/store/useThemeStore';
import { ThemeSwitch as ThemeSwitchBtn } from '@lobehub/ui';
import { memo } from 'react';

const ThemeSwitch = memo(() => {
  const themeMode = useThemeStore((s) => s.themeMode);

  return (
    <ThemeSwitchBtn
      themeMode={themeMode}
      onThemeSwitch={(themeMode) => {
        useThemeStore.setState({ themeMode });
      }}
    />
  );
});

export default ThemeSwitch;
