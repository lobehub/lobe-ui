import { Steps } from '@lobehub/ui';
import { Truck } from 'lucide-react';

// Sample data from the A2UI playground Timeline (CopilotKit a2ui-playground, MIT).
export default () => (
  <Steps
    variant="a2ui"
    items={[
      { status: 'finish', time: 'Oct 14, 9:42 AM', title: 'Order confirmed' },
      {
        description: '3 items in one box, 2.4 kg.',
        status: 'finish',
        time: 'Oct 14, 4:10 PM',
        title: 'Packed at Reno warehouse',
      },
      {
        description: 'Left the Sacramento hub, next stop Oakland.',
        icon: <Truck size={12} />,
        status: 'process',
        time: 'Oct 15, 7:05 AM',
        title: 'In transit',
      },
      { status: 'wait', time: 'Est. Oct 16', title: 'Out for delivery' },
      { status: 'wait', title: 'Delivered' },
    ]}
  />
);
