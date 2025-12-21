import { Avatar } from '@lobehub/ui';
import { useTheme } from 'antd-style';

import { Center } from '@/Flex';

const url = 'https://avatars.githubusercontent.com/u/17870709?v=4';

export default () => {
  const theme = useTheme();
  return (
    <Center gap={16} horizontal wrap={'wrap'}>
      <Avatar avatar={url} bordered />
      <Avatar avatar={url} bordered borderedColor={theme.colorInfo} />
      <Avatar avatar={url} bordered borderedColor={theme.colorError} />
      <Avatar avatar={url} bordered borderedColor={theme.colorWarning} />
      <Avatar avatar={url} bordered borderedColor={theme.colorSuccess} />
    </Center>
  );
};
