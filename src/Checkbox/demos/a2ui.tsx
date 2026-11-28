import { Checkbox } from '@lobehub/ui';

// Sample data from the A2UI standard `CheckBox` (CopilotKit Gen UI 2.0, MIT).
export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Checkbox defaultChecked variant="a2ui">
      Email me a weekly summary
    </Checkbox>
    <Checkbox variant="a2ui">Include archived projects</Checkbox>
    <Checkbox defaultChecked shape="square" variant="a2ui">
      Square box
    </Checkbox>
  </div>
);
