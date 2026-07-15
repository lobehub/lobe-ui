import { LobeHub } from '@lobehub/ui/brand';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox align={'flex-start'} gap={16}>
    <LobeHub size={64} />
    <LobeHub size={64} type={'mono'} />
    <LobeHub size={64} type={'flat'} />
    <LobeHub size={64} type={'text'} />
    <LobeHub size={64} type={'combine'} />
    <LobeHub extra={'Discover'} size={64} />
    <LobeHub extra={'Discover'} size={64} type={'combine'} />
  </Flexbox>
);
