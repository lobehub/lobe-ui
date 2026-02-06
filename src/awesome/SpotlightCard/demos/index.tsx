import { SpotlightCard } from '@lobehub/ui/awesome';
import { Avatar } from 'antd';

import { Flexbox } from '@/Flex';

import data from './data';

const render = (item: any) => (
  <Flexbox horizontal align={'flex-start'} gap={8} style={{ padding: 16 }}>
    <Avatar size={24} src={item.favicon} style={{ flex: 'none' }} />
    <Flexbox>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{item.title}</div>
      <div style={{ opacity: 0.6 }}>{item.content}</div>
    </Flexbox>
  </Flexbox>
);

export default () => {
  return <SpotlightCard items={data} renderItem={render} />;
};
