import { describe, expect, it } from 'vitest';

import { buildStaticSrcDoc } from './buildStaticSrcDoc';
import { AUTO_HEIGHT_MESSAGE_TYPE } from './injectAutoHeightScript';

describe('buildStaticSrcDoc', () => {
  it('wraps a fragment in a full document and injects shims', () => {
    const out = buildStaticSrcDoc({ content: '<div>hi</div>', frameId: 'fid' });
    expect(out.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(out).toContain('<div>hi</div>');
    expect(out).toContain('localStorage');
    expect(out).toContain(AUTO_HEIGHT_MESSAGE_TYPE);
  });

  it('preserves user head children and injects shims right after <head>', () => {
    const input =
      '<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-950">hi</body></html>';
    const out = buildStaticSrcDoc({ content: input, frameId: 'fid' });
    // User script must remain in the document so the browser parser fetches and
    // executes it natively.
    expect(out).toContain('<script src="https://cdn.tailwindcss.com"></script>');
    // Body content preserved verbatim
    expect(out).toContain('<body class="bg-slate-950">hi</body>');
    // Shims sit before the Tailwind tag so the storage shim is in place by the
    // time user scripts run.
    const shimIdx = out.indexOf('localStorage');
    const tailwindIdx = out.indexOf('cdn.tailwindcss.com');
    expect(shimIdx).toBeGreaterThan(-1);
    expect(tailwindIdx).toBeGreaterThan(shimIdx);
  });

  it('falls back to injecting before </head> when no opening head tag is found', () => {
    const input = '<html><head>\n<title>t</title>\n</head><body>x</body></html>';
    const out = buildStaticSrcDoc({ content: input, frameId: 'fid' });
    expect(out).toContain('localStorage');
    expect(out).toContain('<title>t</title>');
    expect(out).toContain('<body>x</body>');
  });

  it('applies background to base styles when provided', () => {
    const out = buildStaticSrcDoc({
      background: '#1f1f1f',
      content: '<div></div>',
      frameId: 'fid',
    });
    expect(out).toContain('background:#1f1f1f');
  });
});
