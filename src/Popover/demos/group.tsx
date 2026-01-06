import { Button, Flexbox, Popover, PopoverGroup } from '@lobehub/ui';

const content = {
  analytics: (
    <Flexbox gap={4} style={{ width: 260 }}>
      <div style={{ fontWeight: 600 }}>Analytics</div>
      <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>
        Reports, cohorts, and funnel insights.
      </div>
    </Flexbox>
  ),
  automation: (
    <Flexbox gap={4} style={{ width: 200 }}>
      <div style={{ fontWeight: 600 }}>Automation</div>
      <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>
        Rules, schedules, and workflows.
      </div>
    </Flexbox>
  ),
  dashboard: (
    <Flexbox gap={4} style={{ width: 220 }}>
      <div style={{ fontWeight: 600 }}>Dashboard</div>
      <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12 }}>
        Overview, activity, and quick actions.
      </div>
    </Flexbox>
  ),
};

export default () => (
  <PopoverGroup>
    <Flexbox align="center" gap={8} horizontal>
      <Popover content={content.dashboard} placement="bottom" trigger="hover">
        <Button type="text">Dashboard</Button>
      </Popover>
      <Popover content={content.analytics} placement="bottom" trigger="hover">
        <Button type="text">Analytics</Button>
      </Popover>
      <Popover content={content.automation} placement="bottom" trigger="hover">
        <Button type="text">Automation</Button>
      </Popover>
    </Flexbox>
  </PopoverGroup>
);
