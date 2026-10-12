import { checkPackageJson } from './packageJson';

const pkg = (deps: Record<string, string>, dev: Record<string, string> = {}) =>
  JSON.stringify({ dependencies: deps, devDependencies: dev, name: 'app' }, null, 2);

describe('checkPackageJson', () => {
  it('flags outdated and removed dependencies with their line', () => {
    const text = pkg(
      {
        '@lobehub/fluent-emoji': '^4.1.0',
        '@lobehub/icons': '^5.0.0',
        '@lobehub/ui': '^5.57.3',
        'antd': '^6.0.0',
        'antd-style': '^4.1.0',
        'motion': '^12.23.0',
        'react': '^19.0.0',
      },
      { '@ant-design/icons': '^6.0.0' },
    );
    expect(checkPackageJson(text, 'package.json').map((i) => `${i.line} ${i.message}`)).toEqual([
      '3 Bump `@lobehub/fluent-emoji` to ^5 (`@beta` during the beta).',
      '4 Bump `@lobehub/icons` to ^6 (`@beta` during the beta).',
      '5 Bump `@lobehub/ui` to ^6 (`@beta` during the beta).',
      '6 Remove `antd`: @lobehub/ui 6 does not use it.',
      '7 Remove `antd-style`: import its helpers from @lobehub/ui.',
      '8 Bump `motion` to ^13.',
      '12 Remove `@ant-design/icons`: @lobehub/ui 6 does not use it.',
    ]);
  });

  it('points at the entry inside the owning field', () => {
    const text = pkg({ react: '^19.0.0' }, { antd: '^6.0.0' }).replace(
      '"name"',
      '"peerDependencies": { "antd": "^6.0.0" },\n  "name"',
    );
    expect(checkPackageJson(text, 'package.json').map((i) => i.line)).toEqual([6, 8]);
  });

  it('accepts a migrated manifest', () => {
    expect(
      checkPackageJson(
        pkg({
          '@lobehub/icons': '^6.0.0-beta.1',
          '@lobehub/ui': '6.0.0-beta.1',
          'motion': '~13.4.0',
        }),
        'package.json',
      ),
    ).toEqual([]);
  });
});
