import { Button, Tag } from '@lobehub/ui';
import { CodeShowcase } from '@lobehub/ui/awesome';

export default () => (
  <CodeShowcase
    items={[
      {
        code: "import { Button } from '@lobehub/ui'\n\nexport default () => <Button type={'primary'}>Primary</Button>",
        key: 'button',
        label: 'Button',
        preview: <Button type={'primary'}>Primary</Button>,
      },
      {
        code: "import { Tag } from '@lobehub/ui'\n\nexport default () => <Tag color={'purple'}>purple</Tag>",
        key: 'tag',
        label: 'Tag',
        preview: <Tag color={'purple'}>purple</Tag>,
      },
    ]}
  />
);
