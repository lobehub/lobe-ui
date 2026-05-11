import { HtmlPreview } from '@lobehub/ui';

// Full-document HTML that exercises every piece of the head pipeline:
//   - Two CDN <script> tags in <head>  (Tailwind + Chart.js)
//   - <meta> tags
//   - Inline body script that depends on a head-loaded library
//   - DOM event listeners (sliders + button)
//   - Multiple co-operating scripts (Chart.js, sim, UI wiring)
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans p-6 min-h-screen">
  <div class="max-w-2xl mx-auto">
    <header class="flex items-center gap-3 mb-5">
      <span class="px-2 py-1 text-[10px] uppercase tracking-wider rounded-full bg-cyan-400 text-slate-900 font-semibold">live</span>
      <h2 class="text-lg font-semibold">Spring tuning playground</h2>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Chart panel -->
      <div class="rounded-xl bg-slate-900 p-4 border border-slate-800">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs uppercase tracking-wider text-slate-400">Step response</h3>
          <span class="text-[10px] text-slate-500" id="settled">—</span>
        </div>
        <canvas id="chart" style="aspect-ratio: 16/10; width: 100%;"></canvas>
      </div>

      <!-- Controls panel -->
      <div class="rounded-xl bg-slate-900 p-4 border border-slate-800 space-y-4">
        <label class="block">
          <div class="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>tension</span>
            <span id="tensionV" class="tabular-nums text-slate-200 font-medium">220</span>
          </div>
          <input id="tension" type="range" min="50" max="500" value="220" class="w-full accent-cyan-400" />
        </label>
        <label class="block">
          <div class="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>friction</span>
            <span id="frictionV" class="tabular-nums text-slate-200 font-medium">20</span>
          </div>
          <input id="friction" type="range" min="0" max="50" value="20" class="w-full accent-cyan-400" />
        </label>
        <label class="block">
          <div class="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>mass</span>
            <span id="massV" class="tabular-nums text-slate-200 font-medium">1.0</span>
          </div>
          <input id="mass" type="range" min="10" max="100" value="10" class="w-full accent-cyan-400" />
        </label>
        <button id="copy" class="w-full mt-2 py-2 rounded-lg bg-cyan-400 text-slate-900 text-sm font-semibold hover:bg-cyan-300 transition">
          Copy as prompt
        </button>
      </div>
    </div>

    <p class="mt-4 text-xs text-slate-500">
      Tailwind for layout, Chart.js for the curve, a tiny inline simulator for the physics.
      Drag the sliders — the chart re-renders live.
    </p>
  </div>

  <script>
    (function () {
      // Tiny physics simulator — settled step response for a unit input
      function simulate(tension, friction, mass) {
        const steps = 90;
        const dt = 0.016;
        let x = 0;
        let v = 0;
        const series = [];
        let settledAt = null;
        for (let i = 0; i < steps; i++) {
          const force = (tension * (1 - x)) / 100;
          const damping = (-friction * v) / 10;
          const a = (force + damping) / mass;
          v += a * dt;
          x += v * dt;
          series.push(x);
          if (settledAt === null && Math.abs(1 - x) < 0.02 && Math.abs(v) < 0.5) {
            settledAt = (i * dt).toFixed(2);
          }
        }
        return { series, settledAt };
      }

      function init() {
        const ctx = document.getElementById('chart').getContext('2d');
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array.from({ length: 90 }, (_, i) => (i * 0.016).toFixed(2)),
            datasets: [
              {
                data: [],
                borderColor: 'rgb(34, 211, 238)',
                borderWidth: 2,
                tension: 0.25,
                pointRadius: 0,
                fill: { target: 'origin', above: 'rgba(34, 211, 238, 0.08)' },
              },
              {
                data: Array(90).fill(1),
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderWidth: 1,
                borderDash: [4, 4],
                pointRadius: 0,
              },
            ],
          },
          options: {
            maintainAspectRatio: true,
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
              x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 }, maxTicksLimit: 6 },
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } },
                min: -0.2,
                max: 1.6,
              },
            },
            animation: { duration: 180 },
          },
        });

        const tension = document.getElementById('tension');
        const friction = document.getElementById('friction');
        const mass = document.getElementById('mass');
        const tensionV = document.getElementById('tensionV');
        const frictionV = document.getElementById('frictionV');
        const massV = document.getElementById('massV');
        const settled = document.getElementById('settled');
        const copy = document.getElementById('copy');

        function refresh() {
          const t = Number(tension.value);
          const f = Number(friction.value);
          const m = Number(mass.value) / 10;
          tensionV.textContent = String(t);
          frictionV.textContent = String(f);
          massV.textContent = m.toFixed(1);
          const { series, settledAt } = simulate(t, f, m);
          chart.data.datasets[0].data = series;
          chart.update();
          settled.textContent = settledAt ? 'settles in ' + settledAt + 's' : 'still oscillating';
        }

        tension.addEventListener('input', refresh);
        friction.addEventListener('input', refresh);
        mass.addEventListener('input', refresh);
        copy.addEventListener('click', function () {
          const prompt =
            'spring({ tension: ' + tension.value +
            ', friction: ' + friction.value +
            ', mass: ' + (Number(mass.value) / 10).toFixed(1) + ' })';
          alert(prompt);
        });

        refresh();
      }

      // Chart.js arrives async — poll briefly for it before booting the UI.
      if (window.Chart) {
        init();
      } else {
        const waitFor = setInterval(function () {
          if (window.Chart) {
            clearInterval(waitFor);
            init();
          }
        }, 50);
      }
    })();
  </script>
</body>
</html>
`;

export default () => (
  <HtmlPreview defaultHeight={520} fileName={'spring-tuning.html'} theme={'dark'}>
    {html}
  </HtmlPreview>
);
