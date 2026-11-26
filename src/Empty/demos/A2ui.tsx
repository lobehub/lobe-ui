import { Empty } from '@lobehub/ui';

// Sample data from the A2UI playground EmptyState (CopilotKit a2ui-playground, MIT).
export default () => (
  <Empty
    action={{ label: 'Create invoice', onClick: () => {} }}
    description="Invoices appear here once your first billing cycle closes."
    title="No invoices yet"
    variant="a2ui"
  />
);
