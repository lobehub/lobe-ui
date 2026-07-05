import { toast, ToastHost } from '@lobehub/ui';
import {
  AutoComplete,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Slider,
  Switch,
} from '@lobehub/ui/base-ui';

export default () => (
  <>
    <Form
      footer={<Form.SubmitFooter />}
      style={{ maxWidth: 640, paddingInline: 16 }}
      variant={'outlined'}
      onFinish={(values) => {
        toast.success(JSON.stringify(values));
      }}
    >
      <Form.Group title={'All Field-aware Controls'} variant={'outlined'}>
        <Form.Field label={'Name'} minWidth={240} name={'name'}>
          <Input placeholder={'Text input'} />
        </Form.Field>
        <Form.Field divider label={'Model'} minWidth={240} name={'model'}>
          <AutoComplete
            options={['claude-fable-5', 'claude-opus-4-8', 'claude-sonnet-5']}
            placeholder={'AutoComplete'}
          />
        </Form.Field>
        <Form.Field divider label={'Max tokens'} minWidth={240} name={'maxTokens'}>
          <InputNumber defaultValue={4096} max={128_000} min={1} />
        </Form.Field>
        <Form.Field
          divider
          desc={'Base UI slider joins FormData'}
          label={'Temperature'}
          minWidth={240}
          name={'temperature'}
        >
          <Slider defaultValue={70} />
        </Form.Field>
        <Form.Field divider label={'Stream'} name={'stream'}>
          <Switch defaultChecked name={'stream'} />
        </Form.Field>
        <Form.Field divider label={'Advanced mode'} name={'advanced'}>
          <Checkbox name={'advanced'} value={'on'} />
        </Form.Field>
      </Form.Group>
    </Form>
    <ToastHost />
  </>
);
