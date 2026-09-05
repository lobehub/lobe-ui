(function () {
  window.__FL = { events: [], frames: 0, t0: performance.now() };
  let prev = new Map();
  const clean = (h) => h.replaceAll(/ data-insp-path="[^"]*"/g, '').slice(0, 160);
  function scan() {
    const root = document.querySelector('.streamdown-animated');
    if (root) {
      const cur = new Map();
      let bid = -1;
      for (const block of root.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, td, th')) {
        if (block.querySelector('p, li')) continue;
        bid += 1;
        let off = 0;
        const walk = (node) => {
          if (node.nodeType === 3) {
            const el = node.parentElement;
            const op = parseFloat(getComputedStyle(el).opacity);
            const text = node.nodeValue;
            for (let c = 0; c < text.length; c++) {
              const key = bid + ':' + (off + c);
              cur.set(key, { op, ch: text[c], html: clean(el.outerHTML) });
              const p = prev.get(key);
              if (p && p.ch === text[c] && p.op - op >= 0.3) {
                window.__FL.events.push({
                  key,
                  ch: text[c],
                  t: Math.round(performance.now() - window.__FL.t0),
                  to: +op.toFixed(2),
                  prev: p.html,
                  cur: clean(el.outerHTML),
                  block: block.textContent.slice(0, 40),
                });
              }
            }
            off += text.length;
          } else if (node.nodeType === 1) {
            for (const child of node.childNodes) walk(child);
          }
        };
        walk(block);
      }
      prev = cur;
      window.__FL.frames++;
    }
    requestAnimationFrame(scan);
  }
  requestAnimationFrame(scan);
  return 'probe2';
})();
