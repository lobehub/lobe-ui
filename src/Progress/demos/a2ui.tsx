import { Progress } from '@lobehub/ui';

// Sample data from the A2UI playground Progress (CopilotKit a2ui-playground, MIT).
export default () => (
  <Progress
    caption="72 GB of 100 GB, resets Nov 1"
    label="Storage used"
    percent={72}
    variant="a2ui"
  />
);
