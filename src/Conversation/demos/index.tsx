/**
 * iframe: 600
 */
import { Conversation } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';

import { data } from './data';

export default () => {
  return (
    <Flexbox padding={40}>
      <Conversation messages={data} />
    </Flexbox>
  );
};
