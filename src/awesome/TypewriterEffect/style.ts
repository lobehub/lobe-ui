import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, isDarkMode }) => ({
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
    background-color: ${token.colorPrimary};
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
    background-color: ${token.colorPrimary};
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
    background-color: ${token.colorPrimary};
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
    background-color: ${token.colorPrimary};
  `,

  text: css`
    color: ${isDarkMode ? token.colorTextLightSolid : token.colorText};
  `,
}));
