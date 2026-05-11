import { describe, expect, it } from 'vitest';

import { buildShellSrcDoc, SHELL_UPDATE_MESSAGE_TYPE } from './buildShellSrcDoc';
import { AUTO_HEIGHT_MESSAGE_TYPE } from './injectAutoHeightScript';

describe('buildShellSrcDoc', () => {
  it('produces a single complete HTML document with required infrastructure', () => {
    const out = buildShellSrcDoc({ frameId: 'fid' });
    expect(out.startsWith('<!DOCTYPE html>')).toBe(true);
    // Storage shim and auto-resize script injected
    expect(out).toContain('localStorage');
    expect(out).toContain(AUTO_HEIGHT_MESSAGE_TYPE);
    // Message listener for incremental updates
    expect(out).toContain(SHELL_UPDATE_MESSAGE_TYPE);
    // Frame id baked into the listener so we can ignore cross-frame chatter
    expect(out).toContain('"fid"');
    // Fade-in class declared
    expect(out).toContain('lobe-html-new');
    expect(out).toContain('lobe-html-fade');
    // Placeholders for the dynamic user content
    expect(out).toContain('id="lobe-user-style"');
    expect(out).toContain('<body></body>');
  });

  it('applies background to base style when provided', () => {
    const out = buildShellSrcDoc({ background: '#1f1f1f', frameId: 'fid' });
    expect(out).toContain('background:#1f1f1f');
  });

  it('omits background rule when not provided', () => {
    const out = buildShellSrcDoc({ frameId: 'fid' });
    expect(out).not.toContain('background:');
  });
});
