import { css, cx, keyframes } from 'antd-style';

const draw = keyframes`
  0% {
    stroke-dashoffset: 1000;
  }

  100% {
    stroke-dashoffset: 0;
  }
`;

const fill = keyframes`
  30% {
    fill-opacity: 5%;
  }

  100% {
    fill-opacity: 100%;
  }
`;

export const brandLoadingStyle = cx(css`
  path {
    fill: currentcolor;
    fill-opacity: 0%;
    stroke: currentcolor;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    stroke-width: 0.25em;

    animation:
      ${draw} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite,
      ${fill} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
`);
