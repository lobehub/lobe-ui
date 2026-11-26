import { Progress } from '@lobehub/ui';

// Sample data from the A2UI playground RadialProgress (CopilotKit a2ui-playground, MIT).
export default () => (
  <Progress
    label="Sprint 42 completion"
    percent={68}
    status="success"
    type="circle"
    variant="a2ui"
  />
);
