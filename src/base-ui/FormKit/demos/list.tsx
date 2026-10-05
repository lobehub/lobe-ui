import { Input } from '@lobehub/ui/base-ui';
import { Form, useForm } from '@lobehub/ui/base-ui/form';

type Values = { env: { key: string; value: string }[] };

const columns = [
  { children: <Input placeholder={'KEY'} />, name: 'key', required: true, title: 'Key' },
  { children: <Input placeholder={'value'} />, flex: 1.4, name: 'value', title: 'Value' },
];

export default () => {
  const form = useForm<Values>({
    initialValues: {
      env: [
        { key: 'LOG_LEVEL', value: 'info' },
        { key: 'PORT', value: '3210' },
      ],
    },
  });

  return (
    <Form form={form} layout={'vertical'} variant={'outlined'}>
      <Form.Group title={'Environment variables'}>
        <Form.List
          addText={'Add variable'}
          columns={columns}
          emptyText={'No variables yet'}
          name={'env'}
          newItem={{ key: '', value: '' }}
        />
      </Form.Group>
    </Form>
  );
};
