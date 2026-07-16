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

  it('resolves when the child is terminated by SIGINT', async () => {
    await expect(
      runProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGINT")']),
    ).resolves.toBeUndefined();
  });

  it('resolves when the child is terminated by SIGTERM', async () => {
    await expect(
      runProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGTERM")']),
    ).resolves.toBeUndefined();
  });

  it('rejects when the child is terminated by another signal', async () => {
    await expect(
      runProcess(process.execPath, ['-e', 'process.kill(process.pid, "SIGHUP")']),
    ).rejects.toThrow(/exited via signal SIGHUP/);
  });
});
