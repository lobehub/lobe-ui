const worker = new Worker(new URL('./browser-worker.ts', import.meta.url));

void import('./helper');

export default function BrowserOnlyDemo() {
  return <button onClick={() => worker.terminate()}>Stop worker</button>;
}
