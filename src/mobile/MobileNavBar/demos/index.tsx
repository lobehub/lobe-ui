import { ActionIcon, Tag } from '@lobehub/ui';
import { MobileNavBar, MobileNavBarTitle } from '@lobehub/ui/mobile';
import { MessageCircle } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={16}>
      <MobileNavBar
        center={<MobileNavBarTitle desc={'desc'} title={'Title'} />}
        left={<ActionIcon icon={MessageCircle} />}
        right={
          <>
            <ActionIcon icon={MessageCircle} />
            <ActionIcon icon={MessageCircle} />
          </>
        }
      />
      <MobileNavBar
        center={
          <MobileNavBarTitle desc={'desc'} tag={<Tag size={'small'}>gpt</Tag>} title={'Title'} />
        }
      />{' '}
      <MobileNavBar
        center={<MobileNavBarTitle tag={<Tag size={'small'}>gpt</Tag>} title={'Title'} />}
      />
      <MobileNavBar center={<MobileNavBarTitle title={'Title'} />} showBackButton />
    </Flexbox>
  );
};
