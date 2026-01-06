import { ActionIcon, Avatar, Button, Flexbox, Header, Popover, PopoverGroup } from '@lobehub/ui';
import { LobeHub } from '@lobehub/ui/brand';
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';

const NavItem = ({
  children,
  items,
}: {
  children: string;
  items: { href?: string; label: string }[];
}) => (
  <Popover
    arrow={false}
    content={
      <Flexbox gap={4} style={{ minWidth: 160 }}>
        {items.map((item) => (
          <Button
            block
            key={item.label}
            size="small"
            style={{ justifyContent: 'flex-start' }}
            type="text"
          >
            {item.label}
          </Button>
        ))}
      </Flexbox>
    }
    placement="bottomLeft"
    trigger="hover"
  >
    <Button style={{ gap: 4 }} type="text">
      {children}
      <ChevronDown size={14} />
    </Button>
  </Popover>
);

export default () => {
  return (
    <Header
      actions={
        <PopoverGroup contentLayoutAnimation>
          <Flexbox align="center" gap={8} horizontal>
            <Popover
              arrow={false}
              content={
                <Flexbox gap={8} style={{ width: 280 }}>
                  <Flexbox align="center" horizontal justify="space-between">
                    <span style={{ fontWeight: 500 }}>Notifications</span>
                    <Button size="small" type="text">
                      Mark all read
                    </Button>
                  </Flexbox>
                  {[
                    { text: 'New feature released', time: '2m ago' },
                    { text: 'Your export is ready', time: '1h ago' },
                    { text: 'Welcome to LobeHub!', time: '2d ago' },
                  ].map((item, i) => (
                    <Flexbox
                      gap={2}
                      key={i}
                      style={{
                        background: 'var(--lobe-color-fill-tertiary)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        padding: '8px 12px',
                      }}
                    >
                      <div style={{ fontSize: 13 }}>{item.text}</div>
                      <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 11 }}>
                        {item.time}
                      </div>
                    </Flexbox>
                  ))}
                </Flexbox>
              }
              placement="bottomRight"
              trigger="click"
            >
              <ActionIcon icon={Bell} />
            </Popover>

            <Popover
              arrow={false}
              content={
                <Flexbox gap={4} style={{ width: 180 }}>
                  <Flexbox align="center" gap={12} horizontal style={{ padding: '8px 12px' }}>
                    <Avatar
                      avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      size={40}
                    />
                    <Flexbox gap={2}>
                      <div style={{ fontWeight: 500 }}>John Doe</div>
                      <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>
                        Pro Plan
                      </div>
                    </Flexbox>
                  </Flexbox>
                  <div style={{ background: 'var(--lobe-color-border)', height: 1 }} />
                  <Button
                    block
                    icon={<User size={16} />}
                    style={{ justifyContent: 'flex-start' }}
                    type="text"
                  >
                    Profile
                  </Button>
                  <Button
                    block
                    icon={<Settings size={16} />}
                    style={{ justifyContent: 'flex-start' }}
                    type="text"
                  >
                    Settings
                  </Button>
                  <div style={{ background: 'var(--lobe-color-border)', height: 1 }} />
                  <Button
                    block
                    icon={<LogOut size={16} />}
                    style={{ justifyContent: 'flex-start' }}
                    type="text"
                  >
                    Sign out
                  </Button>
                </Flexbox>
              }
              placement="bottomRight"
              trigger="click"
            >
              <Avatar avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=user" size={32} />
            </Popover>
          </Flexbox>
        </PopoverGroup>
      }
      logo={<LobeHub type="combine" />}
      nav={
        <PopoverGroup contentLayoutAnimation>
          <Flexbox horizontal>
            <NavItem items={[{ label: 'Chat' }, { label: 'Agents' }, { label: 'Plugins' }]}>
              Products
            </NavItem>
            <NavItem items={[{ label: 'Docs' }, { label: 'Blog' }, { label: 'Changelog' }]}>
              Resources
            </NavItem>
            <NavItem items={[{ label: 'Enterprise' }, { label: 'Pricing' }, { label: 'Contact' }]}>
              Company
            </NavItem>
          </Flexbox>
        </PopoverGroup>
      }
    />
  );
};
