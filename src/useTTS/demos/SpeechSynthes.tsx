import { Icon, useSpeechSynthes } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { StopCircle, Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

const defaultText = '这是一段语音播报';

export default () => {
  const { setText, start, stop, isProcessing } = useSpeechSynthes(defaultText, {
    name: '婷婷',
  });
  return (
    <Flexbox gap={8}>
      {isProcessing ? (
        <Button block icon={<Icon icon={StopCircle} />} onClick={stop}>
          Stop
        </Button>
      ) : (
        <Button block icon={<Icon icon={Volume2} />} onClick={start} type={'primary'}>
          Speak
        </Button>
      )}
      <Input.TextArea defaultValue={defaultText} onChange={(e) => setText(e.target.value)} />
    </Flexbox>
  );
};
