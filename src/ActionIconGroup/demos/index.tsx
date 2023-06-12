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
      type: {
        value: 'block',
        options: ['ghost', 'block', 'pure'],
      },
      direction: {
        value: 'row',
        options: ['row', 'column'],
      },
      spotlight: true,
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <ActionIconGroup dropdownMenu={dropdownMenu} items={items} {...control} />
    </StroyBook>
  );
};
