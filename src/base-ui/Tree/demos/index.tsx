import { Tree } from '@lobehub/ui/base-ui';

import { files } from './data';

export default () => (
  <div style={{ maxWidth: 360, padding: 16 }}>
    <Tree
      blockNode
      showIcon
      defaultExpandedKeys={['src', 'src/base-ui']}
      defaultSelectedKeys={['src/base-ui']}
      treeData={files}
    />
  </div>
);
