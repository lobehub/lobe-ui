export const removeLineBreaksInAntArtifact = (input?: string) => {
  if (typeof input !== 'string') return '';

  return input.replaceAll(/<antArtifact\b[^>]*>[\S\s]*?(?:<\/antArtifact>|$)/g, (match) => {
    // 将匹配到的 antArtifact 标签内的所有换行符替换为空字符串
    return match.replaceAll(/\r?\n|\r/g, '');
  });
};
