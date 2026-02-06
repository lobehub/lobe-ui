import { Avatar } from '@lobehub/ui';
import { cssVar } from 'antd-style';

import { Center } from '@/Flex';

const url = 'https://avatars.githubusercontent.com/u/17870709?v=4';

export default () => {
  return (
    <Center horizontal gap={16} wrap={'wrap'}>
      <Avatar bordered avatar={url} />
      <Avatar bordered avatar={url} borderedColor={cssVar.colorInfo} />
      <Avatar bordered avatar={url} borderedColor={cssVar.colorError} />
      <Avatar bordered avatar={url} borderedColor={cssVar.colorWarning} />
      <Avatar bordered avatar={url} borderedColor={cssVar.colorSuccess} />
    </Center>
  );
};
