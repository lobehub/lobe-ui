import { Menu, type MenuProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { groupItems, items } from './data';

export default () => {
  const [activeKey, setActiveKey] = useState<string>();
  const store = useCreateStore();
  const options = useControls(
    {
      compact: false,
      mode: {
        options: ['horizontal', 'vertical', 'inline'],
        value: 'inline',
      },
      shadow: false,
      variant: {
        options: ['filled', 'outlined', 'borderless'],
        value: 'borderless',
      },
    },
    { store },
  ) as MenuProps;

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={24} width={'100%'}>
        <Flexbox width={'100%'}>
          <h3>Items</h3>
          <Menu
            {...options}
            // @ts-ignore
            activeKey={activeKey}
            items={items}
            onClick={({ key }) => setActiveKey(key)}
          />
        </Flexbox>
        <Flexbox width={'100%'}>
          <h3>Group Items</h3>
          <Menu
            {...options}
            // @ts-ignore
            activeKey={activeKey}
            items={groupItems}
            onClick={({ key }) => setActiveKey(key)}
          />
        </Flexbox>
      </Flexbox>
    </StoryBook>
  );
};
