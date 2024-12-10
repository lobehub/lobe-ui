import { ActionIconGroup, ActionIconGroupProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { dropdownMenu, items } from './data';

export default () => {
  const store = useCreateStore();
  const control: ActionIconGroupProps | any = useControls(
    {
      direction: {
        options: ['row', 'column'],
        value: 'row',
      },
      size: {
        options: ['small', 'normal', 'large'],
        value: 'small',
      },
      type: {
        options: ['ghost', 'block', 'pure'],
        value: 'block',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <ActionIconGroup
        dropdownMenu={dropdownMenu}
        items={items}
        onActionClick={(key) => console.log(key)}
        {...control}
      />
    </StoryBook>
  );
};
