import { Tag } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { Center } from 'react-layout-kit';

export default () => {
  const theme = useTheme();
  return (
    <Center gap={24}>
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
        <Tag color={theme.colorSuccess}>success</Tag>
        <Tag color={theme.colorWarning}>warning</Tag>
        <Tag color={theme.colorError}>error</Tag>
        <Tag color={theme.colorInfo}>info</Tag>
      </Center>
    </Center>
  );
};
