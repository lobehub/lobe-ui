import { EventCard, toast } from '@lobehub/ui';

import { event } from './data';

export default () => (
  <EventCard
    {...event}
    style={{ maxWidth: 560 }}
    variant="a2ui"
    onAction={() => toast.success('RSVP sent')}
  />
);
