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
  it('rejects thinking-orbs', () => {
    expect(lint("import ThinkingOrbs from 'thinking-orbs';")).toEqual([
      expect.objectContaining({
        message: expect.stringContaining('Spin variant="network"'),
        ruleId: 'no-restricted-imports',
        severity: 2,
      }),
    ]);
  });

  it.each([
    "import { Alert, Button, Form, Text } from '@lobehub/ui';",
    "import { Button } from '@lobehub/ui';",
    "import { Form } from '@lobehub/ui/form';",
    "import { Alert } from 'antd';",
  ])('allows %s', (code) => {
    expect(lint(code)).toEqual([]);
  });
});
