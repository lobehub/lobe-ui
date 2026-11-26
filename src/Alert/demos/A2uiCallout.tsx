import { Alert } from '@lobehub/ui';

// Sample data from the A2UI playground Callout (CopilotKit a2ui-playground, MIT).
export default () => (
  <Alert
    action={{ label: 'Learn more', onClick: () => {} }}
    description="Fixed-schema surfaces paint as soon as the data lands. Use them for the requests you see every day."
    title="Tip"
    variant="a2ui-callout"
  />
);
