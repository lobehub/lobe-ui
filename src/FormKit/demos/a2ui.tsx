import { Input } from '@lobehub/ui';
import { Form, useForm } from '@lobehub/ui/form';

// Sample data from the A2UI standard `Form` (CopilotKit Gen UI 2.0, MIT).
export default () => {
  const form = useForm({ initialValues: { email: '' }, onSubmit: () => {} });
  return (
    <Form aria-label="Newsletter" form={form} variant="a2ui">
      <Form.Field label="Email" name="email">
        <Input placeholder="name@company.com" type="email" variant="a2ui" />
      </Form.Field>
      <Form.SubmitFooter enableReset={false} texts={{ submit: 'Subscribe' }} />
    </Form>
  );
};
