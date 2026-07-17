import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { withReactRouterConfig } from './reactRouterConfig';

const createConsumer = () => mkdtemp(path.join(tmpdir(), 'lobedocs-consumer-'));

describe('withReactRouterConfig', () => {
  const consumers: string[] = [];

  afterEach(async () => {
    await Promise.all(consumers.splice(0).map((consumer) => rm(consumer, { recursive: true })));
  });

  it('provides and then removes the kit default when the consumer has no config', async () => {
    const consumer = await createConsumer();
    consumers.push(consumer);
    const defaultConfigPath = path.join(consumer, 'kit-default.ts');

    await withReactRouterConfig({ cwd: consumer, defaultConfigPath }, async (configPath) => {
      expect(configPath).toBe(path.join(consumer, 'react-router.config.mjs'));
      expect(existsSync(configPath)).toBe(true);
      expect(await readFile(configPath, 'utf8')).toContain(
        `export { default } from ${JSON.stringify(pathToFileURL(defaultConfigPath).href)}`,
      );
    });

    expect(existsSync(path.join(consumer, 'react-router.config.mjs'))).toBe(false);
  });

  it('preserves an explicit consumer config', async () => {
    const consumer = await createConsumer();
    consumers.push(consumer);
    const configPath = path.join(consumer, 'react-router.config.ts');
    const contents = 'export default { basename: "/docs" };\n';
    await writeFile(configPath, contents);

    await withReactRouterConfig(
      { cwd: consumer, defaultConfigPath: '/kit/react-router-config.ts' },
      async (resolvedConfigPath) => {
        expect(resolvedConfigPath).toBe(configPath);
      },
    );

    expect(await readFile(configPath, 'utf8')).toBe(contents);
  });

  it('keeps the generated config until every concurrent command releases its lease', async () => {
    const consumer = await createConsumer();
    consumers.push(consumer);
    const configPath = path.join(consumer, 'react-router.config.mjs');
    let releaseFirst: (() => void) | undefined;
    let firstStarted: (() => void) | undefined;
    const firstReady = new Promise<void>((resolve) => {
      firstStarted = resolve;
    });
    const firstBlocked = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });

    const firstCommand = withReactRouterConfig(
      { cwd: consumer, defaultConfigPath: '/kit/react-router-config.ts' },
      async () => {
        firstStarted?.();
        await firstBlocked;
      },
    );
    await firstReady;

    await withReactRouterConfig(
      { cwd: consumer, defaultConfigPath: '/kit/react-router-config.ts' },
      async () => {
        expect(existsSync(configPath)).toBe(true);
      },
    );
    expect(existsSync(configPath)).toBe(true);

    releaseFirst?.();
    await firstCommand;
    expect(existsSync(configPath)).toBe(false);
  });

  it('cleans the generated config after a failed command', async () => {
    const consumer = await createConsumer();
    consumers.push(consumer);
    const configPath = path.join(consumer, 'react-router.config.mjs');

    await expect(
      withReactRouterConfig(
        { cwd: consumer, defaultConfigPath: '/kit/react-router-config.ts' },
        async () => {
          throw new Error('build failed');
        },
      ),
    ).rejects.toThrow('build failed');
    expect(existsSync(configPath)).toBe(false);
  });

  it('cleans the generated config immediately on termination', async () => {
    const consumer = await createConsumer();
    consumers.push(consumer);
    const configPath = path.join(consumer, 'react-router.config.mjs');
    const existingHandlers = new Set(process.listeners('SIGINT'));

    await withReactRouterConfig(
      { cwd: consumer, defaultConfigPath: '/kit/react-router-config.ts' },
      async () => {
        const terminationHandler = process
          .listeners('SIGINT')
          .find((handler) => !existingHandlers.has(handler));
        expect(terminationHandler).toBeDefined();

        terminationHandler?.('SIGINT');
        expect(existsSync(configPath)).toBe(false);
      },
    );

    expect(process.listeners('SIGINT').every((handler) => existingHandlers.has(handler))).toBe(
      true,
    );
  });
});
