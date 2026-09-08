// Each batch stays below every smoothing preset's large-append bypass.
const paragraph = 'Paragraph 01 arrives as a complete block.\n\n';
const content = Array.from({ length: 20 }, (_, i) =>
  paragraph.replace('01', String(i + 1).padStart(2, '0')),
).join('');

export const paragraphBatchCases = {
  paragraph: {
    chunkSize: paragraph.length,
    content,
    delayMs: 500,
    label: 'Complete paragraphs',
  },
  paragraphBurst: {
    chunkSize: paragraph.length * 2,
    content,
    delayMs: 500,
    label: 'Two paragraphs per batch',
  },
  highTps: {
    chunkSize: 20,
    content,
    delayMs: 10,
    label: 'High TPS paragraphs (2000 chars/s)',
  },
};
