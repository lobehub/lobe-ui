import { toast, ToastHost } from '@lobehub/ui';
import { Checkbox, Input } from '@lobehub/ui/base-ui';
import { Form, useForm, useWatch } from '@lobehub/ui/base-ui/form';

type Values = { agree: boolean; confirm: string; email: string; password: string; slug: string };

const takenSlugs = new Set(['admin', 'lobehub']);
const checkSlug = async (value: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return takenSlugs.has(value) ? 'This slug is taken' : undefined;
};
const matchPassword = (value: string, values: Values) =>
  value === values.password ? undefined : 'Passwords do not match';

export default () => {
  const form = useForm<Values>({
    initialValues: { agree: false, confirm: '', email: '', password: '', slug: '' },
    onSubmit: (values) => {
      toast.success(`Welcome, ${values.email}`);
    },
  });
  const agree = useWatch(form, 'agree');

  return (
    <>
      <ToastHost />
      <Form form={form} layout={'vertical'} variant={'outlined'}>
        <Form.Group title={'Create account'}>
          <Form.Field required label={'Email'} name={'email'}>
            <Input placeholder={'you@example.com'} />
          </Form.Field>
          <Form.Field label={'Slug'} name={'slug'} validate={checkSlug} validateDebounce={300}>
            <Input placeholder={'try "admin"'} />
          </Form.Field>
          <Form.Field required label={'Password'} name={'password'}>
            <Input type={'password'} />
          </Form.Field>
          <Form.Field
            deps={['password']}
            label={'Confirm password'}
            name={'confirm'}
            validate={matchPassword}
          >
            <Input type={'password'} />
          </Form.Field>
          <Form.Field bare name={'agree'}>
            <Checkbox>I accept the terms</Checkbox>
          </Form.Field>
        </Form.Group>
        <Form.SubmitFooter saveButtonProps={{ disabled: !agree }} />
      </Form>
    </>
  );
};
