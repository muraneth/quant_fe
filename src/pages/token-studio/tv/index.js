import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const PriceByVolumeChart = () => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
    });

    // Sample data for demonstration
    const pbvData = [
      { price: 30000, volume: 5000 },
      { price: 30100, volume: 3000 },
      { price: 30200, volume: 2000 },
    ];

    // Convert PBV data for plotting
    const seriesData = pbvData.map(item => ({
      time: item.price,
      value: item.volume,
    }));

    const volumeSeries = chart.addLineSeries({
      color: '#4caf50',
      lineWidth: 2,
    });

    volumeSeries.setData(seriesData);

    return () => chart.remove();
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: 'relative', height: '500px' }}
    />
  );
};

export default PriceByVolumeChart;
