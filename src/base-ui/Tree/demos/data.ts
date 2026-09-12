import type { TreeDataNode } from '@lobehub/ui/base-ui';

export const files: TreeDataNode[] = [
  {
    children: [
      {
        children: [
          {
            children: [
              { key: 'Tree.tsx', title: 'Tree.tsx' },
              { key: 'TreeNode.tsx', title: 'TreeNode.tsx' },
              { key: 'utils.ts', title: 'utils.ts' },
              { key: 'style.ts', title: 'style.ts' },
            ],
            key: 'src/base-ui/Tree',
            title: 'Tree',
          },
          {
            children: [
              { key: 'Accordion.tsx', title: 'Accordion.tsx' },
              { key: 'atoms.tsx', title: 'atoms.tsx' },
            ],
            key: 'src/base-ui/Accordion',
            title: 'Accordion',
          },
          { key: 'index.ts', title: 'index.ts' },
        ],
        key: 'src/base-ui',
        title: 'base-ui',
      },
      { children: [{ key: 'Message.tsx', title: 'Message.tsx' }], key: 'src/chat', title: 'chat' },
    ],
    key: 'src',
    title: 'src',
  },
  { children: [{ key: 'docs/home', title: 'home' }], disabled: true, key: 'docs', title: 'docs' },
  { isLeaf: true, key: 'package.json', title: 'package.json' },
];
