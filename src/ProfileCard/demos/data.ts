import type { ProfileCardProps } from '@lobehub/ui';

// Sample data from the A2UI playground `ProfileCard` (CopilotKit a2ui-playground, MIT).
export const profile: ProfileCardProps = {
  avatar: 'https://i.pravatar.cc/150?img=47',
  bio: 'Builds the realtime sync layer and mentors the platform team. Previously led infra at a payments startup.',
  company: 'Northwind',
  email: 'maya@northwind.dev',
  location: 'Seattle, WA',
  name: 'Maya Chen',
  phone: '+1 206 555 0142',
  role: 'Staff Engineer',
  stats: [
    { label: 'Projects', value: '24' },
    { label: 'Reviews', value: '1.2k' },
    { label: 'Years', value: '9' },
  ],
  tags: ['Distributed systems', 'Rust', 'TypeScript'],
  website: 'https://mayachen.dev',
};
