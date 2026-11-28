import { WeatherCard } from '@lobehub/ui';

import { weather } from './data';

export default () => <WeatherCard {...weather} style={{ maxWidth: 560 }} variant="a2ui" />;
