import { Input, Switch, TextArea,toast, ToastHost  } from '@lobehub/ui';
import { Form, useForm } from '@lobehub/ui/form';
import { SettingsIcon, SparklesIcon } from 'lucide-react';
import { z } from 'zod';

const schema = z.object({
  beta: z.boolean(),
  bio: z.string().max(120, 'Keep it under 120 characters'),
  name: z.string().min(1, 'Name is required'),
});

export default () => {
  const form = useForm({
    initialValues: { beta: false, bio: '', name: 'Ada' },
    onSubmit: (values) => {
      toast.success(JSON.stringify(values));
    },
    schema,
  });

  return (
    <>
      <ToastHost />
      <Form
        footer={<Form.SubmitFooter />}
        form={form}
        items={[
          {
            children: [
              {
                children: <Input placeholder={'Display name'} />,
                desc: 'Shown to other members',
                label: 'Name',
                name: 'name',
                required: true,
              },
              {
                children: <TextArea placeholder={'Introduce yourself'} style={{ width: 320 }} />,
                label: 'Bio',
                name: 'bio',
              },
            ],
            icon: SettingsIcon,
            key: 'profile',
            title: 'Profile',
          },
          {
            children: [
              {
                children: <Switch />,
                desc: 'Enable experimental features',
                label: 'Beta features',
                name: 'beta',
                tag: 'beta',
              },
            ],
            icon: SparklesIcon,
            key: 'labs',
            title: 'Labs',
          },
        ]}
      />
    </>
  );
};
