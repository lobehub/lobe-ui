import { Avatar, Button, Flexbox, Popover, Tag } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { ChevronDown, Clock, CreditCard, Download, LogOut, Settings } from 'lucide-react';
import type React from 'react';

const MenuItem = ({ icon: Icon, children }: { children: string; icon: React.ElementType }) => (
  <Button
    block
    icon={<Icon size={16} />}
    style={{ justifyContent: 'flex-start', padding: '8px 16px' }}
    type="text"
  >
    {children}
  </Button>
);

const StatItem = ({ label, value }: { label: string; value: number }) => (
  <Flexbox
    gap={4}
    style={{
      background: 'var(--lobe-color-fill-tertiary)',
      borderRadius: 8,
      flex: 1,
      padding: '8px 12px',
    }}
  >
    <div style={{ fontSize: 18, fontWeight: 600 }}>{value}</div>
    <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>{label}</div>
  </Flexbox>
);

const styles = createStaticStyles(({ css }) => ({
  content: css`
    padding: 6px;
  `,
}));
export default () => {
  const avatarUrl = 'https://cdn.jsdelivr.net/gh/Innei/static@master/avatar.png';

  return (
    <Flexbox style={{ padding: 24 }}>
      <Popover
        arrow={false}
        classNames={{
          content: styles.content,
        }}
        content={
          <Flexbox gap={8} style={{ width: 320 }}>
            {/* User Info Section */}
            <Flexbox align="center" gap={12} horizontal>
              <Avatar avatar={avatarUrl} size={48} style={{ borderRadius: 12 }} />
              <Flexbox flex={1} gap={2}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>拾一</div>
                <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>
                  https://github.com/Innei
                </div>
              </Flexbox>
              <Tag color="purple">Pro</Tag>
            </Flexbox>

            {/* Stats Row */}
            <Flexbox gap={8} horizontal>
              <StatItem label="助理" value={4} />
              <StatItem label="话题" value={13} />
              <StatItem label="消息" value={114} />
            </Flexbox>

            {/* Divider */}
            <div style={{ background: 'var(--lobe-color-border)', height: 1 }} />

            {/* Menu Items */}
            <Flexbox gap={4}>
              <MenuItem icon={Settings}>应用设置</MenuItem>
              <MenuItem icon={Clock}>使用统计</MenuItem>
              <MenuItem icon={CreditCard}>账单管理</MenuItem>
              <MenuItem icon={Download}>导入数据</MenuItem>
            </Flexbox>

            {/* Divider */}
            <div style={{ background: 'var(--lobe-color-border)', height: 1 }} />

            {/* Logout */}
            <MenuItem icon={LogOut}>退出登录</MenuItem>
          </Flexbox>
        }
        inset
        placement="topLeft"
        trigger="click"
      >
        <Flexbox
          align="center"
          gap={12}
          horizontal
          style={{
            background: 'var(--lobe-color-fill-secondary)',
            borderRadius: 12,
            cursor: 'pointer',
            padding: '8px 12px',
            width: 'fit-content',
          }}
        >
          <Avatar avatar={avatarUrl} size={40} style={{ borderRadius: 10 }} />
          <Flexbox align="center" gap={4} horizontal>
            <span style={{ fontWeight: 500 }}>拾一</span>
            <ChevronDown size={14} />
          </Flexbox>
        </Flexbox>
      </Popover>
    </Flexbox>
  );
};
