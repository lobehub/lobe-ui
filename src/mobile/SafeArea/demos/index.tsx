import { SafeArea } from '@lobehub/ui/mobile';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox>
      <SafeArea position="top" style={{ background: 'green' }} />
      <Flexbox flex={1} />
      <SafeArea position="bottom" style={{ background: 'blue' }} />
    </Flexbox>
  );
};
