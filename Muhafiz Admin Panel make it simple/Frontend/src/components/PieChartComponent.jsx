import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6f61', '#36cfc9', '#ff9f00', '#a28fd0', '#3cb371', '#ffb6c1', '#20b2aa'];

const PieChartComponent = ({ title, data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);

  const topItems = sorted.slice(0, 9);
  const rest = sorted.slice(9);
  const otherTotal = rest.reduce((sum, item) => sum + item.value, 0);
  const otherPercent = (otherTotal / total) * 100;

  const finalData = [...topItems];
  if (otherTotal > 0 && otherPercent < 20) {
    finalData.push({ label: 'Other', value: otherTotal });
  }

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={finalData}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {finalData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
