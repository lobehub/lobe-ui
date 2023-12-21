import { mulTable, shgTable } from './stackBlurTable';

class BlurStack {
  r: number = 0;
  g: number = 0;
  b: number = 0;
  a: number = 0;
  next?: BlurStack;
}

const stackBlurGetElement = (
  elementOrID: string | HTMLCanvasElement,
): HTMLCanvasElement | undefined => {
  if (typeof elementOrID === 'string') {
    // eslint-disable-next-line unicorn/prefer-query-selector
    return document.getElementById(elementOrID) as HTMLCanvasElement;
  } else if (elementOrID.nodeType === 1) {
    return elementOrID as HTMLCanvasElement;
  }
};

export const stackBlurCanvasRGB = (
  canvasIDOrElement: string | HTMLCanvasElement,
  topX: number,
  topY: number,
  width: number,
  height: number,
  radius: number,
): void => {
  if (Number.isNaN(radius) || radius < 1) return;
  // eslint-disable-next-line no-param-reassign
  radius = Math.trunc(radius);

  const canvas = stackBlurGetElement(canvasIDOrElement) as HTMLCanvasElement;
  if (!canvas && !(canvas as any)?.getContext) return;
  const context = canvas.getContext('2d');
  const imageData = context?.getImageData(topX, topY, width, height) as ImageData;
  const pixels = imageData.data;

  let x;
  let y;
  let i;
  let p;
  let yp;
  let yi;
  let yw;
  let rSum;
  let gSum;
  let bSum;
  let rOutSum;
  let gOutSum;
  let bOutSum;
  let rInSum;
  let gInSum;
  let bInSum;
  let pr;
  let pg;
  let pb;
  let rbs;
  let stackEnd;

  const div = radius + radius + 1;
  const widthMinus1 = width - 1;
  const heightMinus1 = height - 1;
  const radiusPlus1 = radius + 1;
  const sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2;

  const stackStart = new BlurStack();
  let stack = stackStart;
  for (i = 1; i < div; i++) {
    stack = stack.next = new BlurStack();
    if (i === radiusPlus1) stackEnd = stack;
  }
  stack.next = stackStart;
  let stackIn: BlurStack;
  let stackOut: BlurStack;

  yw = yi = 0;

  const mulSum = mulTable[radius];
  const shgSum = shgTable[radius];

  for (y = 0; y < height; y++) {
    rInSum = gInSum = bInSum = rSum = gSum = bSum = 0;

    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;

    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next as BlurStack;
    }

    for (i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[p + 1]) * rbs;
      bSum += (stack.b = pb = pixels[p + 2]) * rbs;

      rInSum += pr;
      gInSum += pg;
      bInSum += pb;

      stack = stack.next as BlurStack;
    }

    stackIn = stackStart as BlurStack;
    stackOut = stackEnd as BlurStack;
    for (x = 0; x < width; x++) {
      pixels[yi] = (rSum * mulSum) >> shgSum;
      pixels[yi + 1] = (gSum * mulSum) >> shgSum;
      pixels[yi + 2] = (bSum * mulSum) >> shgSum;

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;

      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;

      p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

      rInSum += stackIn.r = pixels[p];
      gInSum += stackIn.g = pixels[p + 1];
      bInSum += stackIn.b = pixels[p + 2];

      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;

      stackIn = stackIn.next as BlurStack;

      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;

      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;

      stackOut = stackOut.next as BlurStack;

      yi += 4;
    }
    yw += width;
  }

  for (x = 0; x < width; x++) {
    gInSum = bInSum = rInSum = gSum = bSum = rSum = 0;

    yi = x << 2;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;

    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next as BlurStack;
    }

    yp = width;

    for (i = 1; i <= radius; i++) {
      yi = (yp + x) << 2;

      rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
      bSum += (stack.b = pb = pixels[yi + 2]) * rbs;

      rInSum += pr;
      gInSum += pg;
      bInSum += pb;

      stack = stack.next as BlurStack;

      if (i < heightMinus1) {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart as BlurStack;
    stackOut = stackEnd as BlurStack;
    for (y = 0; y < height; y++) {
      p = yi << 2;
      pixels[p] = (rSum * mulSum) >> shgSum;
      pixels[p + 1] = (gSum * mulSum) >> shgSum;
      pixels[p + 2] = (bSum * mulSum) >> shgSum;

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;

      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;

      p = (x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) << 2;

      rSum += rInSum += stackIn.r = pixels[p];
      gSum += gInSum += stackIn.g = pixels[p + 1];
      bSum += bInSum += stackIn.b = pixels[p + 2];

      stackIn = stackIn.next as BlurStack;

      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;

      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;

      stackOut = stackOut.next as BlurStack;

      yi += width;
    }
  }

  context?.putImageData(imageData, topX, topY);
};
