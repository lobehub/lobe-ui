import { LobeSelect, type LobeSelectProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Sparkles } from 'lucide-react';

const options: NonNullable<LobeSelectProps['options']> = [
  {
    label: 'Citrus',
    options: [
      { label: 'Orange', value: 'orange' },
      { label: 'Lemon', value: 'lemon' },
    ],
  },
  {
    label: 'Berry',
    options: [
      { label: 'Strawberry', value: 'strawberry' },
      { label: 'Blueberry', value: 'blueberry' },
    ],
  },
  { disabled: true, label: 'Disabled', value: 'disabled' },
];

export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      allowClear: true,
      loading: false,
      popupMatchSelectWidth: true,
      shadow: false,
      showSearch: false,
      size: {
        options: ['small', 'middle', 'large'],
        value: 'middle',
      },
      variant: {
        options: ['outlined', 'borderless', 'filled'],
        value: 'filled',
      },
    },
    { store },
  ) as LobeSelectProps;

  return (
    <StoryBook gap={16} levaStore={store}>
      <LobeSelect
        defaultValue="orange"
        options={options}
        placeholder="Select a fruit"
        prefix={Sparkles}
        style={{ width: '100%' }}
        {...controls}
      />
      <LobeSelect
        defaultValue="lemon"
        disabled
        options={options}
        placeholder="Disabled"
        style={{ width: '100%' }}
        {...controls}
      />
      <LobeSelect
        allowClear
        defaultValue="strawberry"
        options={options}
        placeholder="Searchable"
        showSearch
        style={{ width: '100%' }}
        {...controls}
      />
      <LobeSelect
        mode="tags"
        options={options}
        placeholder="Type tags..."
        style={{ width: '100%' }}
        tokenSeparators={[',', ';']}
        {...controls}
      />
    </StoryBook>
  );
};
