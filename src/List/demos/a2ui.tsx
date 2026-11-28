import { List } from '@lobehub/ui';
import { Calendar, HardDrive, Users } from 'lucide-react';

// Sample data from the A2UI playground `List` and `ListItem` (CopilotKit standard catalog, MIT).
export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <List
      items={['Connect your repository', 'Pick a framework preset', 'Deploy the main branch']}
      marker="number"
      variant="a2ui"
    />
    <List
      marker="none"
      variant="a2ui"
      items={[
        { icon: Users, key: 'seats', label: 'Seats', value: '24 of 30' },
        { icon: HardDrive, key: 'storage', label: 'Storage', value: '61 GB' },
        { icon: Calendar, key: 'renews', label: 'Renews', value: 'Dec 1' },
      ]}
    />
  </div>
);
