import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Reports() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/patients');
        const patients = res.data;

        const predictionsRes = await axios.get('http://localhost:5000/api/predictions');
        const predictions = predictionsRes.data;

        // Merge prediction results into patient records
        const combined = patients.map(patient => {
          const pred = predictions.find(p =>
            p.patient_id === patient.id || p.image_id === patient.id
            
          );
          return {
            ...patient,
            result: pred ? pred.result : 'N/A',
            created_at: pred?.created_at || patient?.created_at || 'N/A'
          };
        });

        setCases(combined);
        setFilteredCases(combined);
      } catch (err) {
        console.error('Failed to fetch report data', err);
      }
    };

    fetchCases();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = cases.filter(c => {
      const isNameMatch = c.full_name?.toLowerCase().includes(value);
      const isContactMatch = c.contact?.toLowerCase().includes(value);
      const isGenderMatch = c.gender?.toLowerCase() === value;
      const isResultMatch = c.result?.toLowerCase() === value;
  
      const isIdMatch = c.id?.toString() === value;
      const isAgeMatch = c.age?.toString() === value;
  
      return isNameMatch || isContactMatch || isGenderMatch || isResultMatch || isIdMatch || isAgeMatch;
    });
  
    setFilteredCases(filtered);
  };
  
  const downloadPDF = async () => {
    const input = tableRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('case-report.pdf');
  };

  return (
    <div className="main-content">
      <div className="report-header">
        <h2>📋 Prediction Report</h2>
        <button onClick={downloadPDF} className="download-btn">📥 PDF</button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by ID, name, age, gender and result"
        className="report-search"
      />

      <div ref={tableRef}>
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Contact</th>
              <th>Result</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c, index) => (
              <tr key={index}>
                <td>{c.id}</td>
                <td>{c.full_name}</td>
                <td>{c.gender}</td>
                <td>{c.age}</td>
                <td>{c.contact}</td>
                <td>{c.result}</td>
                <td>{c.created_at ? new Date(c.created_at).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
