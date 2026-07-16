import { createLegacyDemoId } from './legacyDumiIds';

describe('createLegacyDemoId', () => {
  it.each([
    ['src/Button/index.md', './demos/index.tsx', undefined, 'src-button-demo-demos'],
    ['src/Form/index.md', './demos/SubmitFooter.tsx', undefined, 'src-form-demo-submitfooter'],
    ['src/i18n/index.md', './demos/index.tsx', undefined, 'src-i-18-n-demo-demos'],
    ['src/café/index.md', './demos/index.tsx', undefined, 'src-cafe-demo-demos'],
    [
      'src/mdx/FileTree/index.md',
      './demos/index.tsx',
      'File, FileTree, Folder',
      'file, filetree, folder-demo-demos',
    ],
  ])('matches dumi for %s', (document, source, atomId, expected) => {
    expect(createLegacyDemoId({ atomId, document, source })).toBe(expected);
  });

  it('uses an explicit local ID before the demo filename', () => {
    expect(
      createLegacyDemoId({
        document: 'src/Button/index.md',
        explicitId: 'Primary Example',
        source: './demos/index.tsx',
      }),
    ).toBe('src-button-demo-primary example');
  });
});
