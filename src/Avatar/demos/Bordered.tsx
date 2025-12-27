import { Avatar } from '@lobehub/ui';
import { cssVar } from 'antd-style';

import { Center } from '@/Flex';

const url = 'https://avatars.githubusercontent.com/u/17870709?v=4';

export default () => {
  return (
    <Center gap={16} horizontal wrap={'wrap'}>
      <Avatar avatar={url} bordered />
      <Avatar avatar={url} bordered borderedColor={cssVar.colorInfo} />
      <Avatar avatar={url} bordered borderedColor={cssVar.colorError} />
      <Avatar avatar={url} bordered borderedColor={cssVar.colorWarning} />
      <Avatar avatar={url} bordered borderedColor={cssVar.colorSuccess} />
    </Center>
  );
};
