import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTokenPrice,getChartData } from 'data-server';
import { useTheme } from '@mui/material/styles';
import {generateXSeries,generateYSeries} from './ChartSeries';

const ChartBox = ({ symbol }) => {
    const theme = useTheme();

    const[indicators,setIndicators] = useState([]);
    const [klineData,setklineData] = useState([]);
    const [chartData, setChartData] = useState({
        priceIndicatorData: [],
        pbvIndicatorData: [],
        holderIndicatorData: [],
        balanceIndicatorData: [],
        pnlIndicatorData: [],
    });
    const [xSeries, setXSeries] = useState([]);
    const [ySeries, setYSeries] = useState([]);
    useEffect(() => {
        getTokenPrice({ token_symbol: symbol }).then((priceData) => {
            setklineData(priceData ? priceData : []);
            let minPrice = 0;
            if (priceData?.length > 0) {
                minPrice = priceData.reduce((min, p) => (p.low < min ? p.low : min), priceData[0].low);
            }
            setXSeries(generateXSeries(theme,priceData));
            setYSeries(generateYSeries(theme,priceData));
        });

    },[symbol])
        

}

export default ChartBox;