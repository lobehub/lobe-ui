const executionLog = ((globalThis as any).__lobeDemoExecutionLog ??= []);

executionLog.push('simple');

export default function SimpleDemo() {
  return <div>Simple canonical demo</div>;
}
