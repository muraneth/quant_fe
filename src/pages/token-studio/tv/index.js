import React, { useEffect, useState, useRef, useCallback } from 'react';
import { init, dispose, registerIndicator } from 'klinecharts';

import { getTokenPrice } from 'data-server/common';
import { getChartData, getChartDataSync } from 'data-server';
import TextField from '@mui/material/TextField';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const formatToDateTimeString = (date) => {
  return date ? date.format('YYYY-MM-DD HH:mm:ss') : '';
};

const PriceByVolumeIndicator = ({ symbol }) => {
  const chart = useRef(null);
  const paneId = useRef('');
  const [timeRange, setTimeRange] = useState({
    startTime: dayjs('2024-06-28 00:00:00'),
    endTime: dayjs()
  });
  const handleStartTimeChange = useCallback((newValue) => {
    setTimeRange((prev) => ({ ...prev, startTime: newValue }));
  }, []);

  const handleEndTimeChange = useCallback((newValue) => {
    setTimeRange((prev) => ({ ...prev, endTime: newValue }));
  }, []);

  registerIndicator({
    name: 'Volume',
    shortName: 'Vol',
    calc: (kLineDataList) => {
      let result = [];
      for (let i = 0; i < kLineDataList.length; i++) {
        result.push(kLineDataList[i].buy_volume);
      }
      return result;
    },
    draw: ({ ctx, indicator, visibleRange, yAxis, barSpace, bounding }) => {
      ctx.strokeStyle = 'rgba(76, 175, 80, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      const from = Math.floor(visibleRange.from);
      const to = Math.floor(visibleRange.to);
      console.log('indicator', indicator);
      console.log('barspace', barSpace, 'bounding', bounding);

      for (let i = from; i < to; i++) {
        const data = indicator.result[i];
        const x = i * barSpace.bar + bounding.left;
        const y = -yAxis.convertToPixel(data);
        // console.log('x',x,'y',y);

        ctx.beginPath();
        ctx.moveTo(x, bounding.bottom);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      return false;
    }
  });

  registerIndicator({
    name: 'AvgCost',
    shortName: 'AC',
    figures: [{ key: 'ac', title: 'AvgCost: ', type: 'line' }],
    calc: (kLineDataList) => {
      let result = [];
      getChartData({
        token_symbol: symbol,
        chart_label: 'AvgCostByDayAfter',
        start_time: '2024-07-28 00:00:00'
      }).then((data) => {
        if (!data || data.length == 0) {
          return [];
        }
        console.log('data', data);
        for (let i = 0; i < data.length; i++) {
          result.push({ ac: data[i].value });
        }
      });
      console.log('result', result);

      return result;
    }
  });
  registerIndicator({
    name: 'PriceByVolume',
    shortName: 'PBV',
    calc: (dataList) => {
      return getChartData({
        token_symbol: symbol,
        chart_label: 'trade_usd_pbv',
        start_time: formatToDateTimeString(timeRange.startTime),
        end_time: formatToDateTimeString(timeRange.endTime)
      });
    },
    draw: ({ ctx, kLineDataList, indicator, visibleRange, bounding, barSpace, xAxis, yAxis }) => {
      // Set drawing styles
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 2;
      ctx.setLineDash([]); // Ensure the line is solid

      // Calculate the price range
      // const prices = kLineDataList.slice(from, to).map((data) => data.close); // Assuming 'close' is the price to use

      const volumeByPrice = indicator.result;

      console.log('volumeByPrice', volumeByPrice);
      if (!volumeByPrice || volumeByPrice.length === 0) {
        return false;
      }

      const minPrice = volumeByPrice[0].price_range_lower;
      const maxPrice = volumeByPrice[99].price_range_lower;
      const priceStep = (maxPrice - minPrice) / 100;

      let maxVolume = 0;
      for (let i = 0; i < 100; i++) {
        maxVolume = Math.max(maxVolume, volumeByPrice[i].positive_value);
      }
      for (let i = 0; i < 100; i++) {
        const positiveVolume = volumeByPrice[i].positive_value;
        const negativeVolume = volumeByPrice[i].negative_value;
        const priceY = yAxis.convertToPixel(minPrice + i * priceStep); // Convert the price range to a pixel position
        const positiveLineLength = (positiveVolume / maxVolume) * 300;
        const negativeLineLength = (negativeVolume / maxVolume) * 300;
        // Draw the positive volume
        if (positiveVolume > 0) {
          ctx.strokeStyle = 'rgba(76, 175, 80, 0.5)'; // Set positive volume color

          ctx.beginPath();
          ctx.moveTo(bounding.width, priceY); // Start from the right side of the chart
          ctx.lineTo(bounding.width - positiveLineLength, priceY); // Draw the line based on positive volume
          ctx.stroke();
        }

        if (negativeVolume > 0) {
          ctx.strokeStyle = 'rgba(244, 67, 54, 0.5)';

          ctx.beginPath();
          ctx.moveTo(bounding.width - positiveLineLength, priceY); // Start where the positive volume line ends
          ctx.lineTo(bounding.width - positiveLineLength - negativeLineLength, priceY); // Draw the line based on negative volume
          ctx.stroke();
        }
      }

      return false; // Indicate that default drawing should not occur
    }
  });

  useEffect(() => {
    chart.current = init('indicator-k-line');
    getTokenPrice({
      token_symbol: symbol,
      start_time: '2024-07-28 00:00:00',
      end_time: '2024-11-22 23:59:59'
    }).then((data) => {
      chart.current?.applyNewData(data);
    });

    chart.current?.createIndicator('AvgCost', true, { id: 'candle_pane' });
    chart.current?.createIndicator('MA', true, { id: 'candle_pane' });
    chart.current?.createIndicator('KDJ', true, { height: 80 });
    chart.current?.createIndicator('PriceByVolume', true, { id: 'candle_pane' });
    chart.current?.createIndicator('VOL', true);

    return () => {
      dispose('indicator-k-line');
    };
  }, [symbol]);

  useEffect(() => {
    if (!chart.current) {
      return;
    }
    let pvbInd = chart.current.getIndicatorByPaneId('candle_pane', 'PriceByVolume');

    chart.current.overrideIndicator({
      name: 'PriceByVolume',
      calc: (dataList) => {
        return getChartData({
          token_symbol: symbol,
          chart_label: 'trade_usd_pbv',
          start_time: formatToDateTimeString(timeRange.startTime),
          end_time: formatToDateTimeString(timeRange.endTime)
        });
      }
    });
  }, [symbol, timeRange]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <DateTimePicker
            label="Start Time"
            value={timeRange.startTime}
            onChange={handleStartTimeChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <DateTimePicker
            label="End Time"
            value={timeRange.endTime}
            onChange={handleEndTimeChange}
            renderInput={(params) => <TextField {...params} />}
          />
          {/* <RatioChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} priceData={priceData} /> */}
          <div id="indicator-k-line" className="k-line-chart" style={{ height: '600px' }} />
        </div>
      </LocalizationProvider>
    </>
  );
};

export default PriceByVolumeIndicator;
