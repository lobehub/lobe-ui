import { Avatar } from '@lobehub/ui';
import { SpotlightCard } from '@lobehub/ui/awesome';

import { Flexbox } from '@/Flex';

import data from './data';

const render = (item: any) => (
  <Flexbox horizontal align={'flex-start'} gap={8} style={{ padding: 16 }}>
    <Avatar avatar={item.favicon} size={24} style={{ flex: 'none' }} />
    <Flexbox>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{item.title}</div>
      <div style={{ opacity: 0.6 }}>{item.content}</div>
    </Flexbox>
  </Flexbox>
);

export default () => {
  return <SpotlightCard items={data} renderItem={render} />;
};
