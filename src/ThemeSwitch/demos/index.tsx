import { ThemeSwitch, type ThemeSwitchProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { type ThemeMode } from 'antd-style';
import { useState } from 'react';

export default () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const store = useCreateStore();
  const control = useControls(
    {
      size: {
        options: ['large', 'middle', 'small'],
        value: 'middle',
      },
      type: {
        options: ['icon', 'select'],
        value: 'icon',
      },
      variant: {
        options: ['borderless', 'filled', 'outlined'],
        value: 'borderless',
      },
    },
    { store },
  ) as ThemeSwitchProps;

  return (
    <StoryBook levaStore={store}>
      <ThemeSwitch {...control} themeMode={themeMode} onThemeSwitch={setThemeMode} />
    </StoryBook>
  );
};
