export const splitKeysByPlus = (keys: string): string[] => {
  const placeholder = 'PLACEHOLDER';
  const parts = keys.replaceAll('++', `+${placeholder}`).split('+');
  return parts.filter(Boolean).map((part) => {
    if (part === placeholder) return '+';
    return part;
  });
};

export const startCase = (str: string): string => {
  return str
    .replaceAll(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};
