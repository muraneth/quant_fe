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


export const numberFormatter = (data) => {
  if (data === undefined) {
    return 'N/A';
  }
  if (Math.abs(data) > 1000000000) {
    return (data / 1000000000).toFixed(2) + 'B';
  } else if (Math.abs(data) > 1000000) {
    return (data / 1000000).toFixed(2) + 'M';
  } else if (Math.abs(data) > 1000) {
    return (data / 1000).toFixed(2) + 'K';
  } else if (Math.abs(data) > 1) {
    return data.toFixed(2);
  } else if (Math.abs(data) > 0.01) {
    return data.toFixed(3);
  } else if (Math.abs(data) > 0.0001) {
    return data.toFixed(5);
  } else if (Math.abs(data) > 0.00001) {
    return data.toFixed(6);
  }else if (Math.abs(data) > 0.000001) {
    return data.toFixed(7);
  }else if (Math.abs(data) > 0.0000001) {
    return data.toFixed(8);
  }
  return data.toFixed(10);
};