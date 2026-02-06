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
            itemKey="1"
            title="Panel with Single Action"
            action={
              <DropdownMenu items={menuItems} placement="bottomRight">
                <ActionIcon icon={MoreHorizontal} size="small" title="More actions" />
              </DropdownMenu>
            }
          >
            <Flexbox padding={16}>
              <div>This panel has a single action icon with dropdown menu.</div>
              <div>Click the action icon to open the dropdown menu.</div>
            </Flexbox>
          </AccordionItem>
          <AccordionItem
            itemKey="2"
            title="Panel with Multiple Actions"
            action={
              <Flexbox horizontal gap={4}>
                <ActionIcon
                  icon={Edit}
                  size="small"
                  title="Edit"
                  onClick={() => console.log('Edit clicked')}
                />
                <ActionIcon
                  icon={Settings}
                  size="small"
                  title="Settings"
                  onClick={() => console.log('Settings clicked')}
                />
                <ActionIcon
                  danger
                  icon={Trash2}
                  size="small"
                  title="Delete"
                  onClick={() => console.log('Delete clicked')}
                />
              </Flexbox>
            }
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
          defaultExpand={false}
          itemKey="standalone"
          title="Standalone Item with Action"
          action={
            <ActionIcon
              icon={Settings}
              size="small"
              title="Settings"
              onClick={() => console.log('Standalone action clicked')}
            />
          }
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
            itemKey="variant-borderless"
            title="Borderless Action"
            action={
              <ActionIcon
                icon={Settings}
                size="small"
                title="Borderless variant"
                variant="borderless"
              />
            }
          >
            <Flexbox padding={16}>
              <div>Action icon with borderless variant.</div>
            </Flexbox>
          </AccordionItem>
          <AccordionItem
            itemKey="variant-filled"
            title="Filled Action"
            action={
              <ActionIcon icon={Settings} size="small" title="Filled variant" variant="filled" />
            }
          >
            <Flexbox padding={16}>
              <div>Action icon with filled variant.</div>
            </Flexbox>
          </AccordionItem>
          <AccordionItem
            itemKey="variant-outlined"
            title="Outlined Action"
            action={
              <ActionIcon
                icon={Settings}
                size="small"
                title="Outlined variant"
                variant="outlined"
              />
            }
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
