import { Accordion, AccordionItem, ActionIcon, DropdownMenu, Icon } from '@lobehub/ui';
import { Edit, MoreHorizontal, Settings, Trash2 } from 'lucide-react';

import { Flexbox } from '@/Flex';

export default () => {
  const menuItems = [
    {
      icon: <Icon icon={Edit} />,
      key: 'edit',
      label: 'Edit',
      onClick: () => console.log('Edit clicked'),
    },
    {
      icon: <Icon icon={Settings} />,
      key: 'settings',
      label: 'Settings',
      onClick: () => console.log('Settings clicked'),
    },
    {
      type: 'divider' as const,
    },
    {
      danger: true,
      icon: <Icon icon={Trash2} />,
      key: 'delete',
      label: 'Delete',
      onClick: () => console.log('Delete clicked'),
    },
  ];

  return (
    <Flexbox gap={24} style={{ width: '100%' }}>
      <div style={{ width: '100%' }}>
        <h3>Accordion with Action Icons</h3>
        <Accordion defaultExpandedKeys={['1']} style={{ width: '100%' }}>
          <AccordionItem
            action={
              <DropdownMenu items={menuItems} placement="bottomRight">
                <ActionIcon icon={MoreHorizontal} size="small" title="More actions" />
              </DropdownMenu>
            }
            itemKey="1"
            title="Panel with Single Action"
          >
            <Flexbox padding={16}>
              <div>This panel has a single action icon with dropdown menu.</div>
              <div>Click the action icon to open the dropdown menu.</div>
            </Flexbox>
          </AccordionItem>
          <AccordionItem
            action={
              <Flexbox gap={4} horizontal>
                <ActionIcon
                  icon={Edit}
                  onClick={() => console.log('Edit clicked')}
                  size="small"
                  title="Edit"
                />
                <ActionIcon
                  icon={Settings}
                  onClick={() => console.log('Settings clicked')}
                  size="small"
                  title="Settings"
                />
                <ActionIcon
                  danger
                  icon={Trash2}
                  onClick={() => console.log('Delete clicked')}
                  size="small"
                  title="Delete"
                />
              </Flexbox>
            }
            itemKey="2"
            title="Panel with Multiple Actions"
          >
            <Flexbox padding={16}>
              <div>This panel has multiple action icons.</div>
              <div>You can combine multiple ActionIcon components in the action prop.</div>
            </Flexbox>
          </AccordionItem>
        </Accordion>
      </div>

      <div style={{ width: '100%' }}>
        <h3>Standalone AccordionItem with Action</h3>
        <AccordionItem
          action={
            <ActionIcon
              icon={Settings}
              onClick={() => console.log('Standalone action clicked')}
              size="small"
              title="Settings"
            />
          }
          defaultExpand={false}
          itemKey="standalone"
          title="Standalone Item with Action"
        >
          <Flexbox padding={16}>
            <div>This is a standalone AccordionItem with an action.</div>
            <div>It works independently without an Accordion wrapper.</div>
          </Flexbox>
        </AccordionItem>
      </div>

      <div style={{ width: '100%' }}>
        <h3>Action with Different Variants</h3>
        <Accordion style={{ width: '100%' }}>
          <AccordionItem
            action={
              <ActionIcon
                icon={Settings}
                size="small"
                title="Borderless variant"
                variant="borderless"
              />
            }
            itemKey="variant-borderless"
            title="Borderless Action"
          >
            <Flexbox padding={16}>
              <div>Action icon with borderless variant.</div>
            </Flexbox>
          </AccordionItem>
          <AccordionItem
            action={
              <ActionIcon icon={Settings} size="small" title="Filled variant" variant="filled" />
            }
            itemKey="variant-filled"
            title="Filled Action"
          >
            <Flexbox padding={16}>
              <div>Action icon with filled variant.</div>
            </Flexbox>
          </AccordionItem>
          <AccordionItem
            action={
              <ActionIcon
                icon={Settings}
                size="small"
                title="Outlined variant"
                variant="outlined"
              />
            }
            itemKey="variant-outlined"
            title="Outlined Action"
          >
            <Flexbox padding={16}>
              <div>Action icon with outlined variant.</div>
            </Flexbox>
          </AccordionItem>
        </Accordion>
      </div>
    </Flexbox>
  );
};
