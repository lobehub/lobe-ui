import { toast, ToastHost } from '@lobehub/ui';
import { Form, Input } from '@lobehub/ui/base-ui';

export default () => (
  <>
    <Form
      style={{ maxWidth: 640, paddingInline: 16 }}
      variant={'outlined'}
      onFinish={(values) => {
        toast.success(JSON.stringify(values));
      }}
    >
      <Form.Group collapsible title={'Account'} variant={'outlined'}>
        <Form.Field
          required
          desc={'Used for sign-in and notifications'}
          label={'Email'}
          minWidth={280}
          name={'email'}
          validate={(value) =>
            typeof value === 'string' && value.includes('@') ? null : 'Please enter a valid email'
          }
        >
          <Input placeholder={'you@example.com'} type={'email'} />
        </Form.Field>
        <Form.Field divider label={'Username'} minWidth={280} name={'username'}>
          <Input placeholder={'innei'} />
        </Form.Field>
      </Form.Group>
      <Form.Footer>
        <button type={'submit'}>Submit</button>
      </Form.Footer>
    </Form>
    <ToastHost />
  </>
);
