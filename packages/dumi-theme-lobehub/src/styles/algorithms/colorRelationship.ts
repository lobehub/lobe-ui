import chroma from 'chroma-js';

const baseColors = [
  { name: 'red', hue: 0 },
  { name: 'orange', hue: 30 },
  { name: 'yellow', hue: 60 },
  { name: 'yellow-green', hue: 90 },
  { name: 'green', hue: 120 },
  { name: 'cyan-green', hue: 150 },
  { name: 'cyan', hue: 180 },
  { name: 'cyan-blue', hue: 210 },
  { name: 'blue', hue: 240 },
  { name: 'blue-violet', hue: 270 },
  { name: 'violet', hue: 300 },
  { name: 'red-violet', hue: 330 },
];

const findClosestColorBase = (hue: number) => {
  let minDifference = 360;
  let closestColorBase = { name: '', hue: 0 };

  baseColors.forEach((colorBase) => {
    const hueDifference = Math.abs(hue - colorBase.hue);
    const adjustedDifference = Math.min(hueDifference, 360 - hueDifference);

    if (adjustedDifference < minDifference) {
      minDifference = adjustedDifference;
      closestColorBase = colorBase;
    }
  });

  return closestColorBase.hue;
};

export const generateAssociatedColors = (baseColor: string, adjustWarning: boolean = true) => {
  const color = chroma(baseColor);
  const [baseLightness, baseChroma, baseHue] = color.oklch();
  const closestColorHue = findClosestColorBase(baseHue);

  // 计算色相偏移量
  // const hueOffset = 0;
  const hueOffset = baseHue - closestColorHue;

  // 应用色相偏移量

  const successBaseHue = 150; // 绿色基准色相值
  const errorBaseHue = 30; // 红色基准色相值
  const warningBaseHue = 90; // 黄色基准色相值
  const infoBaseHue = 255; // 蓝色基准色相值

  const successHue = (successBaseHue + hueOffset) % 360;
  const errorHue = (errorBaseHue + hueOffset) % 360;
  const warningHue = (warningBaseHue + hueOffset) % 360;
  const infoHue = (infoBaseHue + hueOffset) % 360;

  const warningLightness = adjustWarning ? 0.8 + baseLightness * 0.2 : baseLightness;
  return {
    success: chroma.oklch(baseLightness, baseChroma, successHue).hex(),
    error: chroma.oklch(baseLightness, baseChroma, errorHue).hex(),
    warning: chroma.oklch(warningLightness, baseChroma, warningHue).hex(),
    info: chroma.oklch(baseLightness, baseChroma, infoHue).hex(),
  };
};
