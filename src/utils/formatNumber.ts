const integerFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatNumber = (value: number): string => integerFormat.format(value);
