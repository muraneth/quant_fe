export const formatBigNumber = (value) => {
  if (value >= 1000000) {
    return (
      (value / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + 'M'
    );
  } else {
    return (
      (value / 1000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + 'K'
    );
  }
};

export const numberToPercentage = (value) => {
  return (value * 100).toFixed(2) + '%';
};
