import { Collapse, CollapseProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { items } from './data';

export default () => {
  const store = useCreateStore();

  const control = useControls(
    {
      accordion: false,
      collapsible: true,
      gap: {
        max: 36,
        min: 0,
        step: 1,
        value: 0,
      },
      size: {
        options: ['small', 'middle', 'large'],
        value: 'middle',
      },
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  ) as CollapseProps;

  return (
    <StoryBook levaStore={store}>
      <Collapse items={items} {...control} />
    </StoryBook>
  );
};
