import React, { useEffect, useRef } from 'react';
import { init, dispose, registerIndicator } from 'klinecharts';
import generatedDataList from './generatedDataList';

import { getTokenPrice } from 'data-server/common';
import { getChartData } from 'data-server';

const PriceByVolumeIndicator = ({ symbol }) => {
  const chart = useRef(null);
  const paneId = useRef('');

  // Register the PBV indicator
  registerIndicator({
    name: 'PriceByVolume',
    calc: (dataList) => {
      // return dataList.map((data) => {
      //   return {
      //     price: data.avg_price,
      //     volume: data.volume
      //   };
      // });

      return getChartData({
        token_symbol: symbol,
        chart_label: 'trade_usd_pbv',
        start_time: '2024-06-28 00:00:00'
      });
    },
    draw: ({ ctx, kLineDataList, indicator, visibleRange, bounding, barSpace, xAxis, yAxis }) => {
      const { from, to } = visibleRange;
      let sellStartX = bounding.width; // Start drawing sell volume from the right
      let buyStartX = sellStartX; // Start drawing buy volume from the right

      // Set drawing styles
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 2;
      ctx.setLineDash([]); // Ensure the line is solid

      // Initialize an object to store accumulated volumes by price range (0 to 100)

      // Calculate the price range
      // const prices = kLineDataList.slice(from, to).map((data) => data.close); // Assuming 'close' is the price to use

      const volumeByPrice = indicator.result;
      console.log('volumeByPrice', volumeByPrice);
      if (!volumeByPrice || volumeByPrice.length === 0) {
        return false;
      }

      const minPrice = volumeByPrice[0].price_range_lower;
      const maxPrice = volumeByPrice[99].price_range_lower;

      // Calculate the price step for each slice
      const priceStep = (maxPrice - minPrice) / 100;
      console.log('minPrice', minPrice, 'maxPrice', maxPrice, 'priceStep', priceStep);

      // Draw the accumulated volumes for each price range
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
    chart.current?.createIndicator('PriceByVolume', false, { id: 'candle_pane' });
    chart.current.setPriceVolumePrecision(10, 1);
    getTokenPrice({
      token_symbol: symbol,
      start_time: '2024-07-28 00:00:00',
      end_time: '2024-10-22 23:59:59'
    }).then((data) => {
      chart.current?.applyNewData(data);
    });

    return () => {
      dispose('indicator-k-line');
    };
  }, []);

  return <div id="indicator-k-line" className="k-line-chart" style={{ height: '600px' }} />;
};

export default PriceByVolumeIndicator;
