// @vitest-environment node

import { Linter } from 'eslint';

import { restrictedImports } from './index';

const lint = (code: string) => {
  const linter = new Linter({ configType: 'flat' });

  return linter.verify(code, {
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      'no-restricted-imports': restrictedImports.rules['no-restricted-imports'] as Linter.RuleEntry,
    },
  });
};

describe('restrictedImports', () => {
  it.each([
    [
      '@lobehub/ui root',
      "import { Alert } from '@lobehub/ui';",
      'The antd-based wrapper is deprecated.',
    ],
    ['antd', "import { Alert } from 'antd';", 'Direct antd import is deprecated.'],
    [
      'antd component path',
      "import Alert from 'antd/es/alert';",
      'Direct antd component import is deprecated.',
    ],
  ])('rejects Alert from %s', (_, code, message) => {
    expect(lint(code)).toEqual([
      expect.objectContaining({
        message: expect.stringContaining(message),
        ruleId: 'no-restricted-imports',
        severity: 2,
      }),
    ]);
  });

  it.each([
    'ActionIcon',
    'Avatar',
    'Dropdown',
    'FormTitle',
    'InputOPT',
    'Skeleton',
    'SkeletonParagraph',
    'Switch',
    'Tag',
    'Text',
  ])('rejects the migrated %s wrapper', (name) => {
    expect(lint(`import { ${name} } from '@lobehub/ui';`)).toEqual([
      expect.objectContaining({ ruleId: 'no-restricted-imports', severity: 2 }),
    ]);
  });

  it('rejects the antd skeleton path', () => {
    expect(lint("import Skeleton from 'antd/es/skeleton';")).toEqual([
      expect.objectContaining({ ruleId: 'no-restricted-imports', severity: 2 }),
    ]);
  });

  it.each(['Alert', 'Skeleton'])('allows %s from the Base UI entrypoint', (name) => {
    expect(lint(`import { ${name} } from '@lobehub/ui/base-ui';`)).toEqual([]);
  });
});
