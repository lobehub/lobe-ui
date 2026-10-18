import { stableClasses } from '@/utils/bem';

export const mdxFileTreeClasses = stableClasses({
  block: 'mdx-file-tree',
  dataAttributes: ['open'],
  elements: ['file', 'folder', 'folder-label', 'folder-children', 'icon', 'name'],
});
