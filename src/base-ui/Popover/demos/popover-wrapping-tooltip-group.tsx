import { Button, Flexbox, Popover, Tooltip, TooltipGroup } from '@lobehub/ui';
import { HelpCircle, Info } from 'lucide-react';

/**
 * Edge case: Popover wraps Tooltip inside a TooltipGroup (singleton mode).
 * Hover shows the shared tooltip; click opens the popover.
 */
export default () => {
  return (
    <Flexbox align="center" gap={16} height={280} justify="center" style={{ padding: 24 }}>
      <TooltipGroup>
        <Flexbox horizontal gap={12}>
          <Popover
            arrow
            placement="bottom"
            trigger="click"
            content={
              <Flexbox gap={8} style={{ padding: '12px 16px', width: 260 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Popover A</div>
                <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 13, lineHeight: 1.6 }}>
                  This popover opens on click, while the tooltip (singleton) shows on hover.
                </div>
              </Flexbox>
            }
          >
            <Tooltip title="Tooltip A (singleton)">
              <Button icon={<HelpCircle size={16} />} type="primary">
                Button A
              </Button>
            </Tooltip>
          </Popover>

          <Popover
            arrow
            placement="bottom"
            trigger="click"
            content={
              <Flexbox gap={8} style={{ padding: '12px 16px', width: 260 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Popover B</div>
                <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 13, lineHeight: 1.6 }}>
                  Hovering between buttons smoothly transitions the shared tooltip. Clicking still
                  opens each button's own popover.
                </div>
              </Flexbox>
            }
          >
            <Tooltip title="Tooltip B (singleton)">
              <Button icon={<Info size={16} />}>Button B</Button>
            </Tooltip>
          </Popover>
        </Flexbox>
      </TooltipGroup>
    </Flexbox>
  );
};
