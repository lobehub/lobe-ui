import { toast, ToastHost } from '@lobehub/ui';
import { Form, Input, TextArea } from '@lobehub/ui/base-ui';
import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  bio: z.string().max(30, 'Keep the bio under 30 characters'),
  email: z.email('Please enter a valid email'),
  nickname: z.string().min(2, 'Nickname needs at least 2 characters'),
});

const nickname = schema.shape.nickname;

export default () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  return (
    <>
      <Form
        errors={errors}
        footer={<Form.SubmitFooter />}
        style={{ maxWidth: 640, paddingInline: 16 }}
        variant={'outlined'}
        onFinish={(values) => {
          const result = schema.safeParse(values);
          if (!result.success) {
            setErrors(z.flattenError(result.error).fieldErrors as Record<string, string[]>);
            return;
          }
          setErrors({});
          toast.success(JSON.stringify(result.data));
        }}
      >
        <Form.Group title={'Zod Schema'} variant={'outlined'}>
          <Form.Field
            desc={'Validated per-field via `validate` (onChange)'}
            label={'Nickname'}
            minWidth={280}
            name={'nickname'}
            validationMode={'onChange'}
            validate={(value) => {
              const result = nickname.safeParse(value);
              return result.success ? null : result.error.issues.map((issue) => issue.message);
            }}
          >
            <Input placeholder={'innei'} />
          </Form.Field>
          <Form.Field
            divider
            desc={'Validated by the form-level schema on submit'}
            label={'Email'}
            minWidth={280}
            name={'email'}
          >
            <Input placeholder={'you@example.com'} />
          </Form.Field>
          <Form.Field divider label={'Bio'} minWidth={280} name={'bio'}>
            <TextArea autoSize={{ maxRows: 4, minRows: 2 }} placeholder={'Say something short'} />
          </Form.Field>
        </Form.Group>
      </Form>
      <ToastHost />
    </>
  );
};
