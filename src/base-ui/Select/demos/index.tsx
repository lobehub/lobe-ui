import { Select, type SelectProps } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Sparkles } from 'lucide-react';

const options: NonNullable<SelectProps['options']> = [
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

const longOptions: NonNullable<SelectProps['options']> = Array.from({ length: 120 }).map(
  (_, index) => ({
    label: `Option ${index + 1}`,
    value: `option-${index + 1}`,
  }),
);

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
  ) as SelectProps;

  return (
    <StoryBook gap={16} levaStore={store}>
      <Select
        behaviorVariant="default"
        defaultValue="orange"
        options={options}
        placeholder="Behavior: default"
        prefix={Sparkles}
        style={{ width: '100%' }}
        {...controls}
      />
      <Select
        behaviorVariant="item-aligned"
        defaultValue="lemon"
        options={options}
        placeholder="Behavior: item-aligned"
        style={{ width: '100%' }}
        {...controls}
      />
      <Select
        behaviorVariant="default"
        defaultValue="option-60"
        options={longOptions}
        placeholder="Long list (default / maxHeight: 450px)"
        style={{ width: '100%' }}
        {...controls}
      />
      <Select
        behaviorVariant="item-aligned"
        defaultValue="option-60"
        options={longOptions}
        placeholder="Long list (item-aligned / maxHeight: 80vh)"
        style={{ width: '100%' }}
        {...controls}
      />
      <Select
        readOnly
        defaultValue="blueberry"
        options={options}
        placeholder="Readonly"
        style={{ width: '100%' }}
        {...controls}
      />
      <Select
        disabled
        defaultValue="disabled"
        options={options}
        placeholder="Disabled"
        style={{ width: '100%' }}
        {...controls}
      />
      <Select
        allowClear
        showSearch
        defaultValue="strawberry"
        options={options}
        placeholder="Searchable"
        style={{ width: '100%' }}
        {...controls}
      />
      <Select
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
