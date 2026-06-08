import { Tag } from '@lobehub/ui';
import { Badge } from 'antd';

import { Center } from '@/Flex';

export default () => {
  return (
    <Center gap={24}>
      <Center horizontal gap={4} wrap={'wrap'}>
        <Tag color="success">success</Tag>
        <Tag color="warning">warning</Tag>
        <Tag color="error">error</Tag>
        <Tag color="info">info</Tag>
      </Center>
      <Center horizontal gap={4} wrap={'wrap'}>
        <Tag color="magenta">magenta</Tag>
        <Tag color="red">red</Tag>
        <Tag color="volcano">volcano</Tag>
        <Tag color="orange">orange</Tag>
        <Tag color="gold">gold</Tag>
        <Tag color="yellow">yellow</Tag>
        <Tag color="lime">lime</Tag>
        <Tag color="green">green</Tag>
        <Tag color="cyan">cyan</Tag>
        <Tag color="blue">blue</Tag>
        <Tag color="geekblue">geekblue</Tag>
        <Tag color="purple">purple</Tag>
      </Center>
      <Center horizontal gap={4} wrap={'wrap'}>
        <Tag color="magenta" variant="solid">
          magenta
        </Tag>
        <Tag color="red" variant="solid">
          red
        </Tag>
        <Tag color="volcano" variant="solid">
          volcano
        </Tag>
        <Tag color="orange" variant="solid">
          orange
        </Tag>
        <Tag color="gold" variant="solid">
          gold
        </Tag>
        <Tag color="yellow" variant="solid">
          yellow
        </Tag>
        <Tag color="lime" variant="solid">
          lime
        </Tag>
        <Tag color="green" variant="solid">
          green
        </Tag>
        <Tag color="cyan" variant="solid">
          cyan
        </Tag>
        <Tag color="blue" variant="solid">
          blue
        </Tag>
        <Tag color="geekblue" variant="solid">
          geekblue
        </Tag>
        <Tag color="purple" variant="solid">
          purple
        </Tag>
      </Center>
      <Center horizontal gap={4} wrap={'wrap'}>
        <Tag color="processing" icon={<Badge status={'processing'} />}>
          processing
        </Tag>
      </Center>
    </Center>
  );
};
