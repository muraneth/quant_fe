import React, { useEffect, useRef } from 'react';
import { init, dispose, registerIndicator } from 'klinecharts';
import generatedDataList from './generatedDataList';

import { getTokenPrice } from 'server/common';



const PriceByVolumeIndicator = () => {
  const chart = useRef(null);
  const paneId = useRef('');

  // Register the PBV indicator
  registerIndicator({
    name: 'PriceByVolume',
    calc: (dataList) => {
      return dataList.map((data) => {
        return { 
        price: data.avg_price,
        volume: data.volume 
      }
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
      const volumeByPrice = Array(100).fill(0); // Initialize an array with 100 slots to accumulate volume
    
      // Calculate the price range
      const prices = kLineDataList.slice(from, to).map((data) => data.close); // Assuming 'close' is the price to use
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
    
      // Calculate the price step for each slice
      const priceStep = (maxPrice - minPrice) / 100;
    
      // First pass: accumulate volumes for each price range
      for (let i = from; i < to; i++) {
        const { price, volume } = indicator.result[i] || { price: 0, volume: 0 }; // Default to 0 if undefined
        if (price) {
          // Calculate which slice the price belongs to
          const priceIndex = Math.floor((price - minPrice) / priceStep);
    
          // Ensure the index is within bounds (0 to 99)
          if (priceIndex >= 0 && priceIndex < 100) {
            volumeByPrice[priceIndex] += volume; // Accumulate volume for the range
          }
        }
      }
    
      console.log('from', from, 'to', to);
      console.log('volumeByPrice', volumeByPrice);
    
      // Draw the accumulated volumes for each price range
      let maxVolume = 0;
      for (let i = 0; i < 100; i++) {
        maxVolume = Math.max(maxVolume, volumeByPrice[i]);
      }
      for (let i = 0; i < 100; i++) {
        const accumulatedVolume = volumeByPrice[i];
        const priceY = yAxis.convertToPixel(minPrice + i * priceStep); // Convert the price range to a pixel position
        const lineLength = accumulatedVolume / maxVolume *1000; // Use accumulated volume for line length
    
        if (accumulatedVolume > 0) {
          ctx.beginPath();
          ctx.moveTo(bounding.width, priceY); // Start from the right side of the chart
          ctx.lineTo(bounding.width - lineLength, priceY); // Draw the line based on accumulated volume
          ctx.stroke();
        }
      }
    
      return false; // Indicate that default drawing should not occur
    }
  });

  useEffect(() => {
    chart.current = init('indicator-k-line');
    chart.current?.createIndicator('PriceByVolume', false, { id: 'candle_pane' });
    getTokenPrice({
      token_symbol: 'NEIRO',
      start_time: '2024-07-28 00:00:00',
      end_time: '2024-10-22 23:59:59'
    }).then((data) => {
      chart.current?.applyNewData(data);
    });
    // chart.current?.applyNewData(generatedDataList());

    return () => {
      dispose('indicator-k-line');
    };
  }, []);

  return <div id="indicator-k-line" className="k-line-chart" style={{ height: '600px' }} />;
};

export default function Indicator() {
  return (

      <PriceByVolumeIndicator />

  );
}
