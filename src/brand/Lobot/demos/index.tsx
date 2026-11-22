import { Flexbox } from '@lobehub/ui';
import { Lobot } from '@lobehub/ui/brand';

export default () => (
  <Flexbox align={'flex-start'} gap={16}>
    <Lobot size={64} />
    <Lobot size={64} type={'text'} />
    <Lobot size={64} type={'combine'} />
    <Lobot extra={'Discover'} size={64} />
    <Lobot extra={'Discover'} size={64} type={'combine'} />
  </Flexbox>
);
