import { AutoComplete, AutoCompleteProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      shadow: false,
      variant: {
        options: ['outlined', 'borderless', 'filled'],
        value: 'filled',
      },
    },
    { store },
  ) as AutoCompleteProps;

  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const handleSearch = (value: string) => {
    setOptions(() => {
      if (!value || value.includes('@')) {
        return [];
      }
      return ['gmail.com', '163.com', 'qq.com'].map((domain) => ({
        label: `${value}@${domain}`,
        value: `${value}@${domain}`,
      }));
    });
  };

  return (
    <StoryBook gap={16} levaStore={store}>
      <AutoComplete
        onSearch={handleSearch}
        options={options}
        placeholder="input here"
        style={{ width: 200 }}
        {...controls}
      />
    </StoryBook>
  );
};
