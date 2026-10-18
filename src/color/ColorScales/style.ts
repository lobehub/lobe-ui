import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  alphaDark: {
    backgroundPosition: '0% 0%',
    backgroundColor: '#000',
    backgroundImage:
      'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACPTkDJAAAAZUlEQVRIDe2VMQoAMAgDa9/g/1/oIzrpZBCh2dLFkkoDF0Fz99OdiOjks+2/7S8fRRmMMIVoRGSoYzvvqF8ZIMKlC1GhQBc6IkPzq32QmdAzkEGihpWOSPsAss8HegYySNSw0hE9WQ4StafZFqkAAAAASUVORK5CYII=)',
    backgroundSize: '26px',
  },
  alphaLight: {
    backgroundPosition: '0% 0%',
    backgroundColor: '#fff',
    backgroundImage:
      'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAFpJREFUWAntljEKADAIA23p6v//qQ+wfUEcCu1yriEgp0FHRJSJcnehmmWm1Dv/lO4HIg1AAAKjTqm03ea88zMCCEDgO4HV5bS757f+7wRoAAIQ4B9gByAAgQ3pfiDmXmAeEwAAAABJRU5ErkJggg==)',
    backgroundSize: '26px',
  },
  scaleBox: {
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
    transition: `scale 400ms ${cssVar.motionEaseOut}`,
    backgroundSize: '16px 16px',
    cursor: 'pointer',
    position: 'relative',
    scale: { 'default': null, ':active': 0.8 },
    height: 32,
    width: 48,
  },
  content: {
    paddingBottom: '32px',
    paddingLeft: '0',
    paddingRight: '16px',
    paddingTop: '8px',
  },
  index: {
    fontWeight: 400,
    opacity: 0.5,
  },
  indexHighlight: {
    fontWeight: 700,
  },
  scaleItem: {
    height: '100%',
    width: '100%',
  },
  scaleRowTitle: {
    height: 32,
    width: 64,
  },
  text: {
    opacity: 0.5,
  },
});
