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

import { markdownComponents } from '../components/CodeBlock';
import { Range, Segmented, Select, Switch } from '../components/Controls';
import { paragraphBatchCases } from '../lib/paragraphBatches';
import { type SampleKey, samples } from '../lib/samples';
import { useLocalStream } from '../lib/useLocalStream';
import { useStickToBottom } from '../lib/useStickToBottom';
import { ProfilerPanel, ProfilerRate } from './ProfilerPanel';

const SAMPLE_OPTIONS = Object.entries(samples).map(([value, { label }]) => ({
  label,
  value: value as SampleKey,
}));

const SMOOTHING_OPTIONS: { label: string; value: StreamSmoothingPreset }[] = [
  { label: 'Realtime', value: 'realtime' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Silky', value: 'silky' },
];

const GRANULARITY_OPTIONS: { label: string; value: StreamAnimationGranularity }[] = [
  { label: 'Char', value: 'char' },
  { label: 'Word', value: 'word' },
];

const TPS_MODE_OPTIONS = [
  { label: 'Fixed', value: 'fixed' },
  { label: 'Range', value: 'range' },
] as const;

type TpsMode = (typeof TPS_MODE_OPTIONS)[number]['value'];

export const Playground = () => {
  const [sampleKey, setSampleKey] = useState<SampleKey>('markdown');
  const [chunkSize, setChunkSize] = useState(6);
  const [tpsMode, setTpsMode] = useState<TpsMode>('fixed');
  const [tps, setTps] = useState(250);
  const [tpsMin, setTpsMin] = useState(80);
  const [tpsMax, setTpsMax] = useState(400);
  const [jitter, setJitter] = useState(50);
  const [smoothing, setSmoothing] = useState<StreamSmoothingPreset>('balanced');
  const [granularity, setGranularity] = useState<StreamAnimationGranularity>('char');
  const [latexGuard, setLatexGuard] = useState(true);
  const [preprocess, setPreprocess] = useState(true);

  const rateMin = tpsMode === 'range' ? Math.min(tpsMin, tpsMax) : tps;
  const rateMax = tpsMode === 'range' ? Math.max(tpsMin, tpsMax) : tps;
  const batchDelayMs = Math.max(1, Math.round((chunkSize / Math.max(rateMin, 0.001)) * 1000));

  const { onScroll: onOutputScroll, ref: outputRef } = useStickToBottom();
  const profiler = useMemo(() => createStreamdownProfiler({ label: 'playground' }), []);
  const { restart, text } = useLocalStream(samples[sampleKey].content, {
    chunkSize,
    jitter: jitter / 100,
    tps: rateMin,
    tpsMax: rateMax,
  });
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  useEffect(() => {
    profiler.reset('playground');
  }, [
    profiler,
    sampleKey,
    chunkSize,
    rateMin,
    rateMax,
    jitter,
    smoothing,
    granularity,
    preprocess,
  ]);

  return (
    <section className="playground" id="playground">
      <div className="section-head">
        <h2>Playground</h2>
        <p>Tune the stream and watch the profiler respond in real time.</p>
      </div>

      <div className="surface">
        <div className="surface-bar">
          <span>{samples[sampleKey].label}</span>
          <span className="surface-bar-spacer" />
          <ProfilerRate profiler={profiler} />
        </div>

        <div className="board">
          <div className="panel">
            <Select
              label="Sample"
              options={SAMPLE_OPTIONS}
              value={sampleKey}
              onChange={(key) => {
                setSampleKey(key);
                if (key in paragraphBatchCases) {
                  const preset = paragraphBatchCases[key as keyof typeof paragraphBatchCases];
                  setChunkSize(preset.chunkSize);
                  setTps(Math.round((preset.chunkSize / preset.delayMs) * 1000));
                  setTpsMode('fixed');
                  setJitter(0);
                }
                restart();
              }}
            />
            <Segmented
              label="TPS"
              options={TPS_MODE_OPTIONS}
              value={tpsMode}
              onChange={setTpsMode}
            />
            {tpsMode === 'fixed' ? (
              <Range
                hint={`${batchDelayMs}ms / batch at ${chunkSize} ch`}
                label="Rate"
                max={5000}
                min={10}
                step={10}
                unit="chars/s"
                value={tps}
                onChange={setTps}
              />
            ) : (
              <>
                <Range
                  label="TPS min"
                  max={5000}
                  min={10}
                  step={10}
                  unit="chars/s"
                  value={tpsMin}
                  onChange={setTpsMin}
                />
                <Range
                  hint={`${Math.max(1, Math.round((chunkSize / Math.max(rateMax, 0.001)) * 1000))}–${batchDelayMs}ms / batch`}
                  label="TPS max"
                  max={5000}
                  min={10}
                  step={10}
                  unit="chars/s"
                  value={tpsMax}
                  onChange={setTpsMax}
                />
              </>
            )}
            <Range
              label="Chunk size"
              max={100}
              min={1}
              unit="ch"
              value={chunkSize}
              onChange={setChunkSize}
            />
            <Range
              label="Jitter"
              max={100}
              min={0}
              step={5}
              unit="%"
              value={jitter}
              onChange={setJitter}
            />
            <Segmented
              label="Smoothing"
              options={SMOOTHING_OPTIONS}
              value={smoothing}
              onChange={setSmoothing}
            />
            <Segmented
              label="Granularity"
              options={GRANULARITY_OPTIONS}
              value={granularity}
              onChange={setGranularity}
            />
            <Switch checked={latexGuard} label="LaTeX guard" onChange={setLatexGuard} />
            <Switch checked={preprocess} label="Preprocess" onChange={setPreprocess} />
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                profiler.reset('playground');
                restart();
              }}
            >
              Replay
            </button>
          </div>

          <div className="canvas">
            <div className="output-pane sd-typography" ref={outputRef} onScroll={onOutputScroll}>
              <StreamdownProfilerProvider profiler={profiler}>
                <Streamdown
                  components={markdownComponents}
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
            <ProfilerPanel profiler={profiler} />
          </div>
        </div>
      </div>

      <p className="footnote">
        Reveal commits sit deliberately below the display refresh — per-character stagger rides CSS{' '}
        <code>animation-delay</code>, not a re-render every frame.
      </p>
    </section>
  );
};
