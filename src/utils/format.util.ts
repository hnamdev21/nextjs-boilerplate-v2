export const timestampToDateTime = (
  timestamp: string | null,
  locales: Intl.LocalesArgument,
  config?: Intl.DateTimeFormatOptions
) => {
  if (!timestamp) return '';

  return new Date(timestamp).toLocaleDateString(locales, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...config,
  });
};

type FormatPrefixedNumberParams = {
  length?: number;
  prefix?: string;
  suffix?: string;
};

export const formatPrefixedNumber = (
  number: number,
  { length = 2, prefix = '0', suffix = '' }: FormatPrefixedNumberParams
) => {
  return number.toString().padStart(length, prefix) + suffix;
};
