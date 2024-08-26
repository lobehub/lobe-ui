/**
 * iframe: true
 */
import { Icon, MobileTabBar, type MobileTabBarProps } from '@unitalkai/ui';
import { MessageCircle } from 'lucide-react';

const items: MobileTabBarProps['items'] = [
  {
    icon: <Icon icon={MessageCircle} />,
    key: 'tab1',
    title: 'Tab1',
  },
  {
    icon: <Icon icon={MessageCircle} />,
    key: 'tab2',
    title: 'Tab2',
  },
  {
    icon: <Icon icon={MessageCircle} />,
    key: 'tab3',
    title: 'Tab3',
  },
];

export default () => {
  return <MobileTabBar items={items} style={{ bottom: 0, left: 0, position: 'absolute' }} />;
};
