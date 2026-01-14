import {
  ActionIcon,
  Avatar,
  Button,
  Flexbox,
  Header,
  Popover,
  PopoverGroup,
  Tag,
} from '@lobehub/ui';
import { LobeHub } from '@lobehub/ui/brand';
import {
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  ChevronDown,
  DollarSign,
  FileText,
  Globe,
  LogOut,
  Mail,
  MessageSquare,
  Newspaper,
  Plug,
  Settings,
  TrendingUp,
  User,
} from 'lucide-react';

const NavItem = ({
  children,
  items,
  icon: Icon,
}: {
  children: string;
  icon?: React.ElementType;
  items: { href?: string; icon?: React.ElementType; label: string; tag?: string }[];
}) => (
  <Popover
    arrow={false}
    content={
      <Flexbox gap={6} style={{ minWidth: 200, padding: '8px' }}>
        <div
          style={{
            color: 'var(--lobe-color-text-3)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.5px',
            padding: '4px 8px',
            textTransform: 'uppercase',
          }}
        >
          {children}
        </div>
        {items.map((item) => (
          <Flexbox
            align="center"
            horizontal
            key={item.label}
            style={{
              borderRadius: 8,
              cursor: 'pointer',
              padding: '8px 12px',
              transition: 'all 0.2s',
            }}
          >
            {item.icon && <item.icon size={16} style={{ marginRight: 10 }} />}
            <span style={{ flex: 1, fontSize: 14 }}>{item.label}</span>
            {item.tag && (
              <Tag color={item.tag === 'New' ? 'purple' : 'blue'} style={{ marginLeft: 8 }}>
                {item.tag}
              </Tag>
            )}
          </Flexbox>
        ))}
      </Flexbox>
    }
    placement="bottomLeft"
    trigger="hover"
  >
    <Button icon={Icon ? <Icon size={16} /> : undefined} style={{ gap: 6 }} type="text">
      {children}
      <ChevronDown size={14} style={{ opacity: 0.6 }} />
    </Button>
  </Popover>
);

export default () => {
  return (
    <Header
      actions={
        <PopoverGroup contentLayoutAnimation>
          <Flexbox align="center" gap={12} horizontal>
            <Popover
              arrow={false}
              content={
                <Flexbox gap={12} style={{ padding: '12px', width: 340 }}>
                  <Flexbox align="center" horizontal justify="space-between">
                    <Flexbox align="center" gap={8} horizontal>
                      <Bell size={18} style={{ color: 'var(--lobe-color-primary)' }} />
                      <span style={{ fontSize: 15, fontWeight: 600 }}>Notifications</span>
                    </Flexbox>
                    <Button size="small" type="text">
                      Clear all
                    </Button>
                  </Flexbox>
                  <Flexbox gap={8}>
                    {[
                      {
                        badge: 'New',
                        text: 'New AI model released with improved capabilities',
                        time: '2m ago',
                      },
                      { text: 'Your export is ready for download', time: '1h ago' },
                      {
                        text: 'Welcome to LobeHub! Check out our documentation',
                        time: '2d ago',
                      },
                    ].map((item, i) => (
                      <Flexbox
                        gap={8}
                        key={i}
                        style={{
                          background: 'var(--lobe-color-fill-tertiary)',
                          borderRadius: 10,
                          cursor: 'pointer',
                          padding: '12px 14px',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Flexbox align="center" gap={8} horizontal justify="space-between">
                          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>
                            {item.text}
                          </div>
                          {item.badge && (
                            <Tag color="purple" style={{ flexShrink: 0 }}>
                              {item.badge}
                            </Tag>
                          )}
                        </Flexbox>
                        <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 11 }}>
                          {item.time}
                        </div>
                      </Flexbox>
                    ))}
                  </Flexbox>
                </Flexbox>
              }
              placement="bottomRight"
              trigger="click"
            >
              <div style={{ position: 'relative' }}>
                <ActionIcon icon={Bell} size="large" />
                <div
                  style={{
                    background: 'var(--lobe-color-error)',
                    borderRadius: '50%',
                    height: 8,
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    width: 8,
                  }}
                />
              </div>
            </Popover>

            <Popover
              arrow={false}
              content={
                <Flexbox gap={8} style={{ padding: '8px', width: 240 }}>
                  <Flexbox
                    align="center"
                    gap={12}
                    horizontal
                    style={{
                      background: 'linear-gradient(135deg, var(--lobe-color-fill-secondary) 0%, var(--lobe-color-fill-tertiary) 100%)',
                      borderRadius: 10,
                      padding: '12px 14px',
                    }}
                  >
                    <Avatar
                      avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      size={44}
                      style={{ border: '2px solid var(--lobe-color-bg-container)' }}
                    />
                    <Flexbox flex={1} gap={4}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>John Doe</div>
                      <Flexbox align="center" gap={6} horizontal>
                        <Tag color="purple">Pro</Tag>
                        <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 11 }}>
                          Premium Member
                        </div>
                      </Flexbox>
                    </Flexbox>
                  </Flexbox>
                  <div
                    style={{
                      background: 'var(--lobe-color-border)',
                      height: 1,
                      margin: '4px 0',
                    }}
                  />
                  <Button
                    block
                    icon={<User size={16} />}
                    style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
                    type="text"
                  >
                    My Profile
                  </Button>
                  <Button
                    block
                    icon={<Settings size={16} />}
                    style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
                    type="text"
                  >
                    Settings
                  </Button>
                  <div
                    style={{
                      background: 'var(--lobe-color-border)',
                      height: 1,
                      margin: '4px 0',
                    }}
                  />
                  <Button
                    block
                    icon={<LogOut size={16} />}
                    style={{
                      color: 'var(--lobe-color-error)',
                      justifyContent: 'flex-start',
                      padding: '10px 12px',
                    }}
                    type="text"
                  >
                    Sign out
                  </Button>
                </Flexbox>
              }
              placement="bottomRight"
              trigger="click"
            >
              <Avatar
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                size={36}
                style={{
                  border: '2px solid var(--lobe-color-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            </Popover>
          </Flexbox>
        </PopoverGroup>
      }
      logo={<LobeHub type="combine" />}
      nav={
        <PopoverGroup contentLayoutAnimation>
          <Flexbox gap={4} horizontal>
            <NavItem
              icon={Bot}
              items={[
                { icon: MessageSquare, label: 'Chat', tag: 'New' },
                { icon: Bot, label: 'Agents' },
                { icon: Plug, label: 'Plugins' },
              ]}
            >
              Products
            </NavItem>
            <NavItem
              icon={BookOpen}
              items={[
                { icon: FileText, label: 'Documentation' },
                { icon: Newspaper, label: 'Blog' },
                { icon: TrendingUp, label: 'Changelog' },
              ]}
            >
              Resources
            </NavItem>
            <NavItem
              icon={Globe}
              items={[
                { icon: Briefcase, label: 'Enterprise' },
                { icon: DollarSign, label: 'Pricing' },
                { icon: Mail, label: 'Contact Us' },
              ]}
            >
              Company
            </NavItem>
          </Flexbox>
        </PopoverGroup>
      }
    />
  );
};
