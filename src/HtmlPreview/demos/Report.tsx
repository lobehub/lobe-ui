import { HtmlPreview } from '@lobehub/ui';

// "Weekly product report" — a full report-style HTML document of the kind
// a model would produce when asked for analytics findings. Exercises a
// realistic head/body resource matrix:
//   - <head>: Tailwind CDN + Chart.js CDN + meta tags + a small inline
//     <style> for chart container helpers
//   - <body>: KPI cards, line chart with two series, donut chart, bar
//     chart, an events table, and a footnote
//   - <script>: simulates real LLM output that boots three Chart.js
//     instances once the CDN settles
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Weekly product report — Apr 15 – Apr 21</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    body { font-feature-settings: "cv11", "ss01"; }
    .chart-host { position: relative; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans">
  <div class="max-w-5xl mx-auto p-6 space-y-6">

    <!-- Header -->
    <header>
      <div class="flex items-center justify-between mb-1">
        <h1 class="text-xl font-semibold tracking-tight">Weekly product report</h1>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">live</span>
          <span class="text-xs text-slate-400 tabular-nums">Apr 22, 2026</span>
        </div>
      </div>
      <p class="text-sm text-slate-400">
        Activity for <span class="text-slate-200">Apr 15 – Apr 21</span>, compared to the prior week. Numbers are aggregated from
        <code class="text-xs text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded">events.warehouse.product_events</code>.
      </p>
    </header>

    <!-- KPI cards -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
        <div class="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Active users</div>
        <div class="text-2xl font-semibold tabular-nums">48,213</div>
        <div class="mt-1.5 text-xs tabular-nums text-emerald-400">▲ 12.4% w/w</div>
      </div>
      <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
        <div class="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Revenue</div>
        <div class="text-2xl font-semibold tabular-nums">$284.5k</div>
        <div class="mt-1.5 text-xs tabular-nums text-emerald-400">▲ 5.1% w/w</div>
      </div>
      <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
        <div class="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Conversion</div>
        <div class="text-2xl font-semibold tabular-nums">3.42%</div>
        <div class="mt-1.5 text-xs tabular-nums text-rose-400">▼ 0.3pp w/w</div>
      </div>
      <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
        <div class="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Retention · D7</div>
        <div class="text-2xl font-semibold tabular-nums">38.6%</div>
        <div class="mt-1.5 text-xs tabular-nums text-emerald-400">▲ 2.1pp w/w</div>
      </div>
    </section>

    <!-- Findings narrative -->
    <section class="rounded-xl bg-slate-900/50 border border-slate-800 p-5">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Key findings</h2>
      <ul class="space-y-2 text-sm text-slate-300 list-disc list-inside marker:text-cyan-400">
        <li>Active users are up <span class="text-emerald-300 tabular-nums">+12.4%</span>, driven by Tuesday's product-hunt feature.</li>
        <li>Conversion dipped <span class="text-rose-300 tabular-nums">0.3pp</span>; the pricing-page experiment is the most likely culprit.</li>
        <li>Mobile share crossed <span class="text-slate-100">62%</span> for the first time — the new responsive layout is paying off.</li>
        <li>Retention at D7 improved <span class="text-emerald-300 tabular-nums">+2.1pp</span>, consistent with the onboarding rewrite shipping Apr 9.</li>
      </ul>
    </section>

    <!-- Charts row 1 -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="md:col-span-2 rounded-xl bg-slate-900/70 border border-slate-800 p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-medium">Daily active users</h3>
          <div class="flex gap-3 text-[11px] text-slate-400">
            <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-cyan-400"></span>This week</span>
            <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-slate-600"></span>Last week</span>
          </div>
        </div>
        <div class="chart-host" style="aspect-ratio: 16/7;"><canvas id="trafficChart"></canvas></div>
      </div>
      <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
        <h3 class="text-sm font-medium mb-3">Traffic sources</h3>
        <div class="chart-host" style="aspect-ratio: 1/1;"><canvas id="sourcesChart"></canvas></div>
        <div class="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          <span class="flex items-center gap-1.5 text-slate-300"><span class="w-2 h-2 rounded-full bg-cyan-400"></span>Organic search · <span class="tabular-nums text-slate-400">42%</span></span>
          <span class="flex items-center gap-1.5 text-slate-300"><span class="w-2 h-2 rounded-full bg-violet-400"></span>Direct · <span class="tabular-nums text-slate-400">28%</span></span>
          <span class="flex items-center gap-1.5 text-slate-300"><span class="w-2 h-2 rounded-full bg-amber-400"></span>Referral · <span class="tabular-nums text-slate-400">18%</span></span>
          <span class="flex items-center gap-1.5 text-slate-300"><span class="w-2 h-2 rounded-full bg-rose-400"></span>Social · <span class="tabular-nums text-slate-400">12%</span></span>
        </div>
      </div>
    </section>

    <!-- Charts row 2 -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-medium">Top pages by views</h3>
          <span class="text-[10px] uppercase tracking-wider text-slate-500">Top 6</span>
        </div>
        <div class="chart-host" style="aspect-ratio: 16/9;"><canvas id="pagesChart"></canvas></div>
      </div>
      <div class="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
        <h3 class="text-sm font-medium mb-3">Notable events this week</h3>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
              <th class="text-left font-medium py-2">Event</th>
              <th class="text-left font-medium py-2">When</th>
              <th class="text-right font-medium py-2">Impact</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr>
              <td class="py-2 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Product Hunt feature</td>
              <td class="py-2 text-slate-400 text-xs tabular-nums">Apr 16</td>
              <td class="py-2 text-right text-emerald-400 text-xs tabular-nums">+18.4k DAU</td>
            </tr>
            <tr>
              <td class="py-2 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Pricing A/B test launched</td>
              <td class="py-2 text-slate-400 text-xs tabular-nums">Apr 17</td>
              <td class="py-2 text-right text-rose-400 text-xs tabular-nums">−0.3pp CVR</td>
            </tr>
            <tr>
              <td class="py-2 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Onboarding rewrite</td>
              <td class="py-2 text-slate-400 text-xs tabular-nums">Apr 19</td>
              <td class="py-2 text-right text-emerald-400 text-xs tabular-nums">+2.1pp D7</td>
            </tr>
            <tr>
              <td class="py-2 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>API latency incident</td>
              <td class="py-2 text-slate-400 text-xs tabular-nums">Apr 20</td>
              <td class="py-2 text-right text-rose-400 text-xs tabular-nums">−1.8k sessions</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="text-xs text-slate-500 pt-2">
      Generated by the report agent · run id <code class="text-slate-400">rpt_2026w16_3f8a</code>
    </p>
  </div>

  <script>
    (function () {
      // Shared style — keep all three charts visually consistent.
      function gridStyle() {
        return {
          grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
          ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 10 } },
        };
      }

      function init() {
        // ── 1. Daily-active-users dual-line ────────────────────────────
        var trafficCtx = document.getElementById('trafficChart').getContext('2d');
        var thisWeek = [38421, 41203, 67890, 58102, 52341, 45123, 48213];
        var lastWeek = [34890, 36120, 38450, 40210, 41500, 39800, 42890];
        new Chart(trafficCtx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                data: thisWeek,
                borderColor: 'rgb(34, 211, 238)',
                backgroundColor: 'rgba(34, 211, 238, 0.08)',
                borderWidth: 2,
                tension: 0.35,
                pointRadius: 3,
                pointBackgroundColor: 'rgb(34, 211, 238)',
                pointBorderWidth: 0,
                fill: true,
              },
              {
                data: lastWeek,
                borderColor: 'rgba(148, 163, 184, 0.5)',
                borderWidth: 1.5,
                borderDash: [4, 4],
                tension: 0.35,
                pointRadius: 0,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
            scales: { x: gridStyle(), y: Object.assign({ beginAtZero: true }, gridStyle()) },
          },
        });

        // ── 2. Traffic-sources doughnut ────────────────────────────────
        var sourcesCtx = document.getElementById('sourcesChart').getContext('2d');
        new Chart(sourcesCtx, {
          type: 'doughnut',
          data: {
            labels: ['Organic', 'Direct', 'Referral', 'Social'],
            datasets: [
              {
                data: [42, 28, 18, 12],
                backgroundColor: ['#22d3ee', '#a78bfa', '#fbbf24', '#fb7185'],
                borderColor: '#0f172a',
                borderWidth: 3,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            cutout: '68%',
            plugins: { legend: { display: false } },
          },
        });

        // ── 3. Top-pages horizontal bar ────────────────────────────────
        var pagesCtx = document.getElementById('pagesChart').getContext('2d');
        new Chart(pagesCtx, {
          type: 'bar',
          data: {
            labels: ['/', '/pricing', '/docs', '/blog/launch', '/changelog', '/login'],
            datasets: [
              {
                data: [128400, 92100, 71200, 58900, 41200, 32800],
                backgroundColor: 'rgba(34, 211, 238, 0.75)',
                borderRadius: 4,
                barThickness: 14,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: Object.assign({ beginAtZero: true }, gridStyle()), y: gridStyle() },
          },
        });
      }

      // Chart.js arrives async — wait for it before mounting the dashboard.
      if (window.Chart) {
        init();
      } else {
        var waitFor = setInterval(function () {
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
  <HtmlPreview defaultHeight={920} fileName={'weekly-report.html'} theme={'dark'}>
    {html}
  </HtmlPreview>
);
