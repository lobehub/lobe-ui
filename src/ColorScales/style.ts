import { createStyles } from 'antd-style';

export const alphaBg = {
  light:
    'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAFpJREFUWAntljEKADAIA23p6v//qQ+wfUEcCu1yriEgp0FHRJSJcnehmmWm1Dv/lO4HIg1AAAKjTqm03ea88zMCCEDgO4HV5bS757f+7wRoAAIQ4B9gByAAgQ3pfiDmXmAeEwAAAABJRU5ErkJggg==) 0% 0% / 26px',
  dark: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACPTkDJAAAAZUlEQVRIDe2VMQoAMAgDa9/g/1/oIzrpZBCh2dLFkkoDF0Fz99OdiOjks+2/7S8fRRmMMIVoRGSoYzvvqF8ZIMKlC1GhQBc6IkPzq32QmdAzkEGihpWOSPsAss8HegYySNSw0hE9WQ4StafZFqkAAAAASUVORK5CYII=) 0% 0% / 26px',
};

export const useStyles = createStyles(({ css }) => ({
  view: css`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  scaleBox: css`
    cursor: pointer;

    position: relative;

    width: 48px;
    height: 32px;

    background-position: 0 0, 0 8px, 8px -8px, -8px 0;
    background-size: 16px 16px;

    &:active {
      transform: scale(0.95);
    }
  `,
  scaleItem: css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
  `,
  scaleRowTitle: css`
    display: flex;
    align-items: center;
    width: 64px;
    height: 32px;
  `,
  text: css`
    opacity: 0.5;
  `,
}));
