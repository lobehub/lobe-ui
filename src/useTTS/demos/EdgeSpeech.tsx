import {
  Icon,
  StoryBook,
  getEdgeVoiceList,
  useControls,
  useCreateStore,
  useEdgeSpeech,
} from '@lobehub/ui';
import { Button, Input } from 'antd';
import { StopCircle, Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

const defaultText = '这是一段使用 Edge Speech 的语音演示';

export default () => {
  const store = useCreateStore();
  const options: any = useControls(
    {
      name: {
        options: getEdgeVoiceList(),
        value: 'zh-CN-YunxiaNeural',
      },
    },
    { store },
  );
  const { setText, isLoading, isPlaying, start, stop } = useEdgeSpeech(defaultText, options);
  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={8}>
        {isPlaying ? (
          <Button block icon={<Icon icon={StopCircle} />} onClick={stop}>
            Stop
          </Button>
        ) : isLoading ? (
          <Button block loading onClick={stop}>
            Generating...
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
