import { createLucideIcon } from 'lucide-react';

import { KeyMapEnum } from '@/Hotkey/const';

const RightDoubleClickIcon = createLucideIcon(KeyMapEnum.RightDoubleClick, [
  [
    'path',
    {
      d: 'M12 3a7 7 0 017 7v4a7 7 0 11-14 0v-4',
      key: '1',
    },
  ],
  [
    'path',
    {
      d: 'M12 3v8h6.5M22 9.333C22 6.36 20.509 3.71 18.186 2M6.5 2h1.25C8.44 2 9 2.56 9 3.25v0c0 .69-.56 1.25-1.25 1.25v0c-.69 0-1.25.56-1.25 1.25V7H9M1 4l3 3M4 4L1 7',
      key: '2',
    },
  ],
]);

RightDoubleClickIcon.displayName = 'RightDoubleClickIcon';

export default RightDoubleClickIcon;
