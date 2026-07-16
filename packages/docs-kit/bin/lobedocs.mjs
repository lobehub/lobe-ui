#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const kitRoot = fileURLToPath(new URL('..', import.meta.url));
const cliEntryPath = path.join(kitRoot, 'src/cli/main.ts');

const cwd = process.cwd();
const consumerRequire = createRequire(pathToFileURL(path.join(cwd, 'package.json')).href);
const tsxLoaderUrl = pathToFileURL(consumerRequire.resolve('tsx')).href;

const child = spawn(
  process.execPath,
  ['--import', tsxLoaderUrl, cliEntryPath, ...process.argv.slice(2)],
  { cwd, stdio: 'inherit' },
);

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
