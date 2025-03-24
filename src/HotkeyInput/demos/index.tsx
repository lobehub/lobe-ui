import { HotkeyInput, type HotkeyInputProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

const DEFAULT_VALUE = 'alt+k';

export default () => {
  const store = useCreateStore();
  const [shortcut, setShortcut] = useState(DEFAULT_VALUE);

  const controls: HotkeyInputProps | any = useControls(
    {
      allowReset: true,
      defaultValue: DEFAULT_VALUE,
      disabled: false,
      placeholder: 'Press keys to record shortcut',
      resetValue: DEFAULT_VALUE,
      variant: {
        options: ['default', 'ghost', 'block', 'pure'],
        value: 'default',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <HotkeyInput
        hotkeyConflicts={['mod+m']}
        onChange={(value) => {
          setShortcut(value);
          console.log(value);
        }}
        style={{ width: '100%' }}
        value={shortcut}
        {...controls}
      />
    </StoryBook>
  );
};
