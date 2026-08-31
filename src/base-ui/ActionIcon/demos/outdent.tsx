import { Flexbox } from '@lobehub/ui';
import { ActionIcon, Text } from '@lobehub/ui/base-ui';
import { Paperclip } from 'lucide-react';

const TaskHeader = ({ outdent }: { outdent?: boolean }) => (
  <Flexbox
    gap={8}
    padding={16}
    style={{
      border: '1px solid var(--ant-color-border-secondary, rgba(127,127,127,0.25))',
      borderRadius: 12,
      maxWidth: 560,
    }}
  >
    <Text strong>Make the tasks page feel like a workbench</Text>
    <Text fontSize={13} type={'secondary'}>
      The task list should read as a workbench: grouped, scannable, and ready to act on.
    </Text>
    <ActionIcon
      icon={Paperclip}
      outdent={outdent || undefined}
      size={'small'}
      title={'Attach file'}
    />
    <Flexbox gap={6}>
      <Text fontSize={13}>Review the current task list layout</Text>
      <Text fontSize={13}>Propose a grouped workbench structure</Text>
      <Text fontSize={13}>Ship the workbench grouping on the tasks page</Text>
    </Flexbox>
  </Flexbox>
);

export default () => (
  <Flexbox gap={20} padding={16}>
    <Flexbox gap={8}>
      <Text fontSize={12} type={'secondary'}>
        default
      </Text>
      <TaskHeader />
    </Flexbox>
    <Flexbox gap={8}>
      <Text fontSize={12} type={'secondary'}>
        outdent
      </Text>
      <TaskHeader outdent />
    </Flexbox>
  </Flexbox>
);
