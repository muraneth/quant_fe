// src/VolatilityChart.js
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const VolatilityChart = ({ productSymbol }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.get(`https://matrixcipher.com/api/product/getProductRollingVolatility?product=${productSymbol}`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setData(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getOption = (data) => {
    const dates = data.map((item) => item.date);
    const values = data.map((item) => item.value);

    return {
      title: {
        text: 'Rolling Volatility Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const date = params[0].axisValue;
          const value = params[0].data;
          return `Date: ${date}<br/>Volatility: ${value.toFixed(2)}%`;
        }
      },
      xAxis: {
        type: 'category',
        data: dates,
        name: 'Date',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: 'Volatility',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '{value} %' // Add % symbol
        }
      },
      series: [
        {
          data: values,
          type: 'line',
          smooth: true
        }
      ]
    };
  };

  return (
    <div>
      <ReactECharts option={getOption(data)} style={{ height: '600px', width: '100%' }} />
    </div>
  );
};

export default VolatilityChart;
