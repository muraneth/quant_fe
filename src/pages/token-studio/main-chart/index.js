import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTokenPrice, getChartData } from 'data-server';
import { useTheme } from '@mui/material/styles';
import { generateDataSeries, generateXAxis, generateYAxis } from './ChartSeries';
import CompactDateTimePicker from './CompactDataPicker';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MainChart from './MainChart2';

const ChartBox = ({ symbol }) => {
  const theme = useTheme();

  const [indicators, setIndicators] = useState([]);
  const [klineData, setklineData] = useState([]);
  const [chartData, setChartData] = useState({
    priceIndicatorData: [],
    pbvIndicatorData: [],
    holderIndicatorData: [],
    balanceIndicatorData: [],
    pnlIndicatorData: []
  });
  const [xAxis, setXAxis] = useState([]);
  const [yAxis, setYAxis] = useState([]);
  const [dataSeries, setDataSeries] = useState([]);
  useEffect(() => {
    getTokenPrice({ token_symbol: symbol }).then((priceData) => {
      // setklineData(priceData ? priceData : []);
      let minPrice = 0;
      if (priceData?.length > 0) {
        minPrice = priceData.reduce((min, p) => (p.low < min ? p.low : min), priceData[0].low);
      }
      setXAxis(generateXAxis(theme, priceData));
      setYAxis(generateYAxis(theme, priceData));
      setDataSeries(generateDataSeries(theme, priceData, chartData));
    });
  }, [symbol]);

  return (
    <Box sx={{ mt: 0, p: 0 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ mt: 1, position: 'relative' }}>
          {/* Container for Date Pickers with absolute positioning */}
          {/* <Box
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
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
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
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
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
          </Box> */}

          <MainChart chartName={symbol} xAxis={xAxis} yAxis={yAxis} dataSeries={dataSeries} />
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default ChartBox;
