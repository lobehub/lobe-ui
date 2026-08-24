import {
  preprocessLaTeX,
  type StreamAnimationGranularity,
  Streamdown,
  type StreamSmoothingPreset,
} from '@lobehub/streamdown';
import { createStreamdownProfiler, StreamdownProfilerProvider } from '@lobehub/streamdown/profiler';
import { useEffect, useMemo, useState } from 'react';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { type SampleKey, samples } from '../lib/samples';
import { useLocalStream } from '../lib/useLocalStream';
import { ProfilerPanel } from './ProfilerPanel';

const SMOOTHING_PRESETS: StreamSmoothingPreset[] = ['realtime', 'balanced', 'silky'];
const GRANULARITIES: StreamAnimationGranularity[] = ['char', 'word'];

export const Playground = () => {
  const [sampleKey, setSampleKey] = useState<SampleKey>('markdown');
  const [chunkSize, setChunkSize] = useState(8);
  const [delayMs, setDelayMs] = useState(60);
  const [smoothing, setSmoothing] = useState<StreamSmoothingPreset>('balanced');
  const [granularity, setGranularity] = useState<StreamAnimationGranularity>('char');
  const [latexGuard, setLatexGuard] = useState(true);
  const [preprocess, setPreprocess] = useState(true);

  const profiler = useMemo(() => createStreamdownProfiler({ label: 'playground' }), []);
  const { restart, text } = useLocalStream(samples[sampleKey].content, { chunkSize, delayMs });
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  useEffect(() => {
    profiler.reset('playground');
  }, [profiler, sampleKey, chunkSize, delayMs, smoothing, granularity, preprocess]);

  return (
    <section className="playground" id="playground">
      <h2>Playground</h2>
      <div className="playground-grid">
        <div className="controls">
          <label>
            Sample
            <select value={sampleKey} onChange={(e) => setSampleKey(e.target.value as SampleKey)}>
              {Object.entries(samples).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Chunk size · {chunkSize} chars
            <input
              max={40}
              min={1}
              type="range"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
            />
          </label>
          <label>
            Chunk delay · {delayMs} ms
            <input
              max={300}
              min={10}
              step={10}
              type="range"
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
            />
          </label>
          <label>
            Smoothing
            <select
              value={smoothing}
              onChange={(e) => setSmoothing(e.target.value as StreamSmoothingPreset)}
            >
              {SMOOTHING_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </label>
          <label>
            Granularity
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as StreamAnimationGranularity)}
            >
              {GRANULARITIES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="checkbox">
            <input
              checked={latexGuard}
              type="checkbox"
              onChange={(e) => setLatexGuard(e.target.checked)}
            />
            LaTeX guard
          </label>
          <label className="checkbox">
            <input
              checked={preprocess}
              type="checkbox"
              onChange={(e) => setPreprocess(e.target.checked)}
            />
            Preprocess
          </label>
          <button
            type="button"
            onClick={() => {
              profiler.reset('playground');
              restart();
            }}
          >
            Replay
          </button>
          <ProfilerPanel profiler={profiler} />
        </div>
        <div className="playground-output sd-typography">
          <StreamdownProfilerProvider profiler={profiler}>
            <Streamdown
              content={text}
              granularity={granularity}
              latexGuard={latexGuard}
              preprocess={preprocess ? preprocessLaTeX : undefined}
              rehypePlugins={rehypePlugins}
              remarkPlugins={remarkPlugins}
              smoothing={smoothing}
            />
          </StreamdownProfilerProvider>
        </div>
      </div>
    </section>
  );
};
