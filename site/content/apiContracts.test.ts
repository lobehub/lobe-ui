// @vitest-environment node

import path from 'node:path';

import { extractComponentApi } from '../compiler/api/extractComponent';

const root = path.resolve(import.meta.dirname, '../..');

describe('generated API runtime defaults', () => {
  it.each([
    ['src/ActionIconGroup/index.mdx', 'ActionIconGroup', 'horizontal', 'true'],
    ['src/EditableText/index.mdx', 'EditableText', 'gap', '8'],
    ['src/EditableText/index.mdx', 'EditableText', 'variant', '"borderless"'],
    ['src/ImageSelect/index.mdx', 'ImageSelect', 'height', '86'],
    ['src/ImageSelect/index.mdx', 'ImageSelect', 'width', '144'],
    ['src/SortableList/index.mdx', 'SortableList', 'gap', '8'],
    ['src/base-ui/Select/index.mdx', 'Select', 'listHeight', '512'],
    ['src/chat/ChatHeader/index.mdx', 'ChatHeader', 'gap', '16'],
    ['src/chat/ChatItem/index.mdx', 'ChatItem', 'showAvatar', 'true'],
    ['src/chat/ChatList/index.mdx', 'ChatList', 'variant', '"bubble"'],
  ])(
    'documents the %s %s.%s default from runtime behavior',
    (document, name, property, expected) => {
      const component = extractComponentApi({
        documentPath: path.resolve(root, document),
        name,
        tsconfigPath: path.resolve(root, 'tsconfig.json'),
      });

      expect(component.properties.find(({ name }) => name === property)?.defaultValue).toBe(
        expected,
      );
    },
  );

  it('resolves base-ui Popover from the documented public package barrel', () => {
    const component = extractComponentApi({
      documentPath: path.resolve(root, 'src/base-ui/Popover/index.mdx'),
      from: '..',
      name: 'Popover',
      tsconfigPath: path.resolve(root, 'tsconfig.json'),
    });

    expect(component.source.file).toMatch(/src\/base-ui\/Popover\/Popover\.tsx$/);
  });
});
