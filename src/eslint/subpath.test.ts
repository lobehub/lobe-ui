// @vitest-environment node

import { Linter } from 'eslint';

import { subpathRules } from './index';

const config = {
  ...subpathRules,
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
} as Linter.Config;

const fix = (code: string) => new Linter({ configType: 'flat' }).verifyAndFix(code, config);

const RULE = '@lobehub/ui/no-base-ui-subpath';

describe('no-base-ui-subpath', () => {
  it.each([
    ["import { Button } from '@lobehub/ui/base-ui';", "import { Button } from '@lobehub/ui';"],
    [
      "import { Form } from '@lobehub/ui/base-ui/form';",
      "import { Form } from '@lobehub/ui/form';",
    ],
    ["export { Tag } from '@lobehub/ui/base-ui';", "export { Tag } from '@lobehub/ui';"],
    ["export * from '@lobehub/ui/base-ui';", "export * from '@lobehub/ui';"],
    ["const m = import('@lobehub/ui/base-ui');", "const m = import('@lobehub/ui');"],
  ])('rewrites %s', (code, output) => {
    expect(new Linter({ configType: 'flat' }).verify(code, config)).toEqual([
      expect.objectContaining({ ruleId: RULE, severity: 2 }),
    ]);
    expect(fix(code)).toMatchObject({ fixed: true, messages: [], output });
  });

  it.each([
    "import { Button } from '@lobehub/ui';",
    "import { Form } from '@lobehub/ui/form';",
    "import { Menu } from '@base-ui/react/menu';",
    "import { Thing } from '@lobehub/ui/base-ui-extra';",
  ])('allows %s', (code) => {
    expect(new Linter({ configType: 'flat' }).verify(code, config)).toEqual([]);
  });
});
