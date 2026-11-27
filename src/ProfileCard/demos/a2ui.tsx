import { ProfileCard } from '@lobehub/ui';

import { profile } from './data';

export default () => <ProfileCard {...profile} style={{ maxWidth: 560 }} variant="a2ui" />;
