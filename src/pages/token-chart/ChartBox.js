

import MainCard from 'components/MainCard';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import BaseLineChart from './BaseLineChart';
import BasicVolumeChart from './BasicVolumeChart';
import AvgCostChart from './AvgCostChart';
import { useState,useEffect } from 'react';

const parsePriceToKlineSeries = (data) => {
    return data.map((item) => {
      return [item.day, item.open, item.close, item.low, item.high];
    });
}

function isBaseLineChart(chart) {
    return  !isAvgCostChart(chart) && !isBasicVolumeChart(chart) && !isPriceByVolumeChart(chart);
}
function isAvgCostChart(chart) {
    const items = ['AvgCost', 'DexAvgCost', 'CexAvgCost', 'AvgCostExcept'];
    return items.includes(chart);
  }
function isBasicVolumeChart(chart) {
    const items = ['DailyTradeVolume', 'DailyTradeVolumeUSD', 'DailyTxVolume', 'USDPnNVolume','PnNVolume','RobotVolume','TradingVolumeWithoutBot'];
    return items.includes(chart);
}
function isPriceByVolumeChart(chart) {
    const items = ['PriceByVolumeTimeRange','WalletPriceByVolume'];
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
                yAxisIndex: 0,
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
                yAxisIndex: 0,
                data: priceData.map((item) => item.price),
                smooth: true
              }
            ];
            setPriceSeries(series);
          }
    
    },[priceLineType,priceData])

    return (
        <MainCard>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom>
                    {chartName}
                </Typography>
                <FormControlLabel control={<Switch onChange={switchKlineType}/>} label="Kline" />

            </Box>
            {isBaseLineChart(chartName) &&(
                <BaseLineChart chartName={chartName}  chartData={chartData} priceSeries={priceSeries} />
            )}
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