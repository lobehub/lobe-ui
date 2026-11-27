import { Checkbox, Input, Select, TextArea } from '@lobehub/ui';
import { Form, useForm } from '@lobehub/ui/form';

export default () => {
  const form = useForm({
    initialValues: { agree: true, email: '', message: '', name: '', size: 'm' },
    onSubmit: () => {},
  });
  return (
    <Form aria-label="Request a demo" form={form} variant="a2ui">
      <Form.Field label="Full name" name="name">
        <Input placeholder="Ada Lovelace" variant="a2ui" />
      </Form.Field>
      <Form.Field label="Work email" name="email">
        <Input placeholder="name@company.com" type="email" variant="a2ui" />
      </Form.Field>
      <Form.Field label="Team size" name="size">
        <Select
          variant="a2ui"
          options={[
            { label: '1-10', value: 's' },
            { label: '11-50', value: 'm' },
            { label: '51+', value: 'l' },
          ]}
        />
      </Form.Field>
      <Form.Field label="What do you want to see?" name="message">
        <TextArea placeholder="Tell us in a sentence or two" rows={3} variant="a2ui" />
      </Form.Field>
      <Form.Field bare name="agree">
        <Checkbox variant="a2ui">Email me product updates</Checkbox>
      </Form.Field>
      <Form.SubmitFooter texts={{ reset: 'Cancel', submit: 'Request demo' }} />
    </Form>
  );
};
