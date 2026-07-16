import path from 'node:path';

import { resolveBin } from './resolveBin';

describe('resolveBin', () => {
  it('resolves a string-form bin field', () => {
    const requireFn = () => '/repo/node_modules/some-pkg/package.json';
    const readFileMock = () => JSON.stringify({ bin: 'bin.cjs', name: 'some-pkg' });

    const result = resolveBin('some-pkg', 'some-pkg', requireFn, readFileMock);

    expect(result).toBe(path.join('/repo/node_modules/some-pkg', 'bin.cjs'));
  });

  it('resolves an object-form bin field by the given key', () => {
    const requireFn = () => '/repo/node_modules/@react-router/dev/package.json';
    const readFileMock = () =>
      JSON.stringify({ bin: { 'react-router': 'bin.cjs' }, name: '@react-router/dev' });

    const result = resolveBin('@react-router/dev', 'react-router', requireFn, readFileMock);

    expect(result).toBe(path.join('/repo/node_modules/@react-router/dev', 'bin.cjs'));
  });

  it('throws when the named key is missing from an object-form bin field', () => {
    const requireFn = () => '/repo/node_modules/@react-router/dev/package.json';
    const readFileMock = () =>
      JSON.stringify({ bin: { other: 'bin.cjs' }, name: '@react-router/dev' });

    expect(() => resolveBin('@react-router/dev', 'react-router', requireFn, readFileMock)).toThrow(
      /Unable to resolve the "react-router" bin entry/,
    );
  });
});
