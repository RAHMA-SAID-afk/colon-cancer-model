import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function LineChart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // ✅ Check if data is valid
    if (!data || !Array.isArray(data)) return;

    const grouped = data.reduce((acc, curr) => {
      if (!curr.predicted_at) return acc;
      const date = new Date(curr.predicted_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(grouped),
      datasets: [
        {
          label: 'Predictions',
          data: Object.values(grouped),
          borderColor: '#007bff',
          tension: 0.3,
          fill: false,
        },
      ],
    });
  }, [data]);

  // ✅ Prevent crash on initial render
  if (!chartData) {
    return <p>Loading line chart...</p>;
  }

  return (
    <div>
      <h3>Predictions Over Time</h3>
      <Line data={chartData} />
    </div>
  );
}

export default LineChart;
