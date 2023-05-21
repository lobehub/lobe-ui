import chroma from 'chroma-js';

export const invertColor = (color: string) => {
  // 使用 Chroma.js 获取颜色的亮度
  const brightness = chroma(color).get('lab.l');

  // 判断颜色的亮度，如果亮度低于 50，则认为是暗色，生成亮色文本；反之，则生成暗色文本
  const invertedColor = brightness < 50 ? chroma(color).brighten(2) : chroma(color).darken(2);

  return invertedColor.hex();
};
