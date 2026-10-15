import { Form } from '@lobehub/ui';
import { Input, Select, Switch } from 'antd';

/**
 * Narrow containers (Drawer / Modal): `compact` tightens the spacing (12px gap, 10px item
 * padding; or set `gap` / `itemPadding`). Inputs stack under their label with
 * `layout="vertical"`, while a Switch stays inline with its label via an item-level
 * `layout="horizontal"`.
 */
export default () => (
  <div style={{ maxWidth: 380, padding: 16 }}>
    <Form compact layout="vertical" variant="borderless">
      <Form.Item label="Name" name="name">
        <Input placeholder="Jane Doe" />
      </Form.Item>
      <Form.Item label="Role" name="role">
        <Select
          placeholder="Select a role"
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'Member', value: 'member' },
          ]}
        />
      </Form.Item>
      <Form.Item
        desc="Members can sign in"
        label="Enabled"
        layout="horizontal"
        name="enabled"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </Form>
  </div>
);
