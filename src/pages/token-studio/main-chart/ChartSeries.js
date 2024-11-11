import { numberFormatter } from 'utils/common';

const parsePriceToKlineSeries = (data) => {
  return data.map((item) => {
    return [item.open, item.close, item.low, item.high];
  });
};

export const generateDataSeries = (theme, klineData, chartData) => {
  let defaultXSeries = [];
  let volumeType = 'usd_volume';
  if (klineData?.length > 0) {
    defaultXSeries = [
      {
        name: 'Price',
        type: 'candlestick',
        data: parsePriceToKlineSeries(klineData),
        yAxisIndex: 0,
        itemStyle: {
          color0: '#ef232a',
          color: '#14b143',
          borderColor0: '#ef232a',
          borderColor: '#14b143'
        }
      },
      {
        name: 'Buy Volume',
        type: 'bar',
        stack: 'Volume',
        data: klineData?.map((item) => {
          if (volumeType == 'usd_volume') {
            return item.buy_volume;
          } else {
            return item.buy_turn_over;
          }
        }),
        yAxisIndex: 1,
        xAxisIndex: 1,
        itemStyle: {
          color: '#73C0DE'
        }
      },
      {
        name: 'Sell Volume',
        type: 'bar',
        stack: 'Volume',
        data: klineData?.map((item) => {
          if (volumeType == 'usd_volume') {
            return -item.sell_volume;
          } else {
            return -item.sell_turn_over;
          }
        }),
        yAxisIndex: 1,
        xAxisIndex: 1,
        itemStyle: {
          color: '#FF6F61'
        }
      }
    ];
  }
  if (chartData?.length > 0) {
    if (chartData.priceIndicatorDataList) {
      let indicators = [];
      chartData.priceIndicatorDataList.forEach((indicator) => {
        indicators.push({
          name: indicator.name,
          type: 'line',
          yAxisIndex: 0,
          data: indicator.data.map((item) => item.value),
          smooth: true
        });
      });
      defaultXSeries = defaultXSeries.concat(indicators);
    }
    if (chartData.pbvIndicatorData) {
      let pbvIndicatorData = chartData.pbvIndicatorData;
      switch (pbvIndicatorData.type) {
        case 'tx':
          defaultXSeries.push({
            name: 'Volume',
            type: 'bar',
            data: pbvIndicatorData.map((item) => item.value),
            yAxisIndex: 2,
            xAxisIndex: 2,
            itemStyle: {
              color: '#73c0de'
            }
          });
          break;
        case 'trade':
          defaultXSeries.push(
            {
              name: 'Positive PBV',
              type: 'bar',
              stack: 'pbvVolume',
              data: pbvIndicatorData.map((item) => item.positive_value),
              yAxisIndex: 2,
              xAxisIndex: 2,
              itemStyle: {
                color: 'rgba(144, 238, 144, 0.5)' // Light blue with 50% transparency
              }
            },
            {
              name: 'Negative PBV',
              type: 'bar',
              stack: 'pbvVolume',
              data: pbvIndicatorData.map((item) => item.negative_value),
              yAxisIndex: 2,
              xAxisIndex: 2,
              itemStyle: {
                color: ' rgba(255, 111, 97, 0.5)' // Light red with 50% transparency
              }
            }
          );
          break;
      }
    }
  }
  return defaultXSeries;
};

export const generateXAxis = (theme, klineData) => {
  let defaultXAxis = [
    {
      offset: 10,
      type: 'category',
      data: klineData.map((item) => item.time),
      nameLocation: 'middle',
      axisLine: {
        show: false,
        lineStyle: {
          color: '#999'
        }
      }
    },
    {
      // for volume
      type: 'category',
      gridIndex: 1,
      data: klineData.map((item) => item.time),
      boundaryGap: false,
      splitLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#777' } },
      min: 'dataMin',
      max: 'dataMax'
    },
    {
      // for pbv
      type: 'value',
      offset: 0,
      nameLocation: 'middle',
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        formatter: '{value}'
      },
      splitLine: {
        show: false
      }
    }
  ];
  return defaultXAxis;
};

export const generateYAxis = (theme, klineData, chartData) => {
  let minPrice = 0;
  if (klineData?.length > 0) {
    minPrice = klineData.reduce((min, p) => (p.low < min ? p.low : min), klineData[0].low);
  }
  let defaultYAxis = [
    {
      type: 'value',
      position: 'right',
      min: numberFormatter(minPrice),
      axisLine: {
        lineStyle: {
          color: '#f39c12'
        }
      },
      axisLabel: {
        inside: false,
        formatter: '${value}'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(150, 150, 150, 0.5)', // Light gray color with transparency
          width: 1 // Optional: you can adjust the width to make the lines thinner
        }
      }
    },
    {
      offset: 0,
      type: 'value',
      gridIndex: 1,
      position: 'right', // This is the new yAxis for volume on the left
      axisLine: {
        lineStyle: {
          color: '#2ecc71'
        }
      },
      axisLabel: {
        show: true,
        formatter: '{value}'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(150, 150, 150, 0.2)', // Light gray with transparency
          width: 1
        }
      }
    },
    {
        type: 'value',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#3498db'
          }
        },
        axisLabel: {
          inside: false,
          formatter: '{value}'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(150, 150, 150, 0.5)', // Light gray color with transparency
            width: 1 // Optional: you can adjust the width to make the lines thinner
          }
        }
      }
  ];
  if (chartData?.length > 0) {
    let pbvIndicatorData = chartData.pbvIndicatorData;

    if (pbvIndicatorData) {
      const maxPrice = pbvIndicatorData.reduce((max, p) => (p.high > max ? p.high : max), chartData[0].high);
      defaultYAxis[0].max = numberFormatter(maxPrice);
      defaultYAxis.push({
        type: 'category',
        data: pbvIndicatorData?.map((item) => item.price_range_lower),
        name: 'Price Levels',
        nameLocation: 'middle',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          show: false
        }
      });
    }
    // if (chartData.balanceIndicatorData || chartData.holderIndicatorData || chartData.pnlIndicatorData) {
    //   defaultYAxis.push(); // Add a new yAxis for the new indicator
    // }
  }

  return defaultYAxis;
};
