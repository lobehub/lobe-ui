import { useThemeStore } from '@/store/useThemeStore';
import { ThemeSwitch as ThemeSwitchBtn } from '@lobehub/ui';
import { memo, type FC } from 'react';

const ThemeSwitch: FC = () => {
  const themeMode = useThemeStore((s) => s.themeMode);

  return (
    <ThemeSwitchBtn
      themeMode={themeMode}
      onThemeSwitch={(themeMode) => {
        useThemeStore.setState({ themeMode });
      }}
    />
  );
};

export default memo(ThemeSwitch);
