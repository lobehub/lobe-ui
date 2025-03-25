import { createLucideIcon } from 'lucide-react';

import { KeyMap } from '../type';

const Icon = createLucideIcon(KeyMap.RightClick, [
  [
    'path',
    {
      d: 'M19 10a7 7 0 10-14 0v4a7 7 0 1014 0v-4zM22 9.333C22 6.36 20.509 3.71 18.186 2',
      key: '1',
    },
  ],
  [
    'path',
    {
      d: 'M12 4v7h6',
      key: '2',
    },
  ],
]);

export default Icon;
