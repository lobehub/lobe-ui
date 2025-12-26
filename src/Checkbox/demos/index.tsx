import { Checkbox, CheckboxProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      children: 'Checkbox',
      disabled: false,
      shape: {
        options: ['square', 'circle'],
        value: 'square',
      },
      size: {
        max: 32,
        min: 8,
        step: 2,
        value: 16,
      },
    },
    { store },
  ) as CheckboxProps;

  return (
    <StoryBook levaStore={store}>
      <Checkbox {...control} />
    </StoryBook>
  );
};
