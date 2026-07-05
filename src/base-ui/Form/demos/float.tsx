import { toast, ToastHost } from '@lobehub/ui';
import { Form, Input } from '@lobehub/ui/base-ui';

export default () => (
  <>
    <Form
      footer={<Form.SubmitFooter enableUnsavedWarning float />}
      initialValues={{ title: 'Untitled' }}
      itemsType={'flat'}
      style={{ maxWidth: 640, paddingInline: 16 }}
      variant={'filled'}
      items={[
        {
          children: <Input placeholder={'Title'} />,
          desc: 'Edit to reveal the floating footer',
          label: 'Title',
          minWidth: 280,
          name: 'title',
        },
        {
          children: <Input placeholder={'Slug'} />,
          label: 'Slug',
          minWidth: 280,
          name: 'slug',
        },
      ]}
      onFinish={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast.success(JSON.stringify(values));
      }}
    />
    <ToastHost />
  </>
);
