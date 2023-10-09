import {
  ActionIconGroup,
  ActionIconGroupProps,
  StoryBook,
  useControls,
  useCreateStore,
} from '@lobehub/ui';

import { dropdownMenu, items } from './data';

export default () => {
  const store = useCreateStore();
  const control: ActionIconGroupProps | any = useControls(
    {
      direction: {
        options: ['row', 'column'],
        value: 'row',
      },
      spotlight: true,
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
