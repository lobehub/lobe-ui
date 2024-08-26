import { ActionIcon, Highlighter } from '@unitalkai/ui';
import { AlertCircleIcon } from 'lucide-react';

import { code } from './data';

export default () => {
  return (
    <Highlighter
      actionsRender={({ content, actionIconSize, language, originalNode }) => {
        return (
          <>
            {originalNode}
            <ActionIcon
              icon={AlertCircleIcon}
              onClick={() => alert(language + content)}
              size={actionIconSize}
            />
          </>
        );
      }}
      fullFeatured
      language={'tsx'}
      style={{ width: '100%' }}
    >
      {code}
    </Highlighter>
  );
};
