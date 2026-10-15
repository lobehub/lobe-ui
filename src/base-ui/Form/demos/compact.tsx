import { Form, Input, Switch } from '@lobehub/ui/base-ui';

/**
 * Narrow containers (Drawer / Modal): `compact` tightens the spacing (12px gap, 10px field
 * padding; or set `gap` / `itemPadding`). Inputs stack under their label with
 * `layout="vertical"`, while a Switch stays inline via a field-level `layout="horizontal"`.
 */
export default () => (
  <Form compact layout={'vertical'} style={{ maxWidth: 380, padding: 16 }}>
    <Form.Field label={'Name'} name={'name'}>
      <Input placeholder={'Jane Doe'} />
    </Form.Field>
    <Form.Field label={'Email'} name={'email'}>
      <Input placeholder={'you@example.com'} type={'email'} />
    </Form.Field>
    <Form.Field
      desc={'Members can sign in'}
      label={'Enabled'}
      layout={'horizontal'}
      name={'enabled'}
    >
      <Switch />
    </Form.Field>
  </Form>
);
