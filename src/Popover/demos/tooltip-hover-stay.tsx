import { Button, Flexbox, Popover, Tooltip, TooltipGroup } from '@lobehub/ui';
import { Info } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Flexbox align="center" height={280} justify="center" style={{ padding: 24 }}>
      <TooltipGroup>
        <Popover
          arrow
          content={
            <Flexbox gap={12} style={{ padding: '12px 16px', width: 260 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                Hover Tooltip shouldn&apos;t close Popover
              </div>
              <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12, lineHeight: 1.6 }}>
                Move mouse onto tooltip content and keep it open.
              </div>
              <Flexbox align="center" gap={8} horizontal>
                <Tooltip
                  onOpenChange={setTooltipOpen}
                  open={tooltipOpen}
                  title={
                    <div style={{ maxWidth: 220, padding: 4 }}>
                      Tooltip content area. Keep hovering here.
                    </div>
                  }
                >
                  <Button icon={<Info size={16} />} size="small">
                    Hover me
                  </Button>
                </Tooltip>
                <div style={{ fontSize: 12 }}>
                  Popover: {popoverOpen ? 'open' : 'closed'} / Tooltip:{' '}
                  {tooltipOpen ? 'open' : 'closed'}
                </div>
              </Flexbox>
            </Flexbox>
          }
          onOpenChange={setPopoverOpen}
          open={popoverOpen}
          placement="bottom"
          trigger="hover"
        >
          <Button size="large" type="primary">
            Hover to Open
          </Button>
        </Popover>
      </TooltipGroup>
    </Flexbox>
  );
};
