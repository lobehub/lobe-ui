import { ActionIcon, Mermaid } from '@lobehub/ui';
import { AlertCircleIcon } from 'lucide-react';

import { code } from './data';

export default () => {
  return (
    <Mermaid
      fullFeatured
      style={{ width: '100%' }}
      actionsRender={({ originalNode, content, actionIconSize }) => {
        return (
          <>
            {originalNode}
            <ActionIcon
              icon={AlertCircleIcon}
              size={actionIconSize}
              onClick={() => alert(content)}
            />
          </>
        );
      }}
    >
      {code}
    </Mermaid>
  );
};
