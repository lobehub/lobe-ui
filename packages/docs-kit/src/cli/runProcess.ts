import { spawn, type SpawnOptions } from 'node:child_process';

const TERMINATION_SIGNALS = new Set(['SIGINT', 'SIGTERM']);

export interface RunProcessOptions extends SpawnOptions {
  treatSignalsAsSuccess?: boolean;
}

export const runProcess = (
  command: string,
  args: string[],
  options: RunProcessOptions = {},
): Promise<void> =>
  new Promise((resolvePromise, reject) => {
    const { treatSignalsAsSuccess = false, ...spawnOptions } = options;
    const child = spawn(command, args, { stdio: 'inherit', ...spawnOptions });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        if (treatSignalsAsSuccess && TERMINATION_SIGNALS.has(signal)) {
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
