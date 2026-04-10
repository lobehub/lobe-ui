import { Button, Flexbox, Popover, PopoverGroup, Tag } from '@lobehub/ui';
import { BarChart3, LayoutDashboard, Sparkles } from 'lucide-react';

const content = {
  analytics: (
    <Flexbox gap={10} style={{ padding: '8px 12px', width: 280 }}>
      <Flexbox horizontal align="center" gap={8}>
        <BarChart3 size={18} style={{ color: 'var(--lobe-color-primary)' }} />
        <div style={{ fontSize: 15, fontWeight: 600 }}>Analytics</div>
        <Tag color="green">Popular</Tag>
      </Flexbox>
      <div style={{ color: 'var(--lobe-color-text-2)', fontSize: 13, lineHeight: 1.6 }}>
        Deep dive into reports, user cohorts, and conversion funnel insights to optimize your
        strategy.
      </div>
    </Flexbox>
  ),
  automation: (
    <Flexbox gap={10} style={{ padding: '8px 12px', width: 260 }}>
      <Flexbox horizontal align="center" gap={8}>
        <Sparkles size={18} style={{ color: 'var(--lobe-color-warning)' }} />
        <div style={{ fontSize: 15, fontWeight: 600 }}>Automation</div>
        <Tag color="purple">New</Tag>
      </Flexbox>
      <div style={{ color: 'var(--lobe-color-text-2)', fontSize: 13, lineHeight: 1.6 }}>
        Create smart rules, schedule tasks, and build powerful workflows to save time.
      </div>
    </Flexbox>
  ),
  dashboard: (
    <Flexbox gap={10} style={{ padding: '8px 12px', width: 280 }}>
      <Flexbox horizontal align="center" gap={8}>
        <LayoutDashboard size={18} style={{ color: 'var(--lobe-color-success)' }} />
        <div style={{ fontSize: 15, fontWeight: 600 }}>Dashboard</div>
      </Flexbox>
      <div style={{ color: 'var(--lobe-color-text-2)', fontSize: 13, lineHeight: 1.6 }}>
        Get a comprehensive overview of your activity with quick actions and real-time metrics.
      </div>
    </Flexbox>
  ),
};

export default () => (
  <PopoverGroup contentLayoutAnimation>
    <Flexbox
      horizontal
      align="center"
      gap={4}
      style={{
        background: 'var(--lobe-color-fill-secondary)',
        borderRadius: 12,
        padding: '8px 12px',
        width: 'fit-content',
      }}
    >
      <Popover content={content.dashboard} placement="bottom" trigger="hover">
        <Button icon={<LayoutDashboard size={16} />} type="text">
          Dashboard
        </Button>
      </Popover>
      <Popover content={content.analytics} placement="bottom" trigger="hover">
        <Button icon={<BarChart3 size={16} />} type="text">
          Analytics
        </Button>
      </Popover>
      <Popover content={content.automation} placement="bottom" trigger="hover">
        <Button icon={<Sparkles size={16} />} type="text">
          Automation
        </Button>
      </Popover>
    </Flexbox>
  </PopoverGroup>
);
