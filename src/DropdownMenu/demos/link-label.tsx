import { Button, DropdownMenu, Icon, type MenuProps } from '@lobehub/ui';
import { Book, Feather, FileClock, FlaskConical, Mail, MessageCircle } from 'lucide-react';
import { useMemo } from 'react';

export default () => {
  const helpMenuItems: MenuProps['items'] = useMemo(
    () => [
      {
        icon: <Icon icon={Book} />,
        key: 'docs',
        label: (
          <a href="https://example.com/docs" rel="noopener noreferrer" target="_blank">
            Docs (link label)
          </a>
        ),
      },
      {
        icon: <Icon icon={Feather} />,
        key: 'feedback',
        label: 'Feedback',
      },
      {
        icon: <Icon icon={MessageCircle} />,
        key: 'community',
        label: (
          <a href="https://example.com/community" rel="noopener noreferrer" target="_blank">
            Community (link label)
          </a>
        ),
      },
      {
        icon: <Icon icon={Mail} />,
        key: 'email',
        label: (
          <a href="mailto:support@example.com" rel="noopener noreferrer" target="_blank">
            Email (link label)
          </a>
        ),
      },
      {
        type: 'divider',
      },
      {
        icon: <Icon icon={FileClock} />,
        key: 'changelog',
        label: 'Changelog',
      },
      {
        icon: <Icon icon={FlaskConical} />,
        key: 'labs',
        label: 'Labs',
      },
    ],
    [],
  );

  return (
    <DropdownMenu nativeButton items={helpMenuItems}>
      <Button aria-label="Open help menu" type="primary">
        Open help menu
      </Button>
    </DropdownMenu>
  );
};
