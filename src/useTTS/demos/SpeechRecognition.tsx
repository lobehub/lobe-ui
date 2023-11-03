import { Icon, StoryBook, useControls, useCreateStore, useSpeechRecognition } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Mic, StopCircle } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const store = useCreateStore();
  const { locale }: any = useControls(
    {
      locale: 'zh-CN',
    },
    { store },
  );

  const { text, start, stop, isLoading } = useSpeechRecognition(locale);
  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={8}>
        {isLoading ? (
          <Button block icon={<Icon icon={StopCircle} />} onClick={stop}>
            Stop
          </Button>
        ) : (
          <Button block icon={<Icon icon={Mic} />} onClick={start} type={'primary'}>
            Recognition
          </Button>
        )}
        <Input.TextArea placeholder={'Recognition result...'} value={text} />
      </Flexbox>
    </StoryBook>
  );
};
