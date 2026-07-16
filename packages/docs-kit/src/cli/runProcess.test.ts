import { runProcess } from './runProcess';

describe('runProcess', () => {
  it('resolves on a normal zero-code exit', async () => {
    await expect(runProcess(process.execPath, ['-e', 'process.exit(0)'])).resolves.toBeUndefined();
  });

  it('rejects on a non-zero exit code', async () => {
    await expect(runProcess(process.execPath, ['-e', 'process.exit(1)'])).rejects.toThrow(
      /exited with code 1/,
    );
  });

  it('rejects when the child is terminated by SIGINT by default', async () => {
    await expect(
      runProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGINT")']),
    ).rejects.toThrow(/exited via signal SIGINT/);
  });

  it('rejects when the child is terminated by SIGTERM by default', async () => {
    await expect(
      runProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGTERM")']),
    ).rejects.toThrow(/exited via signal SIGTERM/);
  });

  it('rejects when the child is terminated by another signal', async () => {
    await expect(
      runProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGHUP")']),
    ).rejects.toThrow(/exited via signal SIGHUP/);
  });

  it('resolves when the child is terminated by SIGINT and treatSignalsAsSuccess is set', async () => {
    await expect(
      runProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGINT")'], {
        treatSignalsAsSuccess: true,
      }),
    ).resolves.toBeUndefined();
  });

  it('resolves when the child is terminated by SIGTERM and treatSignalsAsSuccess is set', async () => {
    await expect(
      runProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGTERM")'], {
        treatSignalsAsSuccess: true,
      }),
    ).resolves.toBeUndefined();
  });

  it('rejects when the child is terminated by another signal even if treatSignalsAsSuccess is set', async () => {
    await expect(
      runProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGHUP")'], {
        treatSignalsAsSuccess: true,
      }),
    ).rejects.toThrow(/exited via signal SIGHUP/);
  });
});
