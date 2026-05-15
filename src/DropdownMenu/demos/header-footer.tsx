import { Avatar, Button, DropdownMenu, type DropdownMenuProps, Flexbox, Icon } from '@lobehub/ui';
import {
  CreditCardIcon,
  LifeBuoyIcon,
  LogOutIcon,
  SettingsIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react';

const items: Exclude<DropdownMenuProps['items'], () => unknown> = [
  { icon: <Icon icon={UserIcon} />, key: 'profile', label: 'Profile' },
  { icon: <Icon icon={SettingsIcon} />, key: 'settings', label: 'Settings' },
  { icon: <Icon icon={CreditCardIcon} />, key: 'billing', label: 'Billing' },
  { type: 'divider' },
  { icon: <Icon icon={SparklesIcon} />, key: 'upgrade', label: 'Upgrade plan' },
  { icon: <Icon icon={LifeBuoyIcon} />, key: 'help', label: 'Help & Support' },
];

export default () => {
  return (
    <DropdownMenu
      items={items}
      placement="bottomLeft"
      footer={
        <Button block icon={<Icon icon={LogOutIcon} />} size="small" type="text">
          Sign out
        </Button>
      }
      header={
        <Flexbox horizontal align="center" gap={12}>
          <Avatar avatar="🧑‍🚀" size={36} />
          <Flexbox>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Astro Naut</div>
            <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>astro@lobehub.com</div>
          </Flexbox>
        </Flexbox>
      }
    >
      <Button>Account</Button>
    </DropdownMenu>
  );
};
