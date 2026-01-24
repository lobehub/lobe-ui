import { LobeSelect, type LobeSelectProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const options: NonNullable<LobeSelectProps['options']> = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian' },
  { label: 'Elderberry', value: 'elderberry' },
];

export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      selectedIndicatorVariant: {
        options: ['check', 'bold'],
        value: 'check',
      },
    },
    { store },
  ) as Pick<LobeSelectProps, 'selectedIndicatorVariant'>;

  return (
    <StoryBook gap={16} levaStore={store}>
      <LobeSelect
        defaultValue="banana"
        options={options}
        placeholder="Check indicator (default)"
        selectedIndicatorVariant="check"
        style={{ width: '100%' }}
      />
      <LobeSelect
        defaultValue="banana"
        options={options}
        placeholder="Bold indicator"
        selectedIndicatorVariant="bold"
        style={{ width: '100%' }}
      />
      <LobeSelect
        defaultValue="cherry"
        options={options}
        placeholder="With controls"
        style={{ width: '100%' }}
        {...controls}
      />
    </StoryBook>
  );
};
