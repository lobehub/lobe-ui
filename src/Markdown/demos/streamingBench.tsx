import { Markdown } from '@lobehub/ui';
import { useEffect, useRef, useState } from 'react';

import { paragraphBatchCases } from '../../../packages/streamdown/site/src/lib/paragraphBatches';
import { type StreamAnimationGranularity, type StreamSmoothingPreset } from '../type';
import { fullContent, listHeavyContent } from './content';

const BENCH_CASES = {
  default: { chunkSize: 5, content: fullContent, delayMs: 50, label: 'Mixed Markdown' },
  ...paragraphBatchCases,
};
type BenchCase = keyof typeof BENCH_CASES;

const readParams = () => {
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const preset = params.get('preset');
  const requestedCase = params.get('case');
  const caseName: BenchCase =
    requestedCase && Object.hasOwn(BENCH_CASES, requestedCase)
      ? (requestedCase as BenchCase)
      : 'default';
  const config = BENCH_CASES[caseName];
  return {
    animation: params.get('anim') !== '0',
    caseName,
    chunkDelay: Number(params.get('delay')) || config.delayMs,
    chunkSize: Number(params.get('size')) || config.chunkSize,
    content: params.get('content') === 'list' ? listHeavyContent : config.content,
    granularity: (params.get('granularity') === 'word'
      ? 'word'
      : 'char') as StreamAnimationGranularity,
    preset: (preset === 'realtime' || preset === 'silky'
      ? preset
      : 'balanced') as StreamSmoothingPreset,
  };
};

const NO_ANIMATION_CSS = `.stream-char, .stream-block { animation: none !important; opacity: 1 !important; }`;

export default () => {
  const [config, setConfig] = useState(readParams);
  const {
    animation,
    caseName,
    chunkDelay,
    chunkSize,
    content: source,
    granularity,
    preset,
  } = config;
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
      setContent(source.slice(0, position));

      if (position >= source.length) {
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
      {!animation && <style>{NO_ANIMATION_CSS}</style>}
      <label style={{ display: 'block', marginBottom: 16 }}>
        Case{' '}
        <select
          disabled={phase === 'streaming'}
          value={caseName}
          onChange={(event) => {
            const nextCase = event.target.value as BenchCase;
            const next = BENCH_CASES[nextCase];
            setConfig({
              ...config,
              caseName: nextCase,
              chunkDelay: next.delayMs,
              chunkSize: next.chunkSize,
              content: next.content,
            });
            setContent('');
            setPhase('idle');
          }}
        >
          {Object.entries(BENCH_CASES).map(([value, item]) => (
            <option key={value} value={value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
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
        size={chunkSize} delay={chunkDelay}ms granularity={granularity} preset={preset} chars=
        {source.length} anim=
        {animation ? 'on' : 'off'}
      </span>
      <Markdown
        animated={phase !== 'idle'}
        streamAnimationGranularity={granularity}
        streamSmoothingPreset={preset}
        variant="chat"
      >
        {content}
      </Markdown>
    </div>
  );
};
