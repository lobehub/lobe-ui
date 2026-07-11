import { helperLabel } from './helper';

const executionLog = ((globalThis as any).__lobeDemoExecutionLog ??= []);

executionLog.push('local-import');

export default function LocalImportDemo() {
  return <div>{helperLabel}</div>;
}
