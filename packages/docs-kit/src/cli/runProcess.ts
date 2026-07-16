import { spawn, type SpawnOptions } from 'node:child_process';

const TERMINATION_SIGNALS = new Set(['SIGINT', 'SIGTERM']);

export const runProcess = (
  command: string,
  args: string[],
  options: SpawnOptions = {},
): Promise<void> =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        if (TERMINATION_SIGNALS.has(signal)) {
          resolvePromise();
          return;
        }
        reject(new Error(`${command} ${args.join(' ')} exited via signal ${signal}`));
        return;
      }
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
        return;
      }
      resolvePromise();
    });
  });
