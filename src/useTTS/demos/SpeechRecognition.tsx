import { Icon, useSpeechRecognition } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Mic, StopCircle } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const { text, start, stop, isProcessing } = useSpeechRecognition('zh-CN');
  return (
    <Flexbox gap={8}>
      {isProcessing ? (
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
  );
};
