import { ActionIcon, Highlighter } from '@lobehub/ui';
import { AlertCircleIcon } from 'lucide-react';

import { code } from './data';

export default () => {
  return (
    <Highlighter
      fullFeatured
      language={'tsx'}
      actionsRender={({ content, actionIconSize, language, originalNode }) => {
        return (
          <>
            {originalNode}
            <ActionIcon
              icon={AlertCircleIcon}
              size={actionIconSize}
              onClick={() => alert(language + content)}
            />
          </>
        );
      }}
    >
      {code}
    </Highlighter>
  );
};
