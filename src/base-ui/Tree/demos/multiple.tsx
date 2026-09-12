import { Tree } from '@lobehub/ui/base-ui';
import { useState } from 'react';

import { files } from './data';

export default () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  return (
    <div style={{ maxWidth: 360, padding: 16 }}>
      <Tree
        blockNode
        defaultExpandAll
        multiple
        selectedKeys={selectedKeys}
        treeData={files}
        onSelect={setSelectedKeys}
      />
      <pre style={{ fontSize: 12, marginTop: 12, opacity: 0.65 }}>
        {selectedKeys.join(', ') || 'Click, ⌘-click, or shift-click rows'}
      </pre>
    </div>
  );
};
