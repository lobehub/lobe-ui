'use client';

import { Button, Markdown } from '@lobehub/ui';
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

import { Flexbox } from '@/Flex';

import { type StreamSmoothingPreset } from '../type';

type Scenario =
  | 'largeAppend'
  | 'blockBurstSync'
  | 'blockBurstViaSmoother'
  | 'fastSmallChunks'
  | 'ultraFast250tps'
  | 'slow20tps';

interface ScenarioConfig {
  description: string;
  hypothesis: string;
  label: string;
  run: (push: (chunk: string) => void, done: () => void) => () => void;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const ALPHA = 'abcdefghijklmnopqrstuvwxyz ';
const repeat = (n: number) => Array.from({ length: n }, (_, i) => ALPHA[i % ALPHA.length]).join('');

const SCENARIOS: Record<Scenario, ScenarioConfig> = {
  blockBurstSync: {
    description:
      'Push the whole multi-paragraph payload in one setState. Forces syncImmediate unconditionally — every new block gets timeline seeded to latestCharStart at once.',
    hypothesis: 'If timeline seeding is the cause, skipped count should dominate (>50% miss rate).',
    label: 'B. Multi-paragraph in one shot',
    run: (push, done) => {
      const payload = [
        '# Heading B',
        '',
        repeat(90) + '.',
        '',
        repeat(90) + '.',
        '',
        repeat(90) + '.',
        '',
      ].join('\n');
      let cancelled = false;
      const t = setTimeout(() => {
        if (cancelled) return;
        push(payload);
        done();
      }, 50);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    },
  },
  blockBurstViaSmoother: {
    description:
      'Each paragraph is ~90 chars (below largeAppendChars=120 for `balanced`), pushed in one append per 500ms. Smoother paces char-by-char, but each newline boundary births a new block mid-stream.',
    hypothesis:
      'If smoother always grows blocks 1 char at a time, timeline seeds at 0 and we should see NO skipped chars from this path.',
    label: 'B2. Paragraphs via smoother (<120 each)',
    run: (push, done) => {
      const paragraphs = [
        '# Heading B2\n\n',
        repeat(80) + '.\n\n',
        repeat(80) + '.\n\n',
        repeat(80) + '.\n',
      ];
      let cancelled = false;
      let i = 0;
      (async () => {
        while (!cancelled && i < paragraphs.length) {
          push(paragraphs[i++]);
          await sleep(500);
        }
        if (!cancelled) done();
      })();
      return () => {
        cancelled = true;
      };
    },
  },
  fastSmallChunks: {
    description:
      '100 chars/sec, 4-char chunks every 40ms. No chunk exceeds largeAppendChars. Stress the smoother while constantly crossing paragraph boundaries.',
    hypothesis:
      'If backlog pressure causes the smoother to flush many chars per frame across a newline, timeline seeding may still miss animations.',
    label: 'D. Fast small chunks, 100 cps',
    run: (push, done) => {
      const text =
        '# Heading D\n\n' + repeat(160) + '.\n\n' + repeat(160) + '.\n\n' + repeat(160) + '.\n';
      let cancelled = false;
      let pos = 0;
      (async () => {
        while (!cancelled && pos < text.length) {
          const size = Math.min(4, text.length - pos);
          push(text.slice(pos, pos + size));
          pos += size;
          await sleep(40);
        }
        if (!cancelled) done();
      })();
      return () => {
        cancelled = true;
      };
    },
  },
  ultraFast250tps: {
    description:
      '~260 chars/sec, 13-char chunks every 50ms. Sustained high-pressure stream. Each chunk stays under largeAppendChars but smoother backlog runs hot for the whole duration.',
    hypothesis:
      'With fix: no chunk should skip its fade regardless of how many chars RAF batches per commit.',
    label: 'E. Ultra-fast stream (~260 cps)',
    run: (push, done) => {
      const text =
        '# Heading E\n\n' + repeat(240) + '.\n\n' + repeat(240) + '.\n\n' + repeat(240) + '.\n';
      let cancelled = false;
      let pos = 0;
      (async () => {
        while (!cancelled && pos < text.length) {
          const size = Math.min(13, text.length - pos);
          push(text.slice(pos, pos + size));
          pos += size;
          await sleep(50);
        }
        if (!cancelled) done();
      })();
      return () => {
        cancelled = true;
      };
    },
  },
  largeAppend: {
    description:
      'One append of 200+ chars. Exceeds largeAppendChars=120 for `balanced`, forcing syncImmediate. All content flushes in one setState with zero per-char pacing.',
    hypothesis:
      'If syncImmediate + timeline seeding is the cause, we should see heavy skipped counts here.',
    label: 'A. Single chunk > 120',
    run: (push, done) => {
      const payload = `# Heading A\n\n${repeat(200)}.\n`;
      let cancelled = false;
      const t = setTimeout(() => {
        if (cancelled) return;
        push(payload);
        done();
      }, 50);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    },
  },
  slow20tps: {
    description: '20 chars/sec, 2-char chunks. Steady slow stream with paragraph boundaries.',
    hypothesis: 'Baseline — should animate cleanly if nothing is broken.',
    label: 'C. 20 TPS baseline',
    run: (push, done) => {
      const text =
        '# Heading C\n\n' +
        'Short paragraph one with a few words here.\n\n' +
        'Short paragraph two also with a few words.\n\n' +
        'Short paragraph three closes the story.\n';
      let cancelled = false;
      let pos = 0;
      (async () => {
        while (!cancelled && pos < text.length) {
          const size = Math.min(2, text.length - pos);
          push(text.slice(pos, pos + size));
          pos += size;
          await sleep(100);
        }
        if (!cancelled) done();
      })();
      return () => {
        cancelled = true;
      };
    },
  },
};

const SLOW_MOTION_CSS = `
[data-repro-slow='1'] .stream-char {
  animation-duration: 2000ms !important;
}
[data-repro-slow='1'] .stream-char-revealed {
  outline: 1px solid rgba(255, 80, 80, 0.45) !important;
  background: rgba(255, 80, 80, 0.1) !important;
}
`;

const panelStyle: CSSProperties = {
  background: 'rgba(127, 127, 127, 0.08)',
  border: '1px solid rgba(127, 127, 127, 0.16)',
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1.6,
  padding: 12,
};

const counterStyle: CSSProperties = {
  ...panelStyle,
  display: 'grid',
  fontFamily: 'monospace',
  gap: 8,
  gridTemplateColumns: 'repeat(5, minmax(120px, 1fr))',
};

export default () => {
  const [content, setContent] = useState('');
  const [scenario, setScenario] = useState<Scenario>('largeAppend');
  const [preset, setPreset] = useState<StreamSmoothingPreset>('balanced');
  const [slowMotion, setSlowMotion] = useState(true);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState({
    animated: 0,
    revealedLive: 0,
    skipped: 0,
    totalLive: 0,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const seenRef = useRef<WeakSet<Element>>(new WeakSet());
  const liveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tallyAtBirth = (el: Element) => {
      if (seenRef.current.has(el)) return;
      if (!el.classList?.contains('stream-char')) return;
      seenRef.current.add(el);
      const skipped = el.classList.contains('stream-char-revealed');
      setStats((prev) =>
        skipped ? { ...prev, skipped: prev.skipped + 1 } : { ...prev, animated: prev.animated + 1 },
      );
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          const el = node as Element;
          tallyAtBirth(el);
          el.querySelectorAll?.('.stream-char').forEach(tallyAtBirth);
        }
      }
    });

    observer.observe(root, { childList: true, subtree: true });

    liveTimerRef.current = setInterval(() => {
      if (!rootRef.current) return;
      const total = rootRef.current.querySelectorAll('.stream-char').length;
      const revealed = rootRef.current.querySelectorAll('.stream-char-revealed').length;
      setStats((prev) => ({ ...prev, revealedLive: revealed, totalLive: total }));
    }, 150);

    return () => {
      observer.disconnect();
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
    };
  }, []);

  const stop = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    setRunning(false);
  }, []);

  const start = useCallback(() => {
    stop();
    seenRef.current = new WeakSet();
    setStats({ animated: 0, revealedLive: 0, skipped: 0, totalLive: 0 });
    setContent('');
    setRunning(true);

    const bootstrap = setTimeout(() => {
      const push = (chunk: string) => {
        setContent((prev) => prev + chunk);
      };
      const done = () => setRunning(false);
      cancelRef.current = SCENARIOS[scenario].run(push, done);
    }, 32);

    cancelRef.current = () => clearTimeout(bootstrap);
  }, [scenario, stop]);

  useEffect(() => () => cancelRef.current?.(), []);

  const config = SCENARIOS[scenario];
  const totalAtBirth = stats.animated + stats.skipped;
  const missRate =
    totalAtBirth === 0 ? '—' : `${Math.round((stats.skipped / totalAtBirth) * 100)}%`;

  return (
    <Flexbox gap={12} style={{ padding: 16 }}>
      <style>{SLOW_MOTION_CSS}</style>

      <Flexbox direction="horizontal" gap={8} wrap="wrap">
        {(Object.keys(SCENARIOS) as Scenario[]).map((key) => (
          <Button
            disabled={running}
            key={key}
            type={scenario === key ? 'primary' : 'default'}
            onClick={() => setScenario(key)}
          >
            {SCENARIOS[key].label}
          </Button>
        ))}
      </Flexbox>

      <Flexbox direction="horizontal" gap={8} wrap="wrap">
        {(['realtime', 'balanced', 'silky'] as StreamSmoothingPreset[]).map((p) => (
          <Button
            disabled={running}
            key={p}
            type={preset === p ? 'primary' : 'default'}
            onClick={() => setPreset(p)}
          >
            preset: {p}
          </Button>
        ))}
        <Button type={slowMotion ? 'primary' : 'default'} onClick={() => setSlowMotion((v) => !v)}>
          slow-mo fade {slowMotion ? 'ON' : 'OFF'}
        </Button>
        <Button type="primary" onClick={running ? stop : start}>
          {running ? 'Stop' : 'Reproduce'}
        </Button>
      </Flexbox>

      <div style={panelStyle}>
        <div>
          <strong>{config.label}</strong>
        </div>
        <div style={{ marginTop: 4 }}>{config.description}</div>
        <div style={{ marginTop: 4, opacity: 0.75 }}>{config.hypothesis}</div>
        <div style={{ marginTop: 8, opacity: 0.65 }}>
          Slow-mo mode extends the fadeIn animation to 2000ms and outlines any
          `.stream-char-revealed` span in red, so chars that skipped the fade are visually obvious.
        </div>
      </div>

      <div style={counterStyle}>
        <span>birth total: {totalAtBirth}</span>
        <span style={{ color: 'rgb(82, 196, 26)' }}>animated@birth: {stats.animated}</span>
        <span style={{ color: 'rgb(255, 77, 79)' }}>skipped@birth: {stats.skipped}</span>
        <span>miss rate: {missRate}</span>
        <span>
          live revealed/total: {stats.revealedLive}/{stats.totalLive}
        </span>
      </div>

      <div data-repro-slow={slowMotion ? '1' : '0'} ref={rootRef} style={{ minHeight: 200 }}>
        <Markdown animated streamSmoothingPreset={preset} variant="chat">
          {content}
        </Markdown>
      </div>
    </Flexbox>
  );
};
