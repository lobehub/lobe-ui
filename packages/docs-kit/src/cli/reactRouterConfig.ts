import { createHash, randomUUID } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import { mkdir, readdir, realpath, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const CONFIG_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts'];
const GENERATED_CONFIG_FILENAME = 'react-router.config.mjs';
const GENERATED_CONFIG_MARKER = '// @lobehub/docs-kit generated react-router config';
const LEASE_FILENAME_PATTERN = /^(\d+)-[\da-f-]+\.lease$/i;
const TERMINATION_SIGNALS = ['SIGINT', 'SIGTERM'] as const;

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error && error.code === 'ENOENT';

const isProcessAlive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error instanceof Error && 'code' in error && error.code !== 'ESRCH';
  }
};

const findReactRouterConfig = (cwd: string): string | undefined => {
  for (const extension of CONFIG_EXTENSIONS) {
    const configPath = path.join(cwd, `react-router.config${extension}`);
    if (existsSync(configPath)) return configPath;
  }
};

const createGeneratedConfig = (defaultConfigPath: string): string =>
  [
    GENERATED_CONFIG_MARKER,
    '// This file is managed by `lobedocs` and is removed when the command exits.',
    `export { default } from ${JSON.stringify(pathToFileURL(defaultConfigPath).href)};`,
    '',
  ].join('\n');

const isGeneratedConfig = (configPath: string): boolean => {
  try {
    return readFileSync(configPath, 'utf8').startsWith(GENERATED_CONFIG_MARKER);
  } catch {
    return false;
  }
};

const getLeaseDirectory = async (cwd: string): Promise<string> => {
  const canonicalCwd = await realpath(cwd).catch(() => path.resolve(cwd));
  const repositoryId = createHash('sha256').update(canonicalCwd).digest('hex');
  return path.join(tmpdir(), 'lobedocs-react-router-config', repositoryId);
};

const removeStaleLeases = async (leaseDirectory: string): Promise<string[]> => {
  let entries: string[];
  try {
    entries = await readdir(leaseDirectory);
  } catch (error) {
    if (isMissingFileError(error)) return [];
    throw error;
  }

  const activeLeases: string[] = [];
  for (const entry of entries) {
    const match = LEASE_FILENAME_PATTERN.exec(entry);
    if (!match) continue;

    if (isProcessAlive(Number(match[1]))) {
      activeLeases.push(entry);
      continue;
    }

    await unlink(path.join(leaseDirectory, entry)).catch((error: unknown) => {
      if (!isMissingFileError(error)) throw error;
    });
  }
  return activeLeases;
};

const removeStaleLeasesSync = (leaseDirectory: string): string[] => {
  let entries: string[];
  try {
    entries = readdirSync(leaseDirectory);
  } catch {
    return [];
  }

  const activeLeases: string[] = [];
  for (const entry of entries) {
    const match = LEASE_FILENAME_PATTERN.exec(entry);
    if (!match) continue;

    if (isProcessAlive(Number(match[1]))) {
      activeLeases.push(entry);
      continue;
    }

    try {
      unlinkSync(path.join(leaseDirectory, entry));
    } catch {
      // Another process may have removed the same stale lease.
    }
  }
  return activeLeases;
};

const removeGeneratedConfig = async (configPath: string): Promise<void> => {
  if (!isGeneratedConfig(configPath)) return;
  await unlink(configPath).catch((error: unknown) => {
    if (!isMissingFileError(error)) throw error;
  });
};

const removeGeneratedConfigSync = (configPath: string): void => {
  if (!isGeneratedConfig(configPath)) return;
  try {
    unlinkSync(configPath);
  } catch {
    // Best-effort cleanup during process exit.
  }
};

export interface ReactRouterConfigOptions {
  cwd: string;
  defaultConfigPath: string;
}

export const withReactRouterConfig = async <Result>(
  { cwd, defaultConfigPath }: ReactRouterConfigOptions,
  run: (configPath: string) => Promise<Result>,
): Promise<Result> => {
  const generatedConfigPath = path.join(cwd, GENERATED_CONFIG_FILENAME);
  const leaseDirectory = await getLeaseDirectory(cwd);
  const leasePath = path.join(leaseDirectory, `${process.pid}-${randomUUID()}.lease`);

  await mkdir(leaseDirectory, { recursive: true });
  await removeStaleLeases(leaseDirectory);
  await writeFile(leasePath, '');

  const cleanupSync = (): void => {
    try {
      unlinkSync(leasePath);
    } catch {
      // The async cleanup path may already have removed this lease.
    }
    if (removeStaleLeasesSync(leaseDirectory).length === 0) {
      removeGeneratedConfigSync(generatedConfigPath);
    }
  };
  process.once('exit', cleanupSync);

  let receivedSignal: (typeof TERMINATION_SIGNALS)[number] | undefined;
  const signalHandlers = TERMINATION_SIGNALS.map((signal) => {
    const handler = (): void => {
      receivedSignal ??= signal;
      cleanupSync();
    };
    process.once(signal, handler);
    return [signal, handler] as const;
  });

  try {
    let configPath = findReactRouterConfig(cwd);
    if (!configPath) {
      try {
        await writeFile(generatedConfigPath, createGeneratedConfig(defaultConfigPath), {
          flag: 'wx',
        });
      } catch (error) {
        if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error;
      }
      configPath = findReactRouterConfig(cwd);
    }

    if (!configPath) {
      throw new Error(`Unable to provide a React Router config in ${cwd}`);
    }
    if (receivedSignal) {
      throw new Error(`lobedocs received ${receivedSignal} before React Router started`);
    }
    return await run(configPath);
  } finally {
    process.off('exit', cleanupSync);
    for (const [signal, handler] of signalHandlers) process.off(signal, handler);
    await unlink(leasePath).catch((error: unknown) => {
      if (!isMissingFileError(error)) throw error;
    });
    if ((await removeStaleLeases(leaseDirectory)).length === 0) {
      await removeGeneratedConfig(generatedConfigPath);
    }
  }
};
