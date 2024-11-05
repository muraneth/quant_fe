import React, { useEffect, useRef } from 'react';
import { init, dispose, registerIndicator } from 'klinecharts';
import generatedDataList from './generatedDataList';





const PriceByVolumeIndicator = () => {
  const chart = useRef(null);
  const paneId = useRef('');

  // Register the PBV indicator
  registerIndicator({
    name: 'PriceByVolume',
    calc: (dataList) => {
      return dataList.map((data) => ({
        price: data.close,
        volume: data.volume || 0 // Ensure volume is defined
      }));
    },
    draw: ({ ctx, kLineDataList, indicator, visibleRange, bounding, barSpace, xAxis, yAxis }) => {
      const { from, to } = visibleRange;
      let sellStartX = bounding.width; // Start drawing sell volume from the right
      let buyStartX = sellStartX; // Start drawing buy volume from the right

      // Set drawing styles
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 2;
      ctx.setLineDash([]); // Ensure the line is solid

      // Initialize an object to store accumulated volumes by price
      const volumeByPrice = {};

      // First pass: accumulate volumes for each price
      for (let i = from; i < to; i++) {
        const { price, volume } = indicator.result[i] || { price: 0, volume: 0 }; // Default to 0 if undefined
        if (price) {
          const priceKey = price.toFixed(0); // Round to 2 decimal places for key
          volumeByPrice[priceKey] = (volumeByPrice[priceKey] || 0) + volume; // Accumulate volume
        }
      }

      console.log('from', from, 'to', to);
      console.log('volumeByPrice', volumeByPrice);

      for (const price in volumeByPrice) {
        const accumulatedVolume = volumeByPrice[price];
        const priceY = yAxis.convertToPixel(Number(price)); // Convert price back to a number for pixel position
        const lineLength = accumulatedVolume; // Use accumulated volume for line length

        ctx.beginPath();
        ctx.moveTo(bounding.width, priceY); // Start from the right side of the chart
        ctx.lineTo(bounding.width - lineLength, priceY); // Draw the line based on accumulated volume
        ctx.stroke();
      }

      return false; // Indicate that default drawing should not occur
    }
  });

  useEffect(() => {
    chart.current = init('indicator-k-line');
    chart.current?.createIndicator('PriceByVolume', false, { id: 'candle_pane' });
    chart.current?.applyNewData(generatedDataList());

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
