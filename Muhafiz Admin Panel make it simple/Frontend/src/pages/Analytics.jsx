import { useState, useEffect } from 'react';
import Card from '../components/Card';
import '../styles/analytics.css';

import BarChartComponent from '../components/BarChartComponent';
import LineChartComponent from '../components/LineChartComponent';
import PieChartComponent from '../components/PieChartComponent';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('crime');
  const [chartData, setChartData] = useState({
    crimeByType: [],
    crimeByArea: [],
    incidentsOverTime: [],
    severityDistribution: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5002/api/analytics')
      .then(res => res.json())
      .then(data => {
        setChartData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch analytics:", err);
        setLoading(false);
      });
  }, []);

  // Safe fallbacks
  const totalIncidents = chartData.crimeByType?.reduce((sum, item) => sum + item.value, 0) || 0;
  const topArea = chartData.crimeByArea?.length
    ? JSON.parse(JSON.stringify(chartData.crimeByArea)).sort((a, b) => b.value - a.value)[0]?.label
    : 'N/A';
  const commonCrime = chartData.crimeByType?.length
    ? JSON.parse(JSON.stringify(chartData.crimeByType)).sort((a, b) => b.value - a.value)[0]?.label
    : 'N/A';

  return (
    <div className="analytics-page">
      <h2 className="page-title">Analytics & Graphs</h2>

      <div className="analytics-controls">
        <div className="control-group">
          <label>Time Range:</label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <div className="control-group">
          <label>Chart Type:</label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="crime">By Crime Type</option>
            <option value="area">By Area</option>
            <option value="time">Over Time</option>
            <option value="severity">By Severity</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ padding: "1rem" }}>Loading analytics...</p>
      ) : (
        <>
          <div className="charts-grid">
            <Card>
              {chartType === 'crime' && (
                <BarChartComponent title="Crime Incidents by Type" data={chartData.crimeByType} />
              )}
              {chartType === 'area' && (
                <BarChartComponent title="Crime Incidents by Area" data={chartData.crimeByArea} />
              )}
              {chartType === 'time' && (
                <LineChartComponent title="Crime Incidents Over Time" data={chartData.incidentsOverTime} />
              )}
              {chartType === 'severity' && (
                <PieChartComponent title="Crime Severity Distribution" data={chartData.severityDistribution} />
              )}
            </Card>

            <Card title="Summary Statistics">
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total Incidents</h4>
                  <p>{totalIncidents}</p>
                  <small>+12% from last {timeRange}</small>
                </div>
                <div className="stat-card">
                  <h4>Top Area</h4>
                  <p>{topArea}</p>
                  <small>Most affected area</small>
                </div>
                <div className="stat-card">
                  <h4>Most Common Type</h4>
                  <p>{commonCrime}</p>
                  <small>Common reported crime</small>
                </div>
              </div>
            </Card>
          </div>

          <div className="charts-row">
            <Card title="Crime by Area (Top 10 Towns)">
              <BarChartComponent
                title=""
                data={JSON.parse(JSON.stringify(chartData.crimeByArea))
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 10)}
                height="250px"
              />
            </Card>

            <Card title="Crime by Type">
              <PieChartComponent
                title=""
                data={chartData.crimeByType
                  ?.sort((a, b) => b.value - a.value)
                  .slice(0, 10)}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
