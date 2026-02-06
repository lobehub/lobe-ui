import { HotkeyInput, type HotkeyInputProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

const DEFAULT_VALUE = 'alt+k';

export default () => {
  const store = useCreateStore();
  const [shortcut, setShortcut] = useState(DEFAULT_VALUE);

  const controls = useControls(
    {
      allowReset: true,
      defaultValue: DEFAULT_VALUE,
      disabled: false,
      placeholder: 'Press keys to record shortcut',
      resetValue: DEFAULT_VALUE,
      shadow: false,
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  ) as HotkeyInputProps;

  return (
    <StoryBook levaStore={store}>
      <HotkeyInput
        hotkeyConflicts={['mod+m']}
        style={{ width: '100%' }}
        value={shortcut}
        onChange={(value) => {
          setShortcut(value);
          console.log(value);
        }}
        {...controls}
      />
    </StoryBook>
  );
};
