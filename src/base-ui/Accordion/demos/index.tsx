import { Flexbox } from '@lobehub/ui';
import { Accordion, type AccordionProps, ActionIcon } from '@lobehub/ui/base-ui';
import { PencilIcon, Trash2Icon } from 'lucide-react';

const items: AccordionProps['items'] = [
  {
    children:
      'The title text is flush with the body text above, while the hover highlight extends 8px beyond it — no layout shift, larger hit area.',
    key: 'advanced',
    title: 'Advanced options',
  },
  {
    action: (
      <>
        <ActionIcon icon={PencilIcon} size="small" title="Edit" />
        <ActionIcon icon={Trash2Icon} size="small" title="Delete" />
      </>
    ),
    children: 'Hover the header to reveal the actions on the right.',
    key: 'publish',
    title: 'Publish settings',
  },
  {
    children: 'This item cannot be toggled.',
    disabled: true,
    key: 'danger',
    title: 'Danger zone',
  },
];

export default () => {
  return (
    <Flexbox gap={16} padding={16} style={{ maxWidth: 480 }}>
      <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.65 }}>
        A paragraph of regular body text, as an alignment reference for the accordion titles below.
      </div>
      <Accordion defaultValue={['advanced']} items={items} />
    </Flexbox>
  );
};
