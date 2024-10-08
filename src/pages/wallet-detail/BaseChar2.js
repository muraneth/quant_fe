import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const BalanceChartD3 = ({ chartData, dataKey }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartData || chartData.length === 0) return;

    const margin = { top: 20, right: 60, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Clear existing chart
    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleTime()
      .domain(d3.extent(chartData, d => new Date(d.day)))
      .range([0, width]);

    const y1 = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => Math.max(d[dataKey] || 0, d.idx_price))])
      .range([height, 0]);

    const y2 = isNotSeperatePrice(dataKey) ? null : d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.idx_price)])
      .range([height, 0]);

    // Create line generators
    const line1 = d3.line()
      .x(d => x(new Date(d.day)))
      .y(d => y1(d[dataKey] || 0))
      .curve(d3.curveMonotoneX);

    const line2 = d3.line()
      .x(d => x(new Date(d.day)))
      .y(d => (y2 || y1)(d.idx_price))
      .curve(d3.curveMonotoneX);

    // Create area generator
    const area = d3.area()
      .x(d => x(new Date(d.day)))
      .y0(height)
      .y1(d => y1(d[dataKey] || 0))
      .curve(d3.curveMonotoneX);

    // Add the area
    svg.append("path")
      .datum(chartData)
      .attr("fill", "rgba(76, 175, 80, 0.3)")
      .attr("d", area);

    // Add the lines
    svg.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#4CAF50")
      .attr("stroke-width", 2)
      .attr("d", line1);

    svg.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#FFA500")
      .attr("stroke-width", 2)
      .attr("d", line2);

    // Add the X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(20))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y1));

    // Add the second Y Axis if needed
    if (y2) {
      svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(y2));
    }

    // Add Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value & Price");

    // Add second Y axis label if needed
    if (y2) {
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.right)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Price");
    }
  }, [chartData, dataKey]);

  return <div ref={chartRef}></div>;
};

BalanceChartD3.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      idx_price: PropTypes.number.isRequired
    })
  ).isRequired,
  dataKey: PropTypes.string.isRequired
};

function isNotSeperatePrice(dataKey) {
  const items = ['avg_cost'];
  return items.includes(dataKey);
}

export default BalanceChartD3;