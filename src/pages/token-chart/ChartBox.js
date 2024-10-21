

import MainCard from 'components/MainCard';

import AvgCostChart from './AvgCostChart';

import BasicVolumeChart from './BasicVolumeChart';

import { useState,useEffect } from 'react';

const parsePriceToKlineSeries = (data) => {
    return data.map((item) => {
      return [item.day, item.open, item.close, item.low, item.high];
    });
}

function isAvgCostChart(chart) {
    const items = ['AvgCost', 'DexAvgCost', 'CexAvgCost', 'AvgCostExcept'];
    return items.includes(chart);
  }
function isBasicVolumeChart(chart) {
    const items = ['DailyTradeVolume', 'DailyTradeVolumeUSD', 'DailyTxVolume', 'USDPnNVolume','PnNVolume','RobotVolume','TradingVolumeWithoutBot'];
    return items.includes(chart);
  }

const ChartBox = ({ chartName,priceData,chartData }) =>{
   const [priceLineType, setPriceLineType] = useState('line');
    const [priceSeries, setPriceSeries] = useState([]);
    const switchKlineType = () => {
        setPriceLineType((prev) => (prev === 'line' ? 'candlestick' : 'line'));
        
    }
    useEffect(() => {
        if (priceLineType === 'candlestick') {
            const series = [
              {
                name: 'Price',
                type: 'candlestick',
                data: parsePriceToKlineSeries(priceData),
                itemStyle: {
                  color: '#ef232a',
                  color0: '#14b143',
                  borderColor: '#ef232a',
                  borderColor0: '#14b143'
                }
              }
            ];
            setPriceSeries(series);
          }
          else {
            const series = [
              {
                name: 'Price',
                type: 'line',
                data: priceData.map((item) => item.price),
                smooth: true
              }
            ];
            setPriceSeries(series);
          }
    
    },[priceLineType,priceData])

    return (
        <MainCard title={chartName}>
            <div>
                <button onClick={switchKlineType}>Switch Kline Type</button>
            </div>

            {isAvgCostChart(chartName) &&(
                <AvgCostChart chartName={chartName}  chartData={chartData} priceSeries={priceSeries} />
            )}
            {isBasicVolumeChart(chartName) &&(
                <BasicVolumeChart chartName={chartName}  chartData={chartData} priceSeries={priceSeries} />
            )}
        </MainCard>
    )

}
export default ChartBox;