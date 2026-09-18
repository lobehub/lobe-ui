export const matchesAccept = (file: File, accept?: string): boolean => {
  const patterns = accept
    ?.split(',')
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean);

  if (!patterns || patterns.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return fileName.endsWith(pattern);
    if (pattern.endsWith('/*')) return fileType.startsWith(pattern.slice(0, -1));
    return fileType === pattern;
  });
};

export const filterFilesByAccept = (files: File[], accept?: string): File[] =>
  accept ? files.filter((file) => matchesAccept(file, accept)) : files;
