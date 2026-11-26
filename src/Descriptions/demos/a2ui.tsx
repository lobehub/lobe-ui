import { Descriptions } from '@lobehub/ui';

// Sample data from the A2UI playground KeyValueList (CopilotKit a2ui-playground, MIT).
export default () => (
  <Descriptions
    title="Order #A-20481"
    variant="a2ui"
    items={[
      { children: 'Oct 14, 2026', hint: '9:42 AM PT', label: 'Placed' },
      { children: 3, label: 'Items' },
      { children: 'Express, 2 days', label: 'Shipping' },
      { children: '$218.00', label: 'Subtotal' },
      { children: '$236.40', hint: 'Incl. $18.40 tax', label: 'Total' },
    ]}
  />
);
