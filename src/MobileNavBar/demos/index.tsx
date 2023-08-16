/**
 * iframe: true
 */
import { ActionIcon, MobileNavBar, MobileNavBarTitle, Tag } from '@lobehub/ui';
import { MessageCircle } from 'lucide-react';

export default () => {
  return (
    <>
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
    </>
  );
};
