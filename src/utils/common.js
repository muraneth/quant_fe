export const formatBigNumber = (value) => {
  if (value === undefined) {
    return 'N/A';
  }
  if (value >= 1000000000) {
    return (
      (value / 1000000000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + 'B'
    );
  }
  else if (value >= 1000000) {
    return (
      (value / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + 'M'
    );
  } else if (value >= 1000) {
    return (
      (value / 1000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + 'K'
    );
  }else{
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};

export const numberToPercentage = (value) => {
  return (value * 100).toFixed(2) + '%';
};

export const padArrayAhead = (arr, length) => {
  while (arr.length < length) {
    arr.unshift(null);
  }
  return arr;
};