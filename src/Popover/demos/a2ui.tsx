import { Popover } from '@lobehub/ui';

// Sample data from the A2UI standard `Popover` (CopilotKit Gen UI, MIT).
export default () => (
  <Popover content="Anyone who signed in during the billing month." variant="a2ui">
    <span style={{ cursor: 'pointer' }}>What counts as an active seat?</span>
  </Popover>
);
