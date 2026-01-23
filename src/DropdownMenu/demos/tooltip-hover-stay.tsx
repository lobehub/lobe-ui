import { Button, DropdownMenu, Flexbox, Icon, Tooltip, TooltipGroup } from '@lobehub/ui';
import { Info } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Flexbox align="center" height={280} justify="center" style={{ padding: 24 }}>
      <TooltipGroup>
        <DropdownMenu
          items={[
            {
              key: 'info',
              label: (
                <Flexbox gap={12} horizontal style={{ padding: '4px 0' }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Hover Tooltip shouldn&apos;t close DropdownMenu
                  </div>
                </Flexbox>
              ),
            },
            {
              key: 'description',
              label: (
                <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12, lineHeight: 1.6 }}>
                  Move mouse onto tooltip content and keep it open.
                </div>
              ),
            },
            {
              type: 'divider',
            },
            {
              closeOnClick: false,
              key: 'action',
              label: (
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
                    <Button icon={<Icon icon={Info} size={16} />} size="small">
                      Hover me
                    </Button>
                  </Tooltip>
                  <div style={{ fontSize: 12 }}>
                    DropdownMenu: {dropdownOpen ? 'open' : 'closed'} / Tooltip:{' '}
                    {tooltipOpen ? 'open' : 'closed'}
                  </div>
                </Flexbox>
              ),
            },
          ]}
          onOpenChange={(open) => setDropdownOpen(open)}
          open={dropdownOpen}
          placement="bottomLeft"
          trigger="hover"
        >
          <Button size="large" type="primary">
            Hover to Open
          </Button>
        </DropdownMenu>
      </TooltipGroup>
    </Flexbox>
  );
};
