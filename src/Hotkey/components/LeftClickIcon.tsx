import { createLucideIcon } from 'lucide-react';

import { KeyMap } from '../type';

const Icon = createLucideIcon(KeyMap.LeftClick, [
  [
    'path',
    {
      d: 'M19 10a7 7 0 10-14 0v4a7 7 0 1014 0v-4zM2 9.333C2 6.36 3.491 3.71 5.814 2',
      key: '1',
    },
  ],
  [
    'path',
    {
      d: 'M12 4v7H6',
      key: '2',
    },
  ],
]);

export default Icon;
