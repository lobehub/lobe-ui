import type { FC } from 'react';
import { Flexbox } from 'react-layout-kit';

export const DemoFooter: FC<{ expand: boolean }> = () => {
  return <Flexbox gap={8} padding={8} />;
};
