import { Tag } from '@lobehub/ui';
import { Badge } from 'antd';
import { cssVar } from 'antd-style';

import { Center } from '@/Flex';

export default () => {
  return (
    <Center gap={24}>
      <Center gap={4} horizontal wrap={'wrap'}>
        <Tag color="success">success</Tag>
        <Tag color="warning">warning</Tag>
        <Tag color="error">error</Tag>
        <Tag color="info">info</Tag>
      </Center>
      <Center gap={4} horizontal wrap={'wrap'}>
        <Tag color="magenta">magenta</Tag>
        <Tag color="red">red</Tag>
        <Tag color="volcano">volcano</Tag>
        <Tag color="orange">orange</Tag>
        <Tag color="gold">gold</Tag>
        <Tag color="lime">lime</Tag>
        <Tag color="green">green</Tag>
        <Tag color="cyan">cyan</Tag>
        <Tag color="blue">blue</Tag>
        <Tag color="geekblue">geekblue</Tag>
        <Tag color="purple">purple</Tag>
      </Center>
      <Center gap={4} horizontal wrap={'wrap'}>
        <Tag color={cssVar.colorSuccess}>success</Tag>
        <Tag color={cssVar.colorWarning}>warning</Tag>
        <Tag color={cssVar.colorError}>error</Tag>
        <Tag color={cssVar.colorInfo}>info</Tag>
      </Center>
      <Center gap={4} horizontal wrap={'wrap'}>
        <Tag color="processing" icon={<Badge status={'processing'} />}>
          processing
        </Tag>
      </Center>
    </Center>
  );
};
