import { Flexbox } from '@lobehub/ui';
import { ActionIcon, Button, Input } from '@lobehub/ui/base-ui';
import { Form, useForm } from '@lobehub/ui/base-ui/form';
import { PlusIcon, Trash2Icon } from 'lucide-react';

type Values = { env: { key: string; value: string }[] };

export default () => {
  const form = useForm<Values>({
    initialValues: { env: [{ key: 'LOG_LEVEL', value: 'info' }] },
  });

  return (
    <Form form={form} layout={'vertical'} variant={'outlined'}>
      <Form.Group title={'Environment variables'}>
        <Form.List name={'env'}>
          {({ fields, add, remove }) => (
            <Flexbox gap={8}>
              {fields.map((field) => (
                <Flexbox horizontal align={'center'} gap={8} key={field.key}>
                  <Form.Field<Values> bare name={`env.${field.index}.key`}>
                    <Input placeholder={'KEY'} />
                  </Form.Field>
                  <Form.Field<Values> bare name={`env.${field.index}.value`}>
                    <Input placeholder={'value'} />
                  </Form.Field>
                  <ActionIcon
                    icon={Trash2Icon}
                    title={'Remove'}
                    onClick={() => remove(field.index)}
                  />
                </Flexbox>
              ))}
              <Button icon={PlusIcon} onClick={() => add({ key: '', value: '' })}>
                Add variable
              </Button>
            </Flexbox>
          )}
        </Form.List>
      </Form.Group>
    </Form>
  );
};
