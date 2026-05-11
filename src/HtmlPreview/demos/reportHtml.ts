// Shared "Weekly product report" — used by both the HtmlPreview Report
// demo and the Markdown HTML-preview Report demo. Self-contained: inline
// <style>, inline SVG for the three charts, no CDN dependency. This is
// the canonical "complete LLM-output document" example.
export const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Weekly product report — Apr 15 to Apr 21</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", ui-sans-serif, system-ui, sans-serif;
      font-feature-settings: "cv11", "ss01";
      background: #020617;
      color: #f1f5f9;
      padding: 28px 32px;
      line-height: 1.5;
    }
    .container { max-width: 1080px; margin: 0 auto; }
    .stack > * + * { margin-top: 20px; }
    .row { display: flex; align-items: center; gap: 12px; }
    .row-between { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .muted { color: #94a3b8; }
    .strong { color: #f1f5f9; }
    .num { font-variant-numeric: tabular-nums; }
    .code {
      font-family: "SF Mono", "JetBrains Mono", ui-monospace, monospace;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      background: #0f172a;
      color: #cbd5e1;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 9px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      background: rgba(16, 185, 129, 0.16);
      color: #6ee7b7;
    }
    .badge::before {
      content: "";
      width: 6px; height: 6px;
      border-radius: 999px;
      background: #34d399;
      box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.2);
    }
    h1 { font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
    h2 { font-size: 11px; font-weight: 600; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
    h3 { font-size: 13px; font-weight: 500; margin: 0; color: #e2e8f0; }
    p { margin: 0; font-size: 14px; }
    code { font-family: "SF Mono", ui-monospace, monospace; }

    .card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 18px 20px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .kpi .label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 6px; }
    .kpi .value { font-size: 26px; font-weight: 600; line-height: 1; }
    .kpi .delta { margin-top: 8px; font-size: 12px; font-variant-numeric: tabular-nums; }
    .up { color: #34d399; }
    .down { color: #fb7185; }

    .findings ul { margin: 0; padding-left: 20px; }
    .findings li { font-size: 14px; color: #cbd5e1; margin: 6px 0; }
    .findings li::marker { color: #22d3ee; }

    .charts {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 12px;
    }
    .charts-bottom {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .legend { display: flex; gap: 12px; font-size: 11px; color: #94a3b8; }
    .legend > span { display: inline-flex; align-items: center; gap: 6px; }
    .dot { width: 8px; height: 8px; border-radius: 999px; display: inline-block; }
    .dot-cyan { background: #22d3ee; }
    .dot-slate { background: #475569; }
    .dot-violet { background: #a78bfa; }
    .dot-amber { background: #fbbf24; }
    .dot-rose { background: #fb7185; }

    .donut-legend { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; font-size: 11px; color: #cbd5e1; }
    .donut-legend > span { display: inline-flex; align-items: center; gap: 6px; }
    .donut-legend .num { color: #94a3b8; }

    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { font-size: 10.5px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; text-align: left; padding: 0 0 10px; border-bottom: 1px solid #1e293b; }
    th.right { text-align: right; }
    td { padding: 10px 0; border-bottom: 1px solid rgba(30, 41, 59, 0.5); }
    td.right { text-align: right; font-variant-numeric: tabular-nums; font-size: 12px; }
    tbody tr:last-child td { border-bottom: 0; }
    .ev { display: inline-flex; align-items: center; gap: 8px; }
    .ev::before {
      content: "";
      width: 7px; height: 7px;
      border-radius: 999px;
    }
    .ev.green::before { background: #34d399; }
    .ev.amber::before { background: #fbbf24; }
    .ev.cyan::before { background: #22d3ee; }
    .ev.rose::before { background: #fb7185; }

    .foot { font-size: 11px; color: #475569; padding-top: 8px; }
  </style>
</head>
<body>
  <div class="container stack">

    <!-- Header -->
    <header class="row-between">
      <div>
        <h1>Weekly product report</h1>
        <p class="muted" style="font-size: 13px; margin-top: 4px;">
          Activity for <span class="strong">Apr 15 – Apr 21</span>, vs. the prior week. Aggregated from
          <span class="code">events.warehouse.product_events</span>.
        </p>
      </div>
      <div class="row" style="gap: 8px;">
        <span class="badge">live</span>
        <span class="muted num" style="font-size: 12px;">Apr 22, 2026</span>
      </div>
    </header>

    <!-- KPI grid -->
    <section class="kpi-grid">
      <div class="card kpi">
        <div class="label">Active users</div>
        <div class="value num">48,213</div>
        <div class="delta up">▲ 12.4% w/w</div>
      </div>
      <div class="card kpi">
        <div class="label">Revenue</div>
        <div class="value num">$284.5k</div>
        <div class="delta up">▲ 5.1% w/w</div>
      </div>
      <div class="card kpi">
        <div class="label">Conversion</div>
        <div class="value num">3.42%</div>
        <div class="delta down">▼ 0.3pp w/w</div>
      </div>
      <div class="card kpi">
        <div class="label">Retention · D7</div>
        <div class="value num">38.6%</div>
        <div class="delta up">▲ 2.1pp w/w</div>
      </div>
    </section>

    <!-- Findings -->
    <section class="card findings">
      <h2>Key findings</h2>
      <ul>
        <li>Active users are up <span class="up num">+12.4%</span>, driven by Tuesday's product-hunt feature.</li>
        <li>Conversion dipped <span class="down num">0.3pp</span>; the pricing-page experiment is the most likely culprit.</li>
        <li>Mobile share crossed <span class="strong">62%</span> for the first time — the new responsive layout is paying off.</li>
        <li>Retention at D7 improved <span class="up num">+2.1pp</span>, consistent with the onboarding rewrite shipping Apr 9.</li>
      </ul>
    </section>

    <!-- Charts row 1 -->
    <section class="charts">
      <div class="card">
        <div class="row-between" style="margin-bottom: 14px;">
          <h3>Daily active users</h3>
          <div class="legend">
            <span><i class="dot dot-cyan"></i>This week</span>
            <span><i class="dot dot-slate"></i>Last week</span>
          </div>
        </div>
        <svg viewBox="0 0 480 200" style="width: 100%; height: auto; display: block;" xmlns="http://www.w3.org/2000/svg">
          <!-- grid -->
          <g stroke="rgba(255,255,255,0.04)" stroke-width="1">
            <line x1="0" y1="40"  x2="480" y2="40" />
            <line x1="0" y1="90"  x2="480" y2="90" />
            <line x1="0" y1="140" x2="480" y2="140" />
            <line x1="0" y1="190" x2="480" y2="190" />
          </g>
          <!-- last week (dashed gray) -->
          <path d="M 20 145 Q 70 142 100 138 T 180 130 T 260 122 T 340 116 T 420 108 L 460 105"
                fill="none" stroke="rgba(148,163,184,0.55)" stroke-width="1.5" stroke-dasharray="4 4" />
          <!-- this week (cyan, with area) -->
          <path d="M 20 138 C 50 130 70 110 100 90 S 160 30 200 35 C 230 38 260 70 290 85 C 320 100 350 110 380 100 C 410 92 430 80 460 70 L 460 190 L 20 190 Z"
                fill="rgba(34,211,238,0.10)" />
          <path d="M 20 138 C 50 130 70 110 100 90 S 160 30 200 35 C 230 38 260 70 290 85 C 320 100 350 110 380 100 C 410 92 430 80 460 70"
                fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <!-- data points -->
          <g fill="#22d3ee">
            <circle cx="20" cy="138" r="3" />
            <circle cx="100" cy="90" r="3" />
            <circle cx="200" cy="35" r="3" />
            <circle cx="290" cy="85" r="3" />
            <circle cx="380" cy="100" r="3" />
            <circle cx="460" cy="70" r="3" />
          </g>
          <!-- x axis labels -->
          <g fill="rgba(255,255,255,0.4)" font-size="10" font-family="ui-sans-serif, system-ui, sans-serif">
            <text x="20"  y="200" text-anchor="middle">Mon</text>
            <text x="93"  y="200" text-anchor="middle">Tue</text>
            <text x="166" y="200" text-anchor="middle">Wed</text>
            <text x="240" y="200" text-anchor="middle">Thu</text>
            <text x="313" y="200" text-anchor="middle">Fri</text>
            <text x="386" y="200" text-anchor="middle">Sat</text>
            <text x="460" y="200" text-anchor="middle">Sun</text>
          </g>
        </svg>
      </div>

      <div class="card">
        <h3 style="margin-bottom: 14px;">Traffic sources</h3>
        <svg viewBox="0 0 200 200" style="width: 100%; height: auto; display: block;" xmlns="http://www.w3.org/2000/svg">
          <!-- Donut segments — angles from a circle of circumference 502.65 (r=80) -->
          <g fill="none" stroke-width="32" transform="rotate(-90 100 100)">
            <!-- 42% organic — cyan -->
            <circle cx="100" cy="100" r="70" stroke="#22d3ee" stroke-dasharray="184.73 439.82" stroke-dashoffset="0" />
            <!-- 28% direct — violet — offset by 42% of full circumference (440) = 184.73 backwards -->
            <circle cx="100" cy="100" r="70" stroke="#a78bfa" stroke-dasharray="123.15 439.82" stroke-dashoffset="-184.73" />
            <!-- 18% referral — amber -->
            <circle cx="100" cy="100" r="70" stroke="#fbbf24" stroke-dasharray="79.17  439.82" stroke-dashoffset="-307.88" />
            <!-- 12% social — rose -->
            <circle cx="100" cy="100" r="70" stroke="#fb7185" stroke-dasharray="52.78  439.82" stroke-dashoffset="-387.05" />
          </g>
          <text x="100" y="96" text-anchor="middle" fill="#f1f5f9" font-size="20" font-weight="600" font-family="ui-sans-serif, system-ui, sans-serif">102K</text>
          <text x="100" y="116" text-anchor="middle" fill="#64748b" font-size="10" font-family="ui-sans-serif, system-ui, sans-serif">sessions</text>
        </svg>
        <div class="donut-legend">
          <span><i class="dot dot-cyan"></i>Organic <span class="num">42%</span></span>
          <span><i class="dot dot-violet"></i>Direct <span class="num">28%</span></span>
          <span><i class="dot dot-amber"></i>Referral <span class="num">18%</span></span>
          <span><i class="dot dot-rose"></i>Social <span class="num">12%</span></span>
        </div>
      </div>
    </section>

    <!-- Charts row 2 -->
    <section class="charts-bottom">
      <div class="card">
        <div class="row-between" style="margin-bottom: 14px;">
          <h3>Top pages by views</h3>
          <span class="muted" style="font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em;">Top 6</span>
        </div>
        <svg viewBox="0 0 380 200" style="width: 100%; height: auto; display: block;" xmlns="http://www.w3.org/2000/svg">
          <g font-family="ui-sans-serif, system-ui, sans-serif" font-size="11">
            <!-- Each row: label + bar + value -->
            <text x="0" y="20" fill="#cbd5e1">/</text>
            <rect x="64" y="10" width="240" height="14" rx="3" fill="rgba(34,211,238,0.75)" />
            <text x="312" y="20" fill="#94a3b8" class="num">128.4k</text>

            <text x="0" y="48" fill="#cbd5e1">/pricing</text>
            <rect x="64" y="38" width="172" height="14" rx="3" fill="rgba(34,211,238,0.75)" />
            <text x="244" y="48" fill="#94a3b8" class="num">92.1k</text>

            <text x="0" y="76" fill="#cbd5e1">/docs</text>
            <rect x="64" y="66" width="133" height="14" rx="3" fill="rgba(34,211,238,0.75)" />
            <text x="205" y="76" fill="#94a3b8" class="num">71.2k</text>

            <text x="0" y="104" fill="#cbd5e1">/blog/launch</text>
            <rect x="64" y="94" width="110" height="14" rx="3" fill="rgba(34,211,238,0.75)" />
            <text x="182" y="104" fill="#94a3b8" class="num">58.9k</text>

            <text x="0" y="132" fill="#cbd5e1">/changelog</text>
            <rect x="64" y="122" width="77" height="14" rx="3" fill="rgba(34,211,238,0.75)" />
            <text x="149" y="132" fill="#94a3b8" class="num">41.2k</text>

            <text x="0" y="160" fill="#cbd5e1">/login</text>
            <rect x="64" y="150" width="61" height="14" rx="3" fill="rgba(34,211,238,0.75)" />
            <text x="133" y="160" fill="#94a3b8" class="num">32.8k</text>
          </g>
        </svg>
      </div>

      <div class="card">
        <h3 style="margin-bottom: 14px;">Notable events this week</h3>
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>When</th>
              <th class="right">Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="ev green">Product Hunt feature</span></td>
              <td class="muted num" style="font-size: 12px;">Apr 16</td>
              <td class="right up">+18.4k DAU</td>
            </tr>
            <tr>
              <td><span class="ev amber">Pricing A/B test launched</span></td>
              <td class="muted num" style="font-size: 12px;">Apr 17</td>
              <td class="right down">−0.3pp CVR</td>
            </tr>
            <tr>
              <td><span class="ev cyan">Onboarding rewrite</span></td>
              <td class="muted num" style="font-size: 12px;">Apr 19</td>
              <td class="right up">+2.1pp D7</td>
            </tr>
            <tr>
              <td><span class="ev rose">API latency incident</span></td>
              <td class="muted num" style="font-size: 12px;">Apr 20</td>
              <td class="right down">−1.8k sessions</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="foot">Generated by the report agent · run id <code>rpt_2026w16_3f8a</code></p>
  </div>
</body>
</html>
`;
