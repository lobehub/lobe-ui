import {
  ActionIconGroup,
  ActionIconGroupProps,
  StroyBook,
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
    <StroyBook levaStore={store}>
      <ActionIconGroup dropdownMenu={dropdownMenu} items={items} {...control} />
    </StroyBook>
  );
};
