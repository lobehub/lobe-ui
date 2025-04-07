import { MobileSafeArea } from '@lobehub/ui/mobile';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox>
      <MobileSafeArea position="top" style={{ background: 'green' }} />
      <Flexbox flex={1} />
      <MobileSafeArea position="bottom" style={{ background: 'blue' }} />
    </Flexbox>
  );
};
