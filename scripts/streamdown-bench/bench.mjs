import { execFileSync, execSync } from 'node:child_process';

const [url, label = 'run', session = 'sdbench'] = process.argv.slice(2);
const ab = (...args) => execFileSync('agent-browser', ['--session', session, ...args], { encoding: 'utf8', maxBuffer: 1e8 }).trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const parseCpu = (t) => {
  const parts = t.trim().split(':').map(Number);
  return parts.reduce((acc, v) => acc * 60 + v, 0);
};
const procs = () =>
  execSync('ps -axo pid=,ppid=,cputime=,args=', { encoding: 'utf8', maxBuffer: 1e8 })
    .split('\n')
    .map((l) => l.trim().match(/^(\d+)\s+(\d+)\s+(\S+)\s+(.*)$/))
    .filter(Boolean)
    .map((m) => ({ pid: +m[1], ppid: +m[2], cpu: parseCpu(m[3]), args: m[4] }));
const renderers = () => procs().filter((p) => p.args.includes('--type=renderer'));
const gpuFor = (ppid) => procs().find((p) => p.ppid === ppid && p.args.includes('--type=gpu-process'));

ab('open', url);
ab('wait', 'button[data-phase="idle"]');
await sleep(1500);

const before = new Map(renderers().map((p) => [p.pid, p]));
ab('eval', 'const t=performance.now();while(performance.now()-t<2500){};1');
const after = renderers();
const target = after
  .map((p) => ({ ...p, delta: p.cpu - (before.get(p.pid)?.cpu ?? 0) }))
  .sort((a, b) => b.delta - a.delta)[0];
if (!target || target.delta < 1) throw new Error('could not identify demo renderer');
const gpu = gpuFor(target.ppid);
await sleep(1500);

const r0 = procs().find((p) => p.pid === target.pid).cpu;
const g0 = gpu ? procs().find((p) => p.pid === gpu.pid).cpu : 0;
const t0 = Date.now();
ab('click', 'button[data-phase="idle"]');
let phase = '';
while (phase !== 'done') {
  await sleep(5000);
  phase = JSON.parse(ab("eval", "document.querySelector(\"button[data-phase]\").dataset.phase"));
}
const wall = (Date.now() - t0) / 1000;
const r1 = procs().find((p) => p.pid === target.pid).cpu;
const g1 = gpu ? procs().find((p) => p.pid === gpu.pid).cpu : 0;
const dom = JSON.parse(JSON.parse(ab("eval", "JSON.stringify({nodes:document.querySelectorAll('*').length,spans:document.querySelectorAll('.stream-char').length})")));
console.log(JSON.stringify({ label, wall: +wall.toFixed(1), renderer: +(((r1 - r0) / wall) * 100).toFixed(1), gpu: +(((g1 - g0) / wall) * 100).toFixed(1), dom }));
