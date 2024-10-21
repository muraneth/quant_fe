/* eslint-disable no-unused-vars */




import { useState, useEffect,useMemo } from 'react';

import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenPrice } from 'server/common';
import {getChartData} from 'server/chart';
import ChartBox from './ChartBox';



export default function ChartPage() {
  const location = useLocation();

  const { tokenItem } = useSelector((state) => state.token);
  const [chartData, setChartData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const { drawerOpen, openItem } = useSelector((state) => state.menu);
  const chartId = openItem ? openItem[0] : null;

  useEffect(() => {
    try{
          getChartData({
            token_symbol: tokenItem.symbol,
            chart_label: chartId
          }).then((response) => {
            setChartData(response?.data ? response.data : []);
          } );
          getTokenPrice({
            token_symbol: tokenItem.symbol,
          }).then((response) => {  
            setPriceData(response?.data ? response.data : []);
          });
       }catch (error) {
          console.error('Error fetching data:', error);
        }
  }, [tokenItem, chartId]);


  return (
    <Box sx={{mt:20}}>
      <ChartBox chartName={chartId} priceData={priceData} chartData={chartData} />
    </Box>
  );
}
