import { ActionIconGroup, ActionIconGroupProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { dropdownMenu, items } from './data';

export default () => {
  const store = useCreateStore();
  const control: ActionIconGroupProps | any = useControls(
    {
      disabled: false,
      horizontal: true,
      shadow: false,
      size: {
        options: ['small', 'normal', 'large'],
        value: 'small',
      },
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <ActionIconGroup
        items={items}
        menu={dropdownMenu}
        onActionClick={(key) => console.log(key)}
        {...control}
      />
    </StoryBook>
  );
};
