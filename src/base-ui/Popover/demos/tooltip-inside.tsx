import { Button, Flexbox, Popover, Tooltip } from '@lobehub/ui';
import { Info, Sparkles } from 'lucide-react';

export default () => {
  return (
    <Flexbox align="center" height={280} justify="center" style={{ padding: 24 }}>
      <Popover
        arrow
        placement="bottom"
        trigger="click"
        content={
          <Flexbox gap={16} style={{ padding: '12px 16px' }}>
            <Flexbox gap={8}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Nested Tooltips</div>
              <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 13, lineHeight: 1.6 }}>
                Tooltips can work seamlessly inside popovers, providing additional context on hover.
              </div>
            </Flexbox>
            <Flexbox horizontal gap={8}>
              <Tooltip title="Get detailed information about this feature">
                <Button icon={<Info size={16} />} size="small">
                  Info
                </Button>
              </Tooltip>
              <Tooltip title="Explore advanced options and settings">
                <Button icon={<Sparkles size={16} />} size="small" type="primary">
                  Learn More
                </Button>
              </Tooltip>
            </Flexbox>
          </Flexbox>
        }
      >
        <Button size="large" type="primary">
          Click to Open
        </Button>
      </Popover>
    </Flexbox>
  );
};
