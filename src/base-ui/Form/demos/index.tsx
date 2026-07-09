import { toast, ToastHost } from '@lobehub/ui';
import { Form, type FormGroupItemType, Input, Switch, TextArea } from '@lobehub/ui/base-ui';
import { SettingsIcon, SparklesIcon } from 'lucide-react';

const items: FormGroupItemType[] = [
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
        children: (
          <TextArea
            autoSize={{ maxRows: 4, minRows: 2 }}
            placeholder={'Introduce yourself'}
            style={{ width: 320 }}
          />
        ),
        label: 'Bio',
        name: 'bio',
      },
    ],
    icon: SettingsIcon,
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
    title: 'Advanced',
  },
];

export default () => (
  <>
    <Form
      footer={<Form.SubmitFooter />}
      initialValues={{ bio: 'Hello there', name: 'Innei' }}
      itemMinWidth={240}
      items={items}
      style={{ maxWidth: 640, paddingInline: 16 }}
      variant={'borderless'}
      onFinish={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast.success(JSON.stringify(values));
      }}
    />
    <ToastHost />
  </>
);
