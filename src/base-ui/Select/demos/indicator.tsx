import { Select, type SelectProps } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const options: NonNullable<SelectProps['options']> = [
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
  ) as Pick<SelectProps, 'selectedIndicatorVariant'>;

  return (
    <StoryBook gap={16} levaStore={store}>
      <Select
        defaultValue="banana"
        options={options}
        placeholder="Check indicator (default)"
        selectedIndicatorVariant="check"
        style={{ width: '100%' }}
      />
      <Select
        defaultValue="banana"
        options={options}
        placeholder="Bold indicator"
        selectedIndicatorVariant="bold"
        style={{ width: '100%' }}
      />
      <Select
        defaultValue="cherry"
        options={options}
        placeholder="With controls"
        style={{ width: '100%' }}
        {...controls}
      />
    </StoryBook>
  );
};
