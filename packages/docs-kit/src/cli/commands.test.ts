import { commands, createCliContext } from './commands';
import { resolveBin } from './resolveBin';
import { runProcess } from './runProcess';

vi.mock('./resolveBin', () => ({
  resolveBin: vi.fn(() => '/kit/node_modules/@react-router/dev/bin.js'),
}));

vi.mock('./runProcess', () => ({
  runProcess: vi.fn(async () => undefined),
}));

const context = createCliContext('/kit', process.cwd());

afterEach(() => {
  vi.mocked(runProcess).mockClear();
  vi.mocked(resolveBin).mockClear();
});

describe('commands signal-flag wiring', () => {
  it('passes treatSignalsAsSuccess: true for dev', async () => {
    await commands.dev(context, []);

    expect(runProcess).toHaveBeenCalledWith(
      process.execPath,
      expect.any(Array),
      expect.objectContaining({ cwd: context.cwd, treatSignalsAsSuccess: true }),
    );
  });

  it('does not set treatSignalsAsSuccess for build', async () => {
    await commands.build(context, []);

    const [reactRouterCall] = vi.mocked(runProcess).mock.calls;
    expect(reactRouterCall[2]).toEqual({ cwd: context.cwd });
  });

  it('does not set treatSignalsAsSuccess for typegen', async () => {
    await commands.typegen(context, []);

    expect(runProcess).toHaveBeenCalledWith(process.execPath, expect.any(Array), {
      cwd: context.cwd,
    });
  });
});
