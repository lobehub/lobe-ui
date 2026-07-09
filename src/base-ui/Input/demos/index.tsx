import { Flexbox } from '@lobehub/ui';
import { Input, TextArea } from '@lobehub/ui/base-ui';
import { SearchIcon } from 'lucide-react';

export default () => (
  <Flexbox gap={16} padding={16} style={{ maxWidth: 480 }} width={'100%'}>
    <Input placeholder={'Outlined (default in light mode)'} variant={'outlined'} />
    <Input placeholder={'Filled'} variant={'filled'} />
    <Input placeholder={'Borderless'} variant={'borderless'} />
    <Input shadow placeholder={'With shadow'} />
    <Input
      placeholder={'Search something...'}
      prefix={<SearchIcon size={16} />}
      suffix={<kbd>⌘K</kbd>}
    />
    <Input disabled placeholder={'Disabled'} />
    <Flexbox horizontal gap={16}>
      <Input placeholder={'Small'} size={'small'} />
      <Input placeholder={'Middle'} size={'middle'} />
      <Input placeholder={'Large'} size={'large'} />
    </Flexbox>
    <TextArea autoSize={{ maxRows: 6, minRows: 2 }} placeholder={'TextArea with autoSize'} />
    <TextArea resize placeholder={'Resizable TextArea'} />
  </Flexbox>
);
