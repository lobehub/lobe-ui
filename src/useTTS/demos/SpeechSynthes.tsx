import { Icon, StoryBook, getSpeechSynthesVoiceList, useSpeechSynthes } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { StopCircle, Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

import { useControls, useCreateStore } from '@/index';

const defaultText = '这是一段使用 Speech Synthes 的语音演示';

export default () => {
  const store = useCreateStore();
  const options: any = useControls(
    {
      name: {
        options: getSpeechSynthesVoiceList(),
        value: '婷婷',
      },
      pitch: {
        max: 1,
        min: -1,
        step: 0.1,
        value: 0,
      },
      rate: {
        max: 1,
        min: -1,
        step: 0.1,
        value: 0,
      },
    },
    { store },
  );
  const { setText, isLoading, start, stop } = useSpeechSynthes(defaultText, options);
  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={8}>
        {isLoading ? (
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
    </StoryBook>
  );
};
