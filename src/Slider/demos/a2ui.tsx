import { Slider } from '@lobehub/ui';

// Sample data from the A2UI standard `Slider` (CopilotKit Gen UI 2.0, MIT).
export default () => (
  <Slider defaultValue={1800} label="Monthly budget" max={5000} min={0} step={100} variant="a2ui" />
);
