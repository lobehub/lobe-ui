import { Button, Flexbox, Video, type VideoPlayer } from '@lobehub/ui';
import { useRef } from 'react';

import { SAMPLE_SRC, sections } from './data';

export default () => {
  const ref = useRef<VideoPlayer>(null);

  return (
    <Flexbox gap={12} style={{ maxWidth: 640, width: '100%' }}>
      <Video maxHeight={320} ref={ref} sections={sections} src={SAMPLE_SRC} />
      <Flexbox horizontal gap={8} wrap="wrap">
        <Button onClick={() => ref.current?.toggle()}>Play / pause</Button>
        <Button onClick={() => ref.current?.seek(16)}>Jump to 0:16</Button>
        <Button onClick={() => ref.current?.setRate(2)}>2× speed</Button>
        <Button onClick={() => ref.current?.toggleMute()}>Mute</Button>
      </Flexbox>
    </Flexbox>
  );
};
