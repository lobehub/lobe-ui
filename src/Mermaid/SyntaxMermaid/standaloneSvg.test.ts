import { render } from 'pele';

import { toStandaloneSvgString } from './standaloneSvg';

const mountDiagram = () => {
  const host = document.createElement('div');
  host.innerHTML = render('flowchart LR\n  A --> B').svg;
  document.body.append(host);
  return { host, svg: host.querySelector('svg')! };
};

describe('toStandaloneSvgString', () => {
  it('bakes the theme variables into the serialized copy', () => {
    const { host, svg } = mountDiagram();
    host.style.setProperty('--pele-bg', '#0d0d0d');
    host.style.setProperty('--pele-fg', '#ffffff');

    const standalone = toStandaloneSvgString(svg);
    host.remove();

    expect(standalone).toContain('--pele-bg: #0d0d0d');
    expect(standalone).toContain('--pele-fg: #ffffff');
  });

  it('paints the background so the copy is not transparent', () => {
    const { host, svg } = mountDiagram();
    host.style.setProperty('--pele-bg', 'rgb(13, 13, 13)');

    const standalone = toStandaloneSvgString(svg);
    host.remove();

    expect(standalone).toContain('background: rgb(13, 13, 13)');
  });
});
