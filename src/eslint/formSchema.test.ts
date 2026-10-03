// @vitest-environment node

import { Linter } from 'eslint';

import { formSchemaRules } from './index';

const lint = (code: string) => {
  const linter = new Linter({ configType: 'flat' });
  return linter.verify(code, {
    ...formSchemaRules,
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: { ecmaFeatures: { jsx: true } },
      sourceType: 'module',
    },
  } as Linter.Config);
};

const RULE = '@lobehub/ui/no-inline-form-schema';

describe('no-inline-form-schema', () => {
  it('flags a schema built inline in a validate prop', () => {
    expect(lint('const a = <Form.Field name="email" validate={z.string().email()} />;')).toEqual([
      expect.objectContaining({ ruleId: RULE }),
    ]);
  });

  it('flags a schema built inline in useForm options', () => {
    expect(
      lint('const C = () => { const form = useForm({ schema: z.object({ a: z.string() }) }); };'),
    ).toEqual([expect.objectContaining({ ruleId: RULE })]);
  });

  it('allows a module-level schema reference', () => {
    expect(
      lint(
        'const emailSchema = z.string().email();\nconst a = <Form.Field name="email" validate={emailSchema} />;\nconst schema = z.object({});\nconst C = () => useForm({ schema });',
      ),
    ).toEqual([]);
  });

  it('ignores validate on unrelated calls and function validators', () => {
    expect(
      lint(
        'const a = <Form.Field name="slug" validate={checkSlug} />;\nfoo({ schema: makeSchema() });',
      ),
    ).toEqual([]);
  });
});
