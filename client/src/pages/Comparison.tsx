import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import { KPI_CONFIG } from '../utils/kpiConfig';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import './Comparison.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function Comparison() {
  const { companies, loading } = useCompanies();
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const companiesWithData = useMemo(() => {
    return companies.filter(c => c.overallIndex > 0 || c.kpis?.ltifr?.score > 0);
  }, [companies]);

  const toggleCompany = (id: string) => {
    setSelectedCompanies(prev => {
      if (prev.includes(id)) {
        return prev.filter(c => c !== id);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const selectedData = useMemo(() => {
    return selectedCompanies
      .map(id => companiesWithData.find(c => c.id === id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
  }, [selectedCompanies, companiesWithData]);

  const barChartData = useMemo(() => {
    const colors = ['#e67e22', '#3498db', '#27ae60', '#9b59b6', '#e74c3c'];
    
    return {
      labels: selectedData.map(c => c!.name.substring(0, 20)),
      datasets: [{
        label: 'MM Indeksi',
        data: selectedData.map(c => c!.overallIndex),
        backgroundColor: selectedData.map((_, i) => colors[i % colors.length]),
        borderRadius: 8
      }]
    };
  }, [selectedData]);

  const radarChartData = useMemo(() => {
    const colors = [
      { bg: 'rgba(230, 126, 34, 0.2)', border: '#e67e22' },
      { bg: 'rgba(52, 152, 219, 0.2)', border: '#3498db' },
      { bg: 'rgba(39, 174, 96, 0.2)', border: '#27ae60' },
      { bg: 'rgba(155, 89, 182, 0.2)', border: '#9b59b6' },
      { bg: 'rgba(231, 76, 60, 0.2)', border: '#e74c3c' }
    ];

    const mainKpis = ['ltifr', 'trir', 'training', 'equipment', 'ppe', 'raCoverage'];
    
    return {
      labels: mainKpis.map(k => KPI_CONFIG[k]?.name || k),
      datasets: selectedData.map((company, index) => ({
        label: company!.name.substring(0, 15),
        data: mainKpis.map(k => company!.kpis[k as keyof typeof company.kpis]?.score || 0),
        backgroundColor: colors[index % colors.length].bg,
        borderColor: colors[index % colors.length].border,
        borderWidth: 2,
        pointBackgroundColor: colors[index % colors.length].border
      }))
    };
  }, [selectedData]);

  if (loading) {
    return <div className="loading-state"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="comparison-page">
      <div className="section-header">
        <h2>⚖️ Korxonalarni Taqqoslash</h2>
        <p className="helper-text">Taqqoslash uchun 2-5 ta korxonani tanlang</p>
      </div>

      <div className="comparison-layout">
        <div className="company-selector">
          <h3>Korxonalar ro'yxati</h3>
          <div className="company-list">
            {companiesWithData.map(company => (
              <div
                key={company.id}
                className={`company-item ${selectedCompanies.includes(company.id) ? 'selected' : ''}`}
                onClick={() => toggleCompany(company.id)}
              >
                <div className="company-checkbox">
                  {selectedCompanies.includes(company.id) && '✓'}
                </div>
                <div className="company-info">
                  <div className="company-name">{company.name}</div>
                  <div className="company-score">{company.overallIndex.toFixed(1)} ball</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="comparison-charts">
          {selectedData.length >= 2 ? (
            <>
              <div className="chart-container">
                <h3>📊 Umumiy Indeks Taqqoslash</h3>
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </div>

              <div className="chart-container">
                <h3>🎯 KPI Radar Taqqoslash</h3>
                <Radar
                  data={radarChartData}
                  options={{
                    responsive: true,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </div>

              <div className="comparison-table">
                <h3>📋 Batafsil Taqqoslash</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Ko'rsatkich</th>
                      {selectedData.map(c => (
                        <th key={c!.id}>{c!.name.substring(0, 15)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>MM Indeksi</strong></td>
                      {selectedData.map(c => (
                        <td key={c!.id} className="score-cell">{c!.overallIndex.toFixed(1)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td><strong>Xodimlar</strong></td>
                      {selectedData.map(c => (
                        <td key={c!.id}>{c!.employees.toLocaleString()}</td>
                      ))}
                    </tr>
                    {Object.entries(KPI_CONFIG).slice(0, 10).map(([key, config]) => (
                      <tr key={key}>
                        <td>{config.icon} {config.name}</td>
                        {selectedData.map(c => {
                          const kpi = c!.kpis[key as keyof typeof c.kpis];
                          const score = kpi?.score || 0;
                          return (
                            <td
                              key={c!.id}
                              className={score >= 80 ? 'score-green' : score >= 50 ? 'score-yellow' : 'score-red'}
                            >
                              {score}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-comparison">
              <div className="empty-icon">⚖️</div>
              <h3>Taqqoslash uchun korxonalarni tanlang</h3>
              <p>Chapdan kamida 2 ta korxonani tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
