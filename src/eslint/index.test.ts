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
    ["import { Alert } from 'antd';", 'no longer ships antd'],
    ["import Alert from 'antd/es/alert';", 'no longer ships antd'],
    ["import Menu from 'rc-menu';", 'no longer ships antd'],
    ["import { createStaticStyles } from 'antd-style';", 'instead of antd-style'],
    ["import { LoadingOutlined } from '@ant-design/icons';", '@ant-design packages'],
  ])('rejects %s', (code, message) => {
    expect(lint(code)).toEqual([
      expect.objectContaining({
        message: expect.stringContaining(message),
        ruleId: 'no-restricted-imports',
        severity: 2,
      }),
    ]);
  });

  it.each([
    "import { Alert, Button, Form, Text } from '@lobehub/ui';",
    "import { Button } from '@lobehub/ui/base-ui';",
    "import { Form } from '@lobehub/ui/base-ui/form';",
  ])('allows %s', (code) => {
    expect(lint(code)).toEqual([]);
  });
});
