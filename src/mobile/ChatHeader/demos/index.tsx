import { ActionIcon, Tag } from '@lobehub/ui';
import { ChatHeader } from '@lobehub/ui/mobile';
import { MessageCircle } from 'lucide-react';

import { Flexbox } from '@/Flex';

export default () => {
  return (
    <Flexbox gap={16}>
      <ChatHeader
        center={<ChatHeader.Title desc={'desc'} title={'Title'} />}
        left={<ActionIcon icon={MessageCircle} />}
        right={
          <>
            <ActionIcon icon={MessageCircle} />
            <ActionIcon icon={MessageCircle} />
          </>
        }
      />
      <ChatHeader
        center={
          <ChatHeader.Title desc={'desc'} tag={<Tag size={'small'}>gpt</Tag>} title={'Title'} />
        }
      />{' '}
      <ChatHeader
        center={<ChatHeader.Title tag={<Tag size={'small'}>gpt</Tag>} title={'Title'} />}
      />
      <ChatHeader showBackButton center={<ChatHeader.Title title={'Title'} />} />
    </Flexbox>
  );
};
