import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // ✅ Prevent crash if data is undefined or not an array
    if (!data || !Array.isArray(data)) return;

    const normal = data.filter(item => item.result === 'Normal').length;
    const abnormal = data.filter(item => item.result === 'Abnormal').length;

    setChartData({
      labels: ['Normal', 'Abnormal'],
      datasets: [
        {
          label: 'Cases',
          data: [normal, abnormal],
          backgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    });
  }, [data]);

  // ✅ Avoid rendering chart with undefined data
  if (!chartData) return <p>Loading pie chart...</p>;

  return (
    <div>
      <h3>Normal vs Abnormal</h3>
      <Pie data={chartData} />
    </div>
  );
}

export default PieChart;
