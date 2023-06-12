import {
  ActionIconGroup,
  ActionIconGroupProps,
  StroyBook,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { Copy, RotateCw } from 'lucide-react';

const items: ActionIconGroupProps['items'] = [
  {
    icon: Copy,
    title: 'Copy',
    onClick: () => console.log('click Copy'),
  },
  {
    icon: RotateCw,
    title: 'Regenerate',
    onClick: () => console.log('click Regenerate'),
  },
];

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
      <ActionIconGroup items={items} {...control} />
    </StroyBook>
  );
};
