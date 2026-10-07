import { RotateCcwIcon } from 'lucide-react';

import ActionIcon from '@/ActionIcon';

import { CodeDiff } from '../CodeDiff';

const oldCode = `export const BASE_URL = 'https://api.example.com/v1';

export const getProfileUrl = (id: string) => \`\${BASE_URL}/users/\${id}\`;`;

const newCode = `export const BASE_URL = 'https://api.example.com/v2';

export const getProfileUrl = (id: string) => \`\${BASE_URL}/profiles/\${id}\`;`;

export default () => {
  return (
    <CodeDiff
      fullFeatured
      fileName="api.ts"
      language="typescript"
      newContent={newCode}
      oldContent={oldCode}
      actionsRender={({ newContent, oldContent, originalNode }) => (
        <>
          {originalNode}
          <ActionIcon
            icon={RotateCcwIcon}
            size="small"
            onClick={() => alert(`old: ${oldContent.length}, new: ${newContent.length}`)}
          />
        </>
      )}
    />
  );
};
