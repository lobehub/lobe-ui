import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  container: css`
    display: inline-block;
    white-space: pre-wrap;
  `,

  cursor: css`
    transform: translateY(10%);

    display: inline-block;
    align-items: center;

    width: 3px;
    height: 1em;
    margin-inline-start: 0.25rem;
    border-radius: 2px;

    opacity: 1;
    background-color: ${cssVar.colorPrimary};
  `,

  cursorBlock: css`
    transform: translateY(10%);

    display: inline-block;
    align-items: center;

    width: 0.5em;
    height: 1em;
    margin-inline-start: 0.25rem;
    border-radius: 2px;

    opacity: 1;
    background-color: ${cssVar.colorPrimary};
  `,

  cursorCustom: css`
    display: inline-block;
    align-items: center;
    margin-inline-start: 0.25rem;
    opacity: 1;
  `,

  cursorDot: css`
    display: inline-block;
    align-items: center;

    width: 0.75em;
    height: 0.75em;
    margin-inline-start: 0.25rem;
    border-radius: 50%;

    opacity: 1;
    background-color: ${cssVar.colorPrimary};
  `,

  cursorHidden: css`
    display: none;
  `,

  cursorUnderscore: css`
    transform: translateY(0.3em);

    display: inline-block;
    align-items: center;

    width: 0.6em;
    height: 0.15em;
    margin-inline-start: 0.25rem;
    border-radius: 2px;

    opacity: 1;
    background-color: ${cssVar.colorPrimary};
  `,

  text: css`
    color: ${cssVar.colorText};
  `,
}));
