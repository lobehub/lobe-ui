import { Html } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import Icon from '@/Icon';

const Loading = memo<{ size?: number }>(({ size }) => {
  return (
    <Html>
      <Center>
        <Icon icon={Loader2} size={{ fontSize: size }} spin />
      </Center>
    </Html>
  );
});

export default Loading;
