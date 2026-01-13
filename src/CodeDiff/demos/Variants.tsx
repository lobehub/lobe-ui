import { Flexbox } from '@/Flex';

import { CodeDiff } from '../CodeDiff';

const oldCode = `const x = 1;`;
const newCode = `const x = 2;`;

export default () => {
  return (
    <Flexbox gap={16}>
      <CodeDiff
        fileName="filled.ts"
        language="typescript"
        newContent={newCode}
        oldContent={oldCode}
        variant="filled"
      />
      <CodeDiff
        fileName="outlined.ts"
        language="typescript"
        newContent={newCode}
        oldContent={oldCode}
        variant="outlined"
      />
      <CodeDiff
        fileName="borderless.ts"
        language="typescript"
        newContent={newCode}
        oldContent={oldCode}
        variant="borderless"
      />
    </Flexbox>
  );
};
