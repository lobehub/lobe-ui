import { Button, EmojiPicker, Icon, Tooltip } from '@lobehub/ui';
import { SunIcon } from 'lucide-react';

const LOGO = 'https://registry.npmmirror.com/@lobehub/assets-logo/1.2.0/files/assets/logo-3d.webp';

export default () => (
  <EmojiPicker
    customTabs={[
      {
        label: (
          <Tooltip title={'Custom'}>
            <Icon icon={SunIcon} size={{ size: 20, strokeWidth: 2.5 }} />
          </Tooltip>
        ),
        render: (handleAvatarChange) => (
          <Button onClick={() => handleAvatarChange(LOGO)}>Custom Tab</Button>
        ),
        value: 'custom',
      },
    ]}
  />
);
