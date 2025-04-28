import { describe, expect, it } from 'vitest';

import { ALIYUN_API, UNPKG_API, genCdnUrl } from './genCdnUrl';

describe('genCdnUrl', () => {
  it('should generate unpkg url correctly', () => {
    const url = genCdnUrl({
      path: 'dist/index.js',
      pkg: 'test-package',
      proxy: 'unpkg',
      version: '1.0.0',
    });

    expect(url).toBe(`${UNPKG_API}/test-package@1.0.0/dist/index.js`);
  });

  it('should generate aliyun url correctly', () => {
    const url = genCdnUrl({
      path: 'dist/index.js',
      pkg: 'test-package',
      proxy: 'aliyun',
      version: '1.0.0',
    });

    expect(url).toBe(`${ALIYUN_API}/test-package/1.0.0/files/dist/index.js`);
  });

  it('should use aliyun as default proxy if not specified', () => {
    const url = genCdnUrl({
      path: 'dist/index.js',
      pkg: 'test-package',
      version: '1.0.0',
    });

    expect(url).toBe(`${ALIYUN_API}/test-package/1.0.0/files/dist/index.js`);
  });

  it('should use latest version if version not specified', () => {
    const url = genCdnUrl({
      path: 'dist/index.js',
      pkg: 'test-package',
      proxy: 'unpkg',
    });

    expect(url).toBe(`${UNPKG_API}/test-package@latest/dist/index.js`);
  });

  it('should handle paths with leading slash', () => {
    const url = genCdnUrl({
      path: '/dist/index.js',
      pkg: 'test-package',
      proxy: 'unpkg',
      version: '1.0.0',
    });

    expect(url).toBe(`${UNPKG_API}/test-package@1.0.0/dist/index.js`);
  });

  it('should handle paths with multiple segments', () => {
    const url = genCdnUrl({
      path: 'dist/js/main/index.js',
      pkg: 'test-package',
      proxy: 'unpkg',
      version: '1.0.0',
    });

    expect(url).toBe(`${UNPKG_API}/test-package@1.0.0/dist/js/main/index.js`);
  });

  it('should handle package names with scopes', () => {
    const url = genCdnUrl({
      path: 'dist/index.js',
      pkg: '@scope/package',
      proxy: 'unpkg',
      version: '1.0.0',
    });

    expect(url).toBe(`${UNPKG_API}/@scope/package@1.0.0/dist/index.js`);
  });
});
