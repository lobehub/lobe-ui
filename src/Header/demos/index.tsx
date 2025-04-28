import { Header } from '@lobehub/ui';
import { LobeHub } from '@lobehub/ui/brand';

export default () => {
  return <Header actions={'ACTIONS'} logo={<LobeHub type={'combine'} />} nav={'NAV'} />;
};
