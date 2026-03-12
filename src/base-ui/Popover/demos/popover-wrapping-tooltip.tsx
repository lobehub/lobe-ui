import { Button, Flexbox, Popover, Tooltip } from '@lobehub/ui';
import { HelpCircle } from 'lucide-react';

/**
 * Edge case: Popover wraps Tooltip — the trigger of the Popover is a Tooltip-wrapped element.
 * Hover shows tooltip first; click (or hover, depending on trigger) opens the popover.
 */
export default () => {
  return (
    <Flexbox align="center" height={280} justify="center" style={{ padding: 24 }}>
      <Popover
        arrow
        placement="bottom"
        trigger="click"
        content={
          <Flexbox gap={8} style={{ padding: '12px 16px', width: 260 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Popover wrapping Tooltip</div>
            <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 13, lineHeight: 1.6 }}>
              The trigger is a button wrapped by Tooltip. Tooltip shows on hover; click opens this
              popover.
            </div>
          </Flexbox>
        }
      >
        <Tooltip title="Hover: tooltip · Click: popover">
          <Button icon={<HelpCircle size={16} />} size="large" type="primary">
            Hover for tooltip / Click for popover
          </Button>
        </Tooltip>
      </Popover>
    </Flexbox>
  );
};
