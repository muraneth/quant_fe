import React, { useState } from 'react';

import AraeChart from './AreaChart';

const IndexPage = () => {
  const [charts, setCharts] = useState([]);

  const sampleOptions = {
    title: {
      text: 'Sample Chart',
    },
    tooltip: {},
    xAxis: {
      data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    yAxis: {},
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10],
      },
    ],
  };

  const addChart = () => {
    setCharts([...charts, { id: charts.length + 1, options: sampleOptions }]);
  };

  return (
    <div>
      <h1>Dynamic ECharts Dashboard</h1>
      <button onClick={addChart}>Add Chart +</button>
      <div className="chart-container">
        {charts.map((chart) => (
          <div key={chart.id} className="chart-wrapper">
            <AraeChart options={chart.options} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
