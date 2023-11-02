import { Icon, StoryBook, getEdgeVoiceList, useMicrosoftSpeech } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { StopCircle, Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

import { useControls, useCreateStore } from '@/index';

const defaultText = '这是一段使用 Microsoft Speech 的语音演示';

export default () => {
  const store = useCreateStore();
  const options: any = useControls(
    {
      name: {
        options: getEdgeVoiceList(),
        value: 'zh-CN-YunxiaNeural',
      },
      pitch: {
        max: 2,
        min: 0,
        step: 0.1,
        value: 1,
      },
      rate: {
        max: 2,
        min: 0,
        step: 0.1,
        value: 1,
      },
      style: {
        options: [
          'affectionate',
          'angry',
          'calm',
          'cheerful',
          'disgruntled',
          'embarrassed',
          'fearful',
          'general',
          'gentle',
          'sad',
          'serious',
        ],
        value: 'general',
      },
    },
    { store },
  );
  const { setText, isLoading, start, stop } = useMicrosoftSpeech(defaultText, options);
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
