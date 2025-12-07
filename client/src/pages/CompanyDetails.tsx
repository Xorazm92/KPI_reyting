
import React, { useMemo } from 'react';
import { useRoute, Link } from 'wouter';
import { useCompanies } from '../contexts/CompanyContext';
import { KPI_CONFIG } from '../utils/kpiConfig';
import { getZone } from '../utils/kpiCalculator';
import { ZoneBadge } from '../components/ZoneBadge';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import './CompanyDetails.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function CompanyDetails() {
  const [, params] = useRoute('/company/:id');
  const { companies } = useCompanies();
  
  const company = useMemo(() => {
    return companies.find(c => c.id === params?.id);
  }, [companies, params]);

  const radarData = useMemo(() => {
    if (!company) return null;

    const mainKpis = ['ltifr', 'trir', 'training', 'equipment', 'ppe', 'raCoverage', 'prevention', 'nearMiss'];
    
    return {
      labels: mainKpis.map(k => KPI_CONFIG[k]?.name || k),
      datasets: [{
        label: 'Joriy ball',
        data: mainKpis.map(k => company.kpis[k as keyof typeof company.kpis]?.score || 0),
        backgroundColor: 'rgba(245, 100, 0, 0.2)',
        borderColor: '#F56400',
        borderWidth: 2,
        pointBackgroundColor: '#F56400'
      }]
    };
  }, [company]);

  if (!company) {
    return (
      <div className="company-details">
        <div className="error-state">
          <h2>❌ Korxona topilmadi</h2>
          <Link href="/">
            <button className="btn-primary">Bosh sahifaga qaytish</button>
          </Link>
        </div>
      </div>
    );
  }

  const zone = getZone(company.overallIndex);

  return (
    <div className="company-details">
      <div className="details-header">
        <div className="header-left">
          <Link href="/">
            <button className="btn-back">← Orqaga</button>
          </Link>
          <div className="company-info">
            <h1>{company.name}</h1>
            <div className="company-meta">
              <span className="meta-item">👥 {company.employees.toLocaleString()} xodim</span>
              <span className="meta-item">🏢 {company.level}</span>
              <span className="meta-item">📊 {company.profile}</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="overall-score">
            <div className="score-label">MM Indeksi</div>
            <div className={`score-value score-${zone.name}`}>
              {company.overallIndex.toFixed(1)}
            </div>
            <ZoneBadge zone={zone} />
          </div>
          <Link href={`/edit/${company.id}`}>
            <button className="btn-edit">✏️ Tahrirlash</button>
          </Link>
        </div>
      </div>

      <div className="details-grid">
        <div className="radar-card">
          <h3>🎯 KPI Radar</h3>
          {radarData && (
            <Radar
              data={radarData}
              options={{
                responsive: true,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 20 }
                  }
                }
              }}
            />
          )}
        </div>

        <div className="kpi-summary-card">
          <h3>📊 Asosiy Ko'rsatkichlar</h3>
          <div className="kpi-summary-list">
            {Object.entries(KPI_CONFIG).slice(0, 8).map(([key, config]) => {
              const kpi = company.kpis[key as keyof typeof company.kpis];
              const score = kpi?.score || 0;
              const value = kpi?.value || 0;
              
              return (
                <div key={key} className="kpi-summary-item">
                  <div className="kpi-summary-icon">{config.icon}</div>
                  <div className="kpi-summary-info">
                    <div className="kpi-summary-name">{config.name}</div>
                    <div className="kpi-summary-value">
                      {config.lowerIsBetter ? value.toFixed(2) : value.toFixed(1)}
                    </div>
                  </div>
                  <div className={`kpi-summary-score ${score >= 80 ? 'green' : score >= 50 ? 'yellow' : 'red'}`}>
                    {score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="kpi-details-table">
        <h3>📋 Barcha KPI Ko'rsatkichlar</h3>
        <table>
          <thead>
            <tr>
              <th>Ko'rsatkich</th>
              <th>Qiymat</th>
              <th>Ball</th>
              <th>Vazn</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(KPI_CONFIG).map(([key, config]) => {
              const kpi = company.kpis[key as keyof typeof company.kpis];
              const score = kpi?.score || 0;
              const value = kpi?.value || 0;
              
              return (
                <tr key={key}>
                  <td>
                    <div className="kpi-name-cell">
                      <span className="kpi-icon">{config.icon}</span>
                      <span>{config.name}</span>
                    </div>
                  </td>
                  <td>{value.toFixed(2)}</td>
                  <td className={`score-cell ${score >= 80 ? 'green' : score >= 50 ? 'yellow' : 'red'}`}>
                    {score}
                  </td>
                  <td>{(config.weight * 100).toFixed(0)}%</td>
                  <td>
                    <span className={`status-badge ${score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger'}`}>
                      {score >= 80 ? '✓ Yaxshi' : score >= 50 ? '⚠ Qoniqarli' : '✗ Xavfli'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
