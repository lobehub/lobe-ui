import { Agenda } from '@lobehub/ui';

// Sample data from the A2UI playground `Agenda` (CopilotKit a2ui-playground, MIT).
export default () => (
  <Agenda
    title="This week"
    days={[
      {
        date: '2026-10-15',
        events: [
          {
            location: 'Room 4B',
            time: '9:30 AM',
            title: 'Design review: billing page',
            tone: 'accent',
          },
          {
            location: 'Tartine, Mission St',
            time: '1:00 PM',
            title: 'Lunch with Priya',
            tone: 'positive',
          },
          { location: 'Zoom', time: '4:30 PM', title: 'Incident retro', tone: 'warning' },
        ],
        label: 'Today',
      },
      {
        date: '2026-10-16',
        events: [
          {
            location: 'Main conference room',
            time: '10:00 AM',
            title: 'Q4 planning',
            tone: 'info',
          },
          { time: '3:00 PM', title: '1:1 with Leo', tone: 'accent' },
        ],
      },
      { date: '2026-10-17', events: [] },
    ]}
  />
);
