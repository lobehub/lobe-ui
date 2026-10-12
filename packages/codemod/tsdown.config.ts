import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: false,
  entry: { bin: 'src/bin.ts' },
  format: 'esm',
  platform: 'node',
});
