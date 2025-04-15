import { Select, SelectProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      placeholder: 'Type keywords...',
      shadow: false,
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
        defaultValue="lucy"
        onChange={handleChange}
        options={[
          { label: 'Jack', value: 'jack' },
          { label: 'Lucy', value: 'lucy' },
          { label: 'yiminghe', value: 'Yiminghe' },
          { disabled: true, label: 'Disabled', value: 'disabled' },
        ]}
        style={{
          width: '100%',
        }}
        {...controls}
      />
      <Select
        defaultValue="lucy"
        disabled
        options={[{ label: 'Lucy', value: 'lucy' }]}
        style={{
          width: '100%',
        }}
        {...controls}
      />
      <Select
        defaultValue="lucy"
        loading
        options={[{ label: 'Lucy', value: 'lucy' }]}
        style={{
          width: '100%',
        }}
        {...controls}
      />
      <Select
        allowClear
        defaultValue="lucy"
        options={[{ label: 'Lucy', value: 'lucy' }]}
        style={{
          width: '100%',
        }}
        {...controls}
      />
    </StoryBook>
  );
};
