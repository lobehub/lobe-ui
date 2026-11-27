import { EventCard, toast } from '@lobehub/ui';

import { event } from './data';

export default () => (
  <EventCard {...event} style={{ maxWidth: 560 }} onAction={() => toast.success('RSVP sent')} />
);
