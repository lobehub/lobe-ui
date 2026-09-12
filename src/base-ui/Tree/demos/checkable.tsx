import { Tree } from '@lobehub/ui/base-ui';
import { useState } from 'react';

import { files } from './data';

export default () => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>(['src/base-ui/Tree']);
  return (
    <div style={{ maxWidth: 360, padding: 16 }}>
      <Tree
        checkable
        defaultExpandAll
        checkedKeys={checkedKeys}
        treeData={files}
        onCheck={setCheckedKeys}
      />
      <pre style={{ fontSize: 12, marginTop: 12, opacity: 0.65 }}>
        {JSON.stringify(checkedKeys, null, 2)}
      </pre>
    </div>
  );
};
