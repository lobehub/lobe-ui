import { ActionIconProps, ThemeSwitch } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { type ThemeMode } from 'antd-style';
import { useState } from 'react';

export default () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const store = useCreateStore();
  const control: ActionIconProps | any = useControls(
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
  );

  return (
    <StoryBook levaStore={store}>
      <ThemeSwitch onThemeSwitch={setThemeMode} themeMode={themeMode} {...control} />
    </StoryBook>
  );
};
