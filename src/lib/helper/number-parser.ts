type ParseAndTrimNumber = (value: string) => number;

export const parseAndTrimNumber: ParseAndTrimNumber = (value) => {
  return parseFloat(value.replaceAll(" ", "").replaceAll(",", "."));
};
