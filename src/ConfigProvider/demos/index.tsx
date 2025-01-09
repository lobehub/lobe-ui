import { ConfigProvider } from '@lobehub/ui';
import { LobeHub } from '@lobehub/ui/brand';

export default () => {
  return (
    <ConfigProvider config={{ proxy: 'unpkg' }}>
      <LobeHub />
    </ConfigProvider>
  );
};
