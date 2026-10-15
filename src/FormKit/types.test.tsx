import { z } from 'zod';

import FormField from './Field';
import Form from './Form';
import type { FieldPath, FieldPathValue } from './type';
import { useForm } from './useForm';
import { useWatch } from './useWatch';

type Values = { agent: { model: string }; list: { key: string }[]; n: number };

const schema = z.object({ email: z.string().email(), tags: z.array(z.string()) });

export const typeContracts = () => {
  const paths: FieldPath<Values>[] = ['agent', 'agent.model', 'list', 'list.0', 'list.0.key', 'n'];
  // @ts-expect-error unknown nested key
  const badPath: FieldPath<Values> = 'agent.nope';

  const model: FieldPathValue<Values, 'agent.model'> = 'gpt';
  // @ts-expect-error a string path value is not a number
  const wrongValue: FieldPathValue<Values, 'agent.model'> = 1;

  const SchemaHost = () => {
    const form = useForm({ schema });
    form.setValue('email', 'a@b.c');
    // @ts-expect-error path not in the schema
    form.setValue('nope', 'x');
    // @ts-expect-error value type follows the schema
    form.setValue('tags', 'not-an-array');
    const email: string = useWatch(form, 'email');
    return (
      <Form
        form={form}
        itemsType="flat"
        items={[
          { children: <input />, name: 'email' },
          // @ts-expect-error items names follow the form type
          { children: <input />, name: 'missing' },
        ]}
      >
        <FormField<z.input<typeof schema>> name="tags">
          <input />
        </FormField>
        {/* @ts-expect-error explicit Field generic constrains name */}
        <FormField<z.input<typeof schema>> name="missing">
          <input />
        </FormField>
        {email}
      </Form>
    );
  };

  return { badPath, model, paths, SchemaHost, wrongValue };
};

describe('type contracts', () => {
  it('compile-time checks live in typeContracts (tsc fails on violations)', () => {
    expect(typeof typeContracts).toBe('function');
  });
});
