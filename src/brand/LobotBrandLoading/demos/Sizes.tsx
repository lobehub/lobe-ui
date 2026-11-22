import { Flexbox } from '@lobehub/ui';
import { LobotBrandLoading, LobotMono } from '@lobehub/ui/brand';

export default () => (
  <Flexbox horizontal align={'flex-end'} gap={32}>
    <LobotBrandLoading size={32} />
    <LobotBrandLoading />
    <LobotBrandLoading size={96} />
    <LobotMono size={96} />
  </Flexbox>
);
