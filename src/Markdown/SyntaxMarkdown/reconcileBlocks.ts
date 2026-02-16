import { type ParsedBlock, type RenderBlock } from './blockRenderKind';

const EVOLUTION_MATCH_THRESHOLD = 0.55;

const sharedPrefixLength = (previous: string, current: string): number => {
  const minLength = Math.min(previous.length, current.length);
  let index = 0;

  while (index < minLength && previous[index] === current[index]) {
    index += 1;
  }

  return index;
};

const getEvolutionScore = (previous: RenderBlock, current: ParsedBlock): number => {
  if (previous.raw === current.raw) return 1;
  if (!previous.raw || !current.raw) return 0;

  const previousRaw = previous.raw;
  const currentRaw = current.raw;

  let score = 0;
  if (previousRaw.startsWith(currentRaw) || currentRaw.startsWith(previousRaw)) {
    score = 1;
  } else {
    const sharedPrefix = sharedPrefixLength(previousRaw, currentRaw);
    if (sharedPrefix === 0) return 0;

    const minLength = Math.min(previousRaw.length, currentRaw.length);
    const maxLength = Math.max(previousRaw.length, currentRaw.length);
    const prefixByMax = sharedPrefix / maxLength;
    const prefixByMin = sharedPrefix / minLength;

    score = prefixByMax;
    if (sharedPrefix >= 8 && prefixByMin >= 0.8) {
      score += 0.15;
    }
  }

  score += previous.renderKind === current.renderKind ? 0.05 : -0.05;
  return Math.max(0, Math.min(score, 1));
};

const findBestEvolutionMatch = (
  previousBlocks: RenderBlock[],
  currentBlock: ParsedBlock,
  unmatchedPreviousIndices: number[],
  previousCursor: number,
): number => {
  let matchedPreviousListIndex = -1;
  let bestScore = 0;

  for (
    let listIndex = previousCursor;
    listIndex < unmatchedPreviousIndices.length;
    listIndex += 1
  ) {
    const previousIndex = unmatchedPreviousIndices[listIndex];
    const score = getEvolutionScore(previousBlocks[previousIndex], currentBlock);

    if (score <= bestScore) continue;
    bestScore = score;
    matchedPreviousListIndex = listIndex;

    if (score === 1) break;
  }

  if (bestScore < EVOLUTION_MATCH_THRESHOLD) {
    return -1;
  }

  return matchedPreviousListIndex;
};

export const computeExactLcsPairs = (
  previousBlocks: RenderBlock[],
  currentBlocks: ParsedBlock[],
): Array<[number, number]> => {
  const previousLength = previousBlocks.length;
  const currentLength = currentBlocks.length;
  const dp: number[][] = Array.from({ length: previousLength + 1 }, () =>
    Array.from({ length: currentLength + 1 }, () => 0),
  );

  for (let previousIndex = previousLength - 1; previousIndex >= 0; previousIndex -= 1) {
    for (let currentIndex = currentLength - 1; currentIndex >= 0; currentIndex -= 1) {
      if (previousBlocks[previousIndex].raw === currentBlocks[currentIndex].raw) {
        dp[previousIndex][currentIndex] = dp[previousIndex + 1][currentIndex + 1] + 1;
      } else {
        dp[previousIndex][currentIndex] = Math.max(
          dp[previousIndex + 1][currentIndex],
          dp[previousIndex][currentIndex + 1],
        );
      }
    }
  }

  const pairs: Array<[number, number]> = [];
  let previousIndex = 0;
  let currentIndex = 0;

  while (previousIndex < previousLength && currentIndex < currentLength) {
    if (previousBlocks[previousIndex].raw === currentBlocks[currentIndex].raw) {
      pairs.push([previousIndex, currentIndex]);
      previousIndex += 1;
      currentIndex += 1;
      continue;
    }

    if (dp[previousIndex + 1][currentIndex] >= dp[previousIndex][currentIndex + 1]) {
      previousIndex += 1;
    } else {
      currentIndex += 1;
    }
  }

  return pairs;
};

export const reconcileBlocks = (
  previousBlocks: RenderBlock[],
  currentBlocks: ParsedBlock[],
  createId: () => string,
): RenderBlock[] => {
  const matchedPairs = computeExactLcsPairs(previousBlocks, currentBlocks);
  const reconciled: Array<RenderBlock | undefined> = Array.from({ length: currentBlocks.length });
  const matchedPrevious = new Set<number>();
  const matchedCurrent = new Set<number>();

  for (const [previousIndex, currentIndex] of matchedPairs) {
    const previousBlock = previousBlocks[previousIndex];
    const currentBlock = currentBlocks[currentIndex];

    reconciled[currentIndex] = {
      ...currentBlock,
      disableAnimation:
        previousBlock.disableAnimation || previousBlock.renderKind !== currentBlock.renderKind,
      id: previousBlock.id,
    };
    matchedPrevious.add(previousIndex);
    matchedCurrent.add(currentIndex);
  }

  const unmatchedPreviousIndices: number[] = [];
  for (let index = 0; index < previousBlocks.length; index += 1) {
    if (!matchedPrevious.has(index)) {
      unmatchedPreviousIndices.push(index);
    }
  }

  let previousCursor = 0;

  for (let currentIndex = 0; currentIndex < currentBlocks.length; currentIndex += 1) {
    if (matchedCurrent.has(currentIndex)) continue;

    const currentBlock = currentBlocks[currentIndex];
    const matchedPreviousListIndex = findBestEvolutionMatch(
      previousBlocks,
      currentBlock,
      unmatchedPreviousIndices,
      previousCursor,
    );

    if (matchedPreviousListIndex === -1) {
      reconciled[currentIndex] = {
        ...currentBlocks[currentIndex],
        disableAnimation: false,
        id: createId(),
      };
      continue;
    }

    const previousIndex = unmatchedPreviousIndices[matchedPreviousListIndex];
    const previousBlock = previousBlocks[previousIndex];

    reconciled[currentIndex] = {
      ...currentBlock,
      disableAnimation:
        previousBlock.disableAnimation || previousBlock.renderKind !== currentBlock.renderKind,
      id: previousBlock.id,
    };

    previousCursor = matchedPreviousListIndex + 1;
  }

  return reconciled.map((block, index) => {
    if (block) return block;

    return {
      ...currentBlocks[index],
      disableAnimation: false,
      id: createId(),
    };
  });
};
