import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import Icon from '@/Icon';

const Loading = memo<{ size?: number }>(({ size = 32 }) => {
  return (
    <Center height={'100%'} justify={'center'} style={{ position: 'absolute' }} width={'100%'}>
      <Icon icon={Loader2} size={{ fontSize: size }} spin />
    </Center>
  );
});

export default Loading;
