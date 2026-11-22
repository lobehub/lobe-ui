import { Flexbox } from '@lobehub/ui';
import { LobotBrandLoading3d } from '@lobehub/ui/brand';

export default () => (
  <Flexbox horizontal align={'flex-end'} gap={32}>
    <LobotBrandLoading3d size={40} />
    <LobotBrandLoading3d />
    <LobotBrandLoading3d size={120} />
  </Flexbox>
);
