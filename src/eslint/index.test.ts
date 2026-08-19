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

  it('allows Alert from the Base UI entrypoint', () => {
    expect(lint("import { Alert } from '@lobehub/ui/base-ui';")).toEqual([]);
  });
});
