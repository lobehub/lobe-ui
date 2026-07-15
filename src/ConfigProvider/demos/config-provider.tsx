import { ConfigProvider } from '@lobehub/ui';
import { LobeHub } from '@lobehub/ui/brand';
import { motion } from 'motion/react';

export default () => {
  return (
    <ConfigProvider
      motion={motion}
      config={{
        customCdnFn: ({ pkg, version = 'latest', path }) =>
          `https://yourcdn/${pkg}/${version}/${path}`,
        proxy: 'custom',
      }}
    >
      <LobeHub />
    </ConfigProvider>
  );
};
