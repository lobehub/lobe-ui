import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const srcRoot = resolve(root, 'src');
const outRoot = resolve(root, 'es');

const ensureDir = (filePath: string) => {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

const walk = (dir: string, onFile: (file: string) => void) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) walk(full, onFile);
    else if (entry.isFile()) onFile(full);
    else if (entry.isSymbolicLink()) {
      const s = statSync(full);
      if (s.isDirectory()) walk(full, onFile);
      if (s.isFile()) onFile(full);
    }
  }
};

const copyStatic = () => {
  if (!existsSync(outRoot)) return;

  walk(srcRoot, (file) => {
    if (!file.endsWith('.css')) return;
    const relative = file.slice(srcRoot.length + 1);
    const outFile = resolve(outRoot, relative);
    ensureDir(outFile);
    copyFileSync(file, outFile);
  });
};

copyStatic();
