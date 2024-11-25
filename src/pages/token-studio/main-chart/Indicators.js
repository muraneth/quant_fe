import { useState, useEffect, useRef } from 'react';

import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

import { getChartData } from 'data-server';
import { max, set } from 'lodash';
import { padAarryAHeadByCount, padAarryBehindByCount } from 'utils/common';

const calculateMA = (klinedata, dayCount) => {
  const result = [];
  for (let i = 0, len = klinedata.length; i < len; i++) {
    if (i < dayCount - 1) {
      // Not enough data yet, push null or the current value
      result.push(null);
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += klinedata[i - j].avg_price;
    }
    result.push(sum / dayCount);
  }
  return result;
};

const IndicatorOptions = ({ symbol, startTime, endTime, indicators, klineData, setDataSeries, setYAxis }) => {
  const [priceIndicators, setPriceIndicators] = useState([]);
  const [pbvIndicator, setPBVIndicators] = useState([]);
  const [ratioIndicators, setRatioIndicators] = useState([]);

  // const pIndicators = indicators.filter((indicator) => indicator.type === 'price');
  // const pbvIndicators = indicators.filter((indicator) => indicator.type === 'pbv');

  useEffect(() => {
    const priceInd = indicators.filter((indicator) => indicator.type === 'price');
    setPriceIndicators(priceInd);
    priceInd.forEach((indicator) => onPriceIndicatorsChange(null, indicator));

    const pbvInd = indicators.filter((indicator) => indicator.type === 'pbv');
    setPBVIndicators(pbvInd);
    // pbvInd.forEach((indicator) => onPBVIndicatorChange(null, indicator));
    if (pbvInd.length > 0) {
      onPBVIndicatorChange(null, pbvInd[0]);
    }

    const ratioInd = indicators.filter((indicator) => indicator.type === 'ratio');
    setRatioIndicators(ratioInd);
    ratioInd.forEach((indicator) => onRatioIndicatorChang(null, indicator));
  }, [indicators, startTime, endTime]);
  const onRatioIndicatorChang = (event, indicator) => {
    const isChecked = event?.target?.checked ?? true;
    if (isChecked) {
      setDataSeries((prev) => prev.filter((item) => item.id !== indicator.id));

      if (indicator.need_fetch) {
        getChartData({
          token_symbol: symbol,
          handle_name: indicator.id,
          start_time: startTime,
          end_time: endTime
        }).then((data) => {
          setDataSeries((prev) => [
            ...prev,
            {
              id: indicator.id,
              name: indicator.name,
              type: 'line',
              yAxisIndex: 2,

              data: data?.map((item) => item.value),
              smooth: true,
              symbol: 'none'
            }
          ]);
        });
      }
    } else {
      setDataSeries((prev) => prev.map((item) => (item.id === indicator.id ? { ...item, data: [] } : item)));
    }
  };

  const onPriceIndicatorsChange = (event, indicator) => {
    const isChecked = event?.target?.checked ?? true;
    console.log('onPriceIndicatorsChange', isChecked, indicator);

    if (isChecked) {
      // first remove
      setDataSeries((prev) => prev.filter((item) => item.id !== indicator.id));

      if (indicator.need_fetch) {
        getChartData({
          token_symbol: symbol,
          handle_name: indicator.id,
          start_time: startTime,
          end_time: endTime
        }).then((data) => {
          setDataSeries((prev) => [
            ...prev,
            {
              id: indicator.id,
              name: indicator.name,
              type: 'line',
              yAxisIndex: 0,
              data: data?.map((item) => item.value),
              smooth: true,
              symbol: 'none'
            }
          ]);
        });
      } else {
        // ma
        if (indicator.id.includes('ma_')) {
          setDataSeries((prev) => [
            ...prev,
            {
              id: indicator.id,
              name: indicator.name,
              type: 'line',
              yAxisIndex: 0,
              data: calculateMA(klineData, indicator.window),
              smooth: true,
              symbol: 'none'
            }
          ]);
        }
      }
      if (indicator.id == 'volume_weighted_avg_price' || indicator.id == 'buy_avg_price' || indicator.id == 'sell_avg_price') {
        let data = [];
        switch (indicator.id) {
          case 'volume_weighted_avg_price':
            data = klineData.map((item) => item.avg_price);
            break;
          case 'buy_avg_price':
            data = klineData.map((item) => item.buy_avg_price);
            break;
          case 'sell_avg_price':
            data = klineData.map((item) => item.sell_avg_price);
            break;
        }

        setDataSeries((prev) => [
          ...prev,
          {
            id: indicator.id,
            name: indicator.name,
            type: 'line',
            yAxisIndex: 0,
            data: data,
            smooth: true,
            symbol: 'none'
          }
        ]);
      }
    } else {
      setDataSeries((prev) => prev.map((item) => (item.id === indicator.id ? { ...item, data: [] } : item)));
    }
  };
  const onPBVIndicatorChange = (event, indicator) => {
    const isChecked = event?.target?.checked ?? true;

    if (isChecked) {
      // first remove
      setDataSeries((prev) => prev.filter((item) => item.id !== `pos_${indicator.id}`));
      setDataSeries((prev) => prev.filter((item) => item.id !== `neg_${indicator.id}`));
      console.log('onPBVIndicatorChange', isChecked, indicator);

      getChartData({
        token_symbol: symbol,
        handle_name: indicator.id,
        start_time: startTime,
        end_time: endTime
      }).then((data) => {
        if (!data || data.length == 0) {
          return;
        }
        const step = data[0].price_range_upper - data[0].price_range_lower;
        const maxPrice = klineData.reduce((max, p) => (p.high > max ? p.high : max), klineData[0].high) + 10 * step;
        const minPrice = klineData.reduce((min, p) => (p.low < min ? p.low : min), klineData[0].low) - 10 * step;
        // add 10 empty to data head and  tail
        console.log('minPrice', minPrice, 'maxPrice', maxPrice, 'step', step);

        data = padAarryBehindByCount(data, 10);
        data = padAarryAHeadByCount(data, 10);
        setYAxis((prev) => [
          {
            ...prev[0],
            max: maxPrice,
            min: minPrice
          },
          ...prev.slice(1),
          {
            type: 'category',
            data: data?.map((item) => item?.price_range_lower),
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
          }
        ]);
        setDataSeries((prev) => [
          ...prev,
          {
            id: `pos_${indicator.id}`,
            name: 'Positive PBV',
            type: 'bar',
            stack: 'pbvVolume',
            data: data.map((item) => item?.positive_value),
            yAxisIndex: 3,
            xAxisIndex: 2,
            itemStyle: {
              color: 'rgba(144, 238, 144, 0.5)' // Light blue with 50% transparency
            }
          },
          {
            id: `neg_${indicator.id}`,
            name: 'Negative PBV',
            type: 'bar',
            stack: 'pbvVolume',
            data: data.map((item) => item?.negative_value),
            yAxisIndex: 3,
            xAxisIndex: 2,
            itemStyle: {
              color: ' rgba(255, 111, 97, 0.5)' // Light red with 50% transparency
            }
          }
        ]);
      });
    } else {
      setDataSeries((prev) => prev.map((item) => (item.id === `pos_${indicator.id}` ? { ...item, data: [] } : item)));
      setDataSeries((prev) => prev.map((item) => (item.id === `neg_${indicator.id}` ? { ...item, data: [] } : item)));
    }
  };
  // Trigger onAvgCostChange for each indicator on initial render
  useEffect(() => {
    // if (!hasRenderedPriceIndicators.current) {
    priceIndicators.forEach((indicator) => onPriceIndicatorsChange(null, indicator));
    // hasRenderedPriceIndicators.current = true;
    // }
  }, [symbol, startTime, endTime]);

  // Initialize PBV indicators on first render
  useEffect(() => {
    pbvIndicator.forEach((indicator) => onPBVIndicatorChange(null, indicator));
    // hasRenderedPBVIndicators.current = true;
  }, [symbol, startTime, endTime]);

  return (
    <FormGroup row>
      {priceIndicators?.map((indicator) => (
        <FormControlLabel
          key={indicator.id}
          control={
            <Checkbox
              defaultChecked
              onChange={(event) => onPriceIndicatorsChange(event, indicator)}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 16
                }
              }}
            />
          }
          label={<span style={{ fontSize: '14px' }}>{indicator.name}</span>}
        />
      ))}
      <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
      {pbvIndicator?.map((indicator) => (
        <FormControlLabel
          key={indicator.id}
          control={
            <Checkbox
              defaultChecked
              onChange={(event) => onPBVIndicatorChange(event, indicator)}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 16
                }
              }}
            />
          }
          label={<span style={{ fontSize: '14px' }}>{indicator.name}</span>}
        />
      ))}
      {ratioIndicators?.map((indicator) => (
        <FormControlLabel
          key={indicator.id}
          control={
            <Checkbox
              defaultChecked
              onChange={(event) => onRatioIndicatorChang(event, indicator)}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 16
                }
              }}
            />
          }
          label={<span style={{ fontSize: '14px' }}>{indicator.name}</span>}
        />
      ))}
    </FormGroup>
  );
};

export default IndicatorOptions;
