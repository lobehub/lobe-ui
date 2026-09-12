import { Flexbox } from '@lobehub/ui';
import { Text, Tree, type TreeDataNode } from '@lobehub/ui/base-ui';

const task = (id: string, name: string, children?: TreeDataNode[]): TreeDataNode => ({
  children,
  key: id,
  title: (
    <Flexbox horizontal align="center" gap={8} style={{ minWidth: 0, width: '100%' }}>
      <Text fontSize={12} style={{ flex: 'none' }} type="secondary">
        {id}
      </Text>
      <Text ellipsis fontSize={13} style={{ flex: 1, minWidth: 0 }}>
        {name}
      </Text>
    </Flexbox>
  ),
});

const tasks: TreeDataNode[] = [
  task('LOBE-412', 'Research Collapsible height animation', [
    task('LOBE-413', 'Compare with the Accordion panel-height approach'),
  ]),
  task('LOBE-414', 'Implement flattenVisible / conductCheck', [
    task('LOBE-415', 'utils.test.ts'),
    task('LOBE-416', 'checkStrictly branch'),
  ]),
  task('LOBE-417', 'Keyboard navigation + roving tabindex'),
];

export default () => (
  <div style={{ maxWidth: 480, padding: 16 }}>
    <Tree blockNode defaultExpandAll showLine size="large" treeData={tasks} />
  </div>
);
