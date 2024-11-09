import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getTokenPrice, getChartData, getTokenInfo } from 'data-server';
import { useTheme } from '@mui/material/styles';
import { generateDataSeries, generateXAxis, generateYAxis } from './ChartSeries';
import CompactDateTimePicker from './CompactDataPicker';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MainChart from './MainChart2';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import TokenInf from './TokenInfo';
import IndicatorOptions from './Indicators';

import IndicatorPopup from './IndicatorPopup';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const formatToDateTimeString = (date) => {
  return date ? date.format('YYYY-MM-DD HH:mm:ss') : '';
};

const ChartBox = ({ symbol }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState({
    startTime: dayjs(),
    endTime: dayjs()
  });
  const [isIndicatorPumpupOpen, setIndicatorPumpupOpen] = useState(false);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [indicators, setIndicators] = useState({
    pbvIndicator: { checked: false, data: [] },
    holderIndicator: { checked: false, data: [] },
    balanceIndicator: { checked: false, data: [] },
    pnlIndicator: { checked: false, data: [] }
  });
  const [xAxis, setXAxis] = useState([]);
  const [yAxis, setYAxis] = useState([]);
  const [dataSeries, setDataSeries] = useState([]);
  const [klineData, setKlineData] = useState([]);

  const handleStartTimeChange = useCallback((newValue) => {
    setTimeRange((prev) => ({ ...prev, startTime: newValue }));
  }, []);

  const handleEndTimeChange = useCallback((newValue) => {
    setTimeRange((prev) => ({ ...prev, endTime: newValue }));
  }, []);

  const handleIndicatorOpenPumpup = () => {
    setIndicatorPumpupOpen(true);
  };

  const handleIndicatorClosePumpup = () => {
    setIndicatorPumpupOpen(false);
  };

  const handleIndicatorChange = (event) => {
    const { name, checked } = event.target;
    setIndicators((prevIndicators) => ({
      ...prevIndicators,
      [name]: checked
    }));

    // Call getChartData only when an indicator is checked
    if (checked) {
      getChartData(name);
    }
  };

  useEffect(() => {
    getTokenInfo(symbol).then((response) => {
      if (response?.create_time) {
        let start = response.create_time.split(' ')[0] + ' 00:00:00';
        let startTime = dayjs(start);
        setTimeRange((prev) => ({ ...prev, startTime }));
      }
    });
  }, [symbol]);

  // Debounced function for getting token price data
  const initPriceData = debounce(() => {
    getTokenPrice({
      token_symbol: symbol,
      start_time: formatToDateTimeString(timeRange.startTime),
      end_time: formatToDateTimeString(timeRange.endTime)
    }).then((priceData) => {
      setKlineData(priceData);
      setXAxis(generateXAxis(theme, priceData));
      setYAxis(generateYAxis(theme, priceData));
      setDataSeries(generateDataSeries(theme, priceData));
    });
  }, 100);
  useEffect(() => {
    initPriceData();
    return () => initPriceData.cancel();
  }, [timeRange]);

  const fetchIndicators = debounce(({ indicatorName }) => {
    const responseData = getChartData(indicatorName); // Replace with actual API call
    setIndicators((prevIndicators) => ({
      ...prevIndicators,
      [indicatorName]: {
        ...prevIndicators[indicatorName],
        data: responseData
      }
    }));
  }, 100);

  return (
    <Box sx={{ mt: 0, p: 0 }}>
      {isIndicatorPumpupOpen && (
        <IndicatorPopup open={isIndicatorPumpupOpen} onClose={handleIndicatorClosePumpup} setSelectedIndicators={setSelectedIndicators} />
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ ml: 10 }}>
        <TokenInf symbol={symbol} />
      </Box>
      <Divider />
      {/* <Box>{selectedIndicators}</Box> */}

      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1, height: '30px' }}>
        <IndicatorOptions
          symbol={symbol}
          startTime={formatToDateTimeString(timeRange.startTime)}
          endTime={formatToDateTimeString(timeRange.endTime)}
          indicators={selectedIndicators}
          klineData={klineData}
          // setXAxis={setXAxis}
          setDataSeries={setDataSeries}
          setYAxis={setYAxis}
        />
        <Button variant="" onClick={handleIndicatorOpenPumpup} startIcon={<ShowChartIcon />}>
          Indicator
        </Button>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ mt: 1, position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 24, // Adjust based on the desired vertical placement
              left: 60, // Adjust based on the desired horizontal placement
              zIndex: 10, // Ensures the picker is on top of the chart
              backgroundColor: 'transparent',
              padding: 1, // Optional: add some padding for spacing
              borderRadius: 1 // Optional: round the corners of the background box
            }}
          >
            <CompactDateTimePicker
              label="Start Time"
              value={timeRange.startTime}
              onChange={handleStartTimeChange}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: '200px' }
                },
                // Customize the popper (dropdown) size
                popper: {
                  sx: {
                    '& .MuiPaper-root': {
                      transform: 'scale(0.9)',
                      transformOrigin: 'top left'
                    }
                  }
                }
              }}
            />
            <CompactDateTimePicker
              label="End Time"
              value={timeRange.endTime}
              onChange={handleEndTimeChange}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: '200px' }
                },
                popper: {
                  sx: {
                    '& .MuiPaper-root': {
                      transform: 'scale(0.9)',
                      transformOrigin: 'top left'
                    }
                  }
                }
              }}
            />
          </Box>

          <MainChart chartName={symbol} xAxis={xAxis} yAxis={yAxis} dataSeries={dataSeries} />
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default ChartBox;
