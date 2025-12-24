import { ConfigProvider } from '@lobehub/ui';
import { LobeHub } from '@lobehub/ui/brand';
import { motion } from 'motion/react';

export default () => {
  return (
    <ConfigProvider config={{ proxy: 'unpkg' }} motion={motion}>
      <LobeHub />
    </ConfigProvider>
  );
};
