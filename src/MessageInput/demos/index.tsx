import { MessageInput } from '@lobehub/ui';

import { content } from '@/Markdown/demos/data';

export default () => {
  return <MessageInput defaultValue={content} height={200} style={{ width: '100%' }} />;
};
