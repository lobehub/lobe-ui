import { Markdown } from '@lobehub/ui';
import { useEffect, useRef, useState } from 'react';

import { type StreamAnimationGranularity, type StreamSmoothingPreset } from '../type';
import { fullContent } from './content';

const readParams = () => {
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const preset = params.get('preset');
  return {
    chunkDelay: Number(params.get('delay')) || 50,
    chunkSize: Number(params.get('size')) || 5,
    granularity: (params.get('granularity') === 'word'
      ? 'word'
      : 'char') as StreamAnimationGranularity,
    preset: (preset === 'realtime' || preset === 'silky'
      ? preset
      : 'balanced') as StreamSmoothingPreset,
  };
};

export default () => {
  const [{ chunkDelay, chunkSize, granularity, preset }] = useState(readParams);
  const [content, setContent] = useState('');
  const [phase, setPhase] = useState<'idle' | 'streaming' | 'done'>('idle');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setContent('');
    setPhase('streaming');

    let position = 0;
    timerRef.current = setInterval(() => {
      position += chunkSize;
      setContent(fullContent.slice(0, position));

      if (position >= fullContent.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setPhase('done');
      }
    }, chunkDelay);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div style={{ margin: '0 auto', maxWidth: 800, padding: 24 }}>
      <button
        data-phase={phase}
        disabled={phase === 'streaming'}
        style={{ marginBottom: 16 }}
        type="button"
        onClick={start}
      >
        {phase === 'streaming' ? 'streaming' : phase === 'done' ? 'run again' : 'start'}
      </button>
      <span style={{ fontFamily: 'monospace', fontSize: 12, marginInlineStart: 8, opacity: 0.5 }}>
        size={chunkSize} delay={chunkDelay}ms granularity={granularity} preset={preset}
      </span>
      <Markdown
        animated={phase === 'streaming'}
        streamAnimationGranularity={granularity}
        streamSmoothingPreset={preset}
        variant="chat"
      >
        {content}
      </Markdown>
    </div>
  );
};
