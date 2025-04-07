import { memo } from 'react';

import ActionIconGroup, { type ActionIconGroupProps } from '@/ActionIconGroup';
import { useChatListActionsBar } from '@/hooks/useChatListActionsBar';

export interface ActionsBarProps extends ActionIconGroupProps {
  text?: {
    copy?: string;
    delete?: string;
    edit?: string;
    regenerate?: string;
  };
}

const ActionsBar = memo<ActionsBarProps>(({ text, ...rest }) => {
  const { regenerate, edit, copy, divider, del } = useChatListActionsBar(text);
  return (
    <ActionIconGroup
      items={[regenerate, edit]}
      menu={{
        items: [edit, copy, regenerate, divider, del],
      }}
      {...rest}
    />
  );
});

export default ActionsBar;
