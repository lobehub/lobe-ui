import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@lobehub\/streamdown\/profiler$/, replacement: src('../src/profiler') },
      { find: /^@lobehub\/streamdown$/, replacement: src('../src') },
    ],
  },
});
