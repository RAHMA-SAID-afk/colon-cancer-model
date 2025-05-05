import React, { useEffect, useState } from 'react';
import PieChart from '../components/Charts/PieChart';
import LineChart from '../components/Charts/LineChart';
import { fetchPredictions, fetchCases } from '../api';
import '../App.css';
import { Link } from 'react-router-dom';


function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchPredictions()
      .then(res => setPredictions(res.data || []))
      .catch(err => console.error(err));

    fetchCases()
      .then(res => {
        const all = res.data || [];
        const sorted = all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentCases(sorted.slice(0, 5)); // Only show latest 5
      })
      .catch(err => console.error(err));
  }, [refresh]);

  return (
    <div className="dashboard-container">
      <h2>Colon Cancer Detection Dashboard</h2>

      <div className="charts">
        <div className="chart-container">
          <PieChart data={predictions} />
        </div>
        <div className="chart-container">
          <LineChart data={predictions} />
        </div>
      </div>

      <div className="table-container">
        <h3>📝 Recent Cases</h3>
        <table className="case-table">
          <thead>
            <tr>
              <th>Case</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {recentCases.map(c => (
              <tr key={c.id}>
                <td>{c.full_name}</td>
                <td>{c.age}</td>
                <td>{c.gender}</td>
                <td>{new Date(c.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
       < div style={{ marginTop: '10px', textAlign: 'right' }}>
  <Link to="/cases" className="view-all-link">→ See All Cases</Link>
</div>
      </div>
    </div>
  );
}

export default Dashboard;
