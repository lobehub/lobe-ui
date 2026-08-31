import { Flexbox } from '@lobehub/ui';
import { Button, Text, TextArea } from '@lobehub/ui/base-ui';
import { ImagePlus } from 'lucide-react';

const RejectFooter = ({ outdent }: { outdent?: boolean }) => (
  <Flexbox
    gap={10}
    padding={16}
    style={{
      border: '1px solid var(--ant-color-border-secondary, rgba(127,127,127,0.25))',
      borderRadius: 12,
      maxWidth: 560,
    }}
  >
    <Text fontSize={12} type={'secondary'}>
      Additional notes (optional)
    </Text>
    <TextArea
      autoSize={{ maxRows: 5, minRows: 2 }}
      placeholder={'What is wrong, and what do you expect instead…'}
    />
    <Flexbox horizontal align={'flex-start'} gap={8}>
      <Flexbox horizontal flex={1}>
        <Button
          icon={<ImagePlus size={14} />}
          outdent={outdent || undefined}
          size={'small'}
          type={'text'}
        >
          Attach screenshot
        </Button>
      </Flexbox>
      <Button size={'small'}>Cancel</Button>
      <Button size={'small'} type={'primary'}>
        Submit feedback
      </Button>
    </Flexbox>
  </Flexbox>
);

export default () => (
  <Flexbox gap={20} padding={16}>
    <Flexbox gap={8}>
      <Text fontSize={12} type={'secondary'}>
        default
      </Text>
      <RejectFooter />
    </Flexbox>
    <Flexbox gap={8}>
      <Text fontSize={12} type={'secondary'}>
        outdent
      </Text>
      <RejectFooter outdent />
    </Flexbox>
  </Flexbox>
);
