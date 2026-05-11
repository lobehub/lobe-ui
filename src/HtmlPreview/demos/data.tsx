export const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Demo</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: ui-sans-serif, system-ui, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      min-height: 240px;
    }
    .card {
      max-width: 360px;
      margin: 0 auto;
      padding: 16px 20px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(8px);
    }
    button {
      margin-top: 12px;
      padding: 8px 14px;
      border-radius: 8px;
      border: none;
      background: #fff;
      color: #333;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Inline HTML preview</h2>
    <p id="counter">Clicks: 0</p>
    <button id="btn">Click me</button>
  </div>
  <script>
    const counter = document.getElementById('counter');
    const btn = document.getElementById('btn');
    let n = Number(localStorage.getItem('clicks') || 0);
    const render = () => (counter.textContent = 'Clicks: ' + n);
    render();
    btn.addEventListener('click', () => {
      n += 1;
      localStorage.setItem('clicks', String(n));
      render();
    });
  </script>
</body>
</html>
`;

export const fragment = `<div style="padding:16px;font-family:sans-serif">
  <h2>Just a fragment</h2>
  <p>No &lt;html&gt; wrapper — renders as source only.</p>
</div>
`;
