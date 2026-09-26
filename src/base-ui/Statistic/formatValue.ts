const grouping = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatStatisticValue = (
  value: number | string | undefined,
  precision?: number,
): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (!Number.isFinite(value)) return String(value);

  if (precision !== undefined) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    }).format(value);
  }

  const raw = String(value);
  if (raw.includes('e')) return raw;

  const [integer, decimal] = raw.split('.');
  const grouped = grouping.format(Number(integer));

  return decimal ? `${grouped}.${decimal}` : grouped;
};
