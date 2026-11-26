import { Alert } from '@lobehub/ui';

// Sample data from the A2UI playground Alert (CopilotKit a2ui-playground, MIT).
export default () => (
  <Alert
    description="You will hit the request limit in about 3 days at the current rate."
    title="Usage at 92% of plan"
    type="warning"
    variant="a2ui"
  />
);
