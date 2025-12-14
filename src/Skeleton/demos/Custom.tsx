import { Skeleton } from '@lobehub/ui';

export default () => (
  <Skeleton
    avatar={{ size: 48 }}
    paragraph={{ rows: 4, width: ['100%', '80%', '60%'] }}
    title={{ width: '60%' }}
  />
);
