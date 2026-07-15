import { LobeChat } from '@lobehub/ui/brand';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox align={'flex-start'} gap={16}>
    <LobeChat size={64} />
    <LobeChat size={64} type={'mono'} />
    <LobeChat size={64} type={'flat'} />
    <LobeChat size={64} type={'text'} />
    <LobeChat size={64} type={'combine'} />
    <LobeChat extra={'Discover'} size={64} />
    <LobeChat extra={'Discover'} size={64} type={'combine'} />
  </Flexbox>
);
