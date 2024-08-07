import { ActionIcon, Mermaid } from '@lobehub/ui';
import { AlertCircleIcon } from 'lucide-react';

import { code } from './data';

export default () => {
  return (
    <Mermaid
      actionsRender={({ originalNode, content, actionIconSize }) => {
        return (
          <>
            {originalNode}
            <ActionIcon
              icon={AlertCircleIcon}
              onClick={() => alert(content)}
              size={actionIconSize}
            />
          </>
        );
      }}
      fullFeatured
      style={{ width: '100%' }}
    >
      {code}
    </Mermaid>
  );
};
