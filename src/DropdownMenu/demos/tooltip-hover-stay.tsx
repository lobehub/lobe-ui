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
          open={dropdownOpen}
          placement="bottomLeft"
          trigger="hover"
          items={[
            {
              key: 'info',
              label: (
                <Flexbox horizontal gap={12} style={{ padding: '4px 0' }}>
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
                <Flexbox horizontal align="center" gap={8}>
                  <Tooltip
                    open={tooltipOpen}
                    title={
                      <div style={{ maxWidth: 220, padding: 4 }}>
                        Tooltip content area. Keep hovering here.
                      </div>
                    }
                    onOpenChange={setTooltipOpen}
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
        >
          <Button size="large" type="primary">
            Hover to Open
          </Button>
        </DropdownMenu>
      </TooltipGroup>
    </Flexbox>
  );
};
