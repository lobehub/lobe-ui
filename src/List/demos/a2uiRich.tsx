import { List } from '@lobehub/ui';
import { Calendar, HardDrive, Users } from 'lucide-react';

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <List
      items={['Connect your repository', 'Pick a framework preset', 'Deploy the main branch']}
      variant="a2ui"
    />
    <List
      marker="none"
      variant="a2ui"
      items={[
        {
          description: '6 seats left on the Team plan',
          icon: Users,
          key: 'seats',
          label: 'Seats',
          value: '24 of 30',
        },
        {
          description: 'Of 100 GB included',
          icon: HardDrive,
          key: 'storage',
          label: 'Storage',
          value: '61 GB',
        },
        { icon: Calendar, key: 'renews', label: 'Renews', value: 'Dec 1' },
      ]}
    />
    <List
      connector="solid"
      marker="none"
      variant="a2ui"
      items={[
        { description: 'Mon, Nov 24 · 09:12', key: 'placed', label: 'Order placed' },
        { description: 'Tue, Nov 25 · 14:40', key: 'packed', label: 'Packed' },
        { description: 'Today · 08:05', key: 'out', label: 'Out for delivery' },
      ]}
    />
  </div>
);
