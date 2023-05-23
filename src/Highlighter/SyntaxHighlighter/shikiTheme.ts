import { createGlobalStyle } from 'antd-style';

export const GlobalStyle = createGlobalStyle`
		:root {
    --shiki-color-text: #EEEEEE;
    --shiki-color-background: #333333;
    --shiki-token-constant: #660000;
    --shiki-token-string: #770000;
    --shiki-token-comment: #880000;
    --shiki-token-keyword: #990000;
    --shiki-token-parameter: #AA0000;
    --shiki-token-function: #BB0000;
    --shiki-token-string-expression: #CC0000;
    --shiki-token-punctuation: #DD0000;
    --shiki-token-link: #EE0000;

    /* Only required if using ansiToHtml function */
    --shiki-color-ansi-black: #000000;
    --shiki-color-ansi-black-dim: #00000080;
    --shiki-color-ansi-red: #bb0000;
    --shiki-color-ansi-red-dim: #bb000080;
    --shiki-color-ansi-green: #00bb00;
    --shiki-color-ansi-green-dim: #00bb0080;
    --shiki-color-ansi-yellow: #bbbb00;
    --shiki-color-ansi-yellow-dim: #bbbb0080;
    --shiki-color-ansi-blue: #0000bb;
    --shiki-color-ansi-blue-dim: #0000bb80;
    --shiki-color-ansi-magenta: #ff00ff;
    --shiki-color-ansi-magenta-dim: #ff00ff80;
    --shiki-color-ansi-cyan: #00bbbb;
    --shiki-color-ansi-cyan-dim: #00bbbb80;
    --shiki-color-ansi-white: #eeeeee;
    --shiki-color-ansi-white-dim: #eeeeee80;
    --shiki-color-ansi-bright-black: #555555;
    --shiki-color-ansi-bright-black-dim: #55555580;
    --shiki-color-ansi-bright-red: #ff5555;
    --shiki-color-ansi-bright-red-dim: #ff555580;
    --shiki-color-ansi-bright-green: #00ff00;
    --shiki-color-ansi-bright-green-dim: #00ff0080;
    --shiki-color-ansi-bright-yellow: #ffff55;
    --shiki-color-ansi-bright-yellow-dim: #ffff5580;
    --shiki-color-ansi-bright-blue: #5555ff;
    --shiki-color-ansi-bright-blue-dim: #5555ff80;
    --shiki-color-ansi-bright-magenta: #ff55ff;
    --shiki-color-ansi-bright-magenta-dim: #ff55ff80;
    --shiki-color-ansi-bright-cyan: #55ffff;
    --shiki-color-ansi-bright-cyan-dim: #55ffff80;
    --shiki-color-ansi-bright-white: #ffffff;
    --shiki-color-ansi-bright-white-dim: #ffffff80;
  }`;
