import { Loader2 } from 'lucide-react';
import { type FC } from 'react';

import { Center } from '@/Flex';
import Icon from '@/Icon';

const Loading: FC<{ size?: number }> = ({ size = 32 }) => {
  return (
    <Center height={'100%'} justify={'center'} style={{ position: 'absolute' }} width={'100%'}>
      <Icon spin icon={Loader2} size={size} />
    </Center>
  );
};

export default Loading;
