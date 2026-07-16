#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KNOWN_COMMANDS = ['build', 'dev', 'typegen'];

const kitRoot = fileURLToPath(new URL('..', import.meta.url));
const cliEntryPath = path.join(kitRoot, 'src/cli/main.ts');

const cwd = process.cwd();
const consumerRequire = createRequire(pathToFileURL(path.join(cwd, 'package.json')).href);
const tsxLoaderUrl = pathToFileURL(consumerRequire.resolve('tsx')).href;

const [command] = process.argv.slice(2);
if (!KNOWN_COMMANDS.includes(command)) {
  console.error(`Unknown lobedocs command: ${command ?? '<none>'}`);
  console.error(`Usage: lobedocs <${KNOWN_COMMANDS.join('|')}> [...args]`);
  process.exit(1);
}

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
