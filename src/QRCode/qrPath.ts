export const buildQrPath = (matrix: boolean[][], hole: number): string => {
  const count = matrix.length;
  const from = Math.floor((count - hole) / 2);
  const to = from + hole;
  let path = '';
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (hole > 0 && x >= from && x < to && y >= from && y < to) continue;
      if (matrix[y][x]) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  return path;
};
