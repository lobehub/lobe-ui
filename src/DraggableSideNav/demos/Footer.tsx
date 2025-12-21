import type { FC } from 'react';

import { Flexbox } from '@/Flex';

export const DemoFooter: FC<{ expand: boolean }> = () => {
  return <Flexbox gap={8} padding={8} />;
};
