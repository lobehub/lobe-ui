import { buildReactRouterArgs } from './reactRouterArgs';

describe('buildReactRouterArgs', () => {
  it('pins the consumer cwd as the root positional ahead of --config', () => {
    const args = buildReactRouterArgs('build', '/consumer/repo', '/kit/vite.config.ts', []);

    expect(args).toEqual(['build', '/consumer/repo', '--config', '/kit/vite.config.ts']);
  });

  it('appends any extra args after --config and the kit vite config path', () => {
    const args = buildReactRouterArgs('dev', '/consumer/repo', '/kit/vite.config.ts', [
      '--port',
      '4000',
    ]);

    expect(args).toEqual([
      'dev',
      '/consumer/repo',
      '--config',
      '/kit/vite.config.ts',
      '--port',
      '4000',
    ]);
  });
});
