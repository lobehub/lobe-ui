import { CheckboxGroup, type CheckboxGroupProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string[]>(['option1']);
  const store = useCreateStore();
  const control = useControls(
    {
      disabled: false,
      gap: {
        max: 24,
        min: 4,
        step: 4,
        value: 8,
      },
      horizontal: true,
    },
    { store },
  ) as Omit<CheckboxGroupProps, 'onChange' | 'options' | 'value'>;

  return (
    <StoryBook levaStore={store}>
      <CheckboxGroup
        {...control}
        onChange={(values) => {
          setValue(values);
          console.log('Selected values:', values);
        }}
        options={['option1', 'option2', 'option3']}
        value={value}
      />
    </StoryBook>
  );
};
