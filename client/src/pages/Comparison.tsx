
import React, { useState, useMemo } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import { KPI_CONFIG } from '../utils/kpiConfig';
import { getZone } from '../utils/kpiCalculator';
import { ZoneBadge } from '../components/ZoneBadge';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import './Comparison.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function Comparison() {
  const { companies } = useCompanies();
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const availableCompanies = useMemo(() => {
    return companies.filter(c => c.overallIndex > 0);
  }, [companies]);

  const toggleCompany = (id: string) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter(cid => cid !== id));
    } else if (selectedCompanies.length < 4) {
      setSelectedCompanies([...selectedCompanies, id]);
    }
  };

  const comparisonData = useMemo(() => {
    if (selectedCompanies.length === 0) return null;

    const mainKpis = ['ltifr', 'trir', 'training', 'equipment', 'ppe', 'raCoverage'];
    const colors = ['#F56400', '#3498db', '#27ae60', '#9b59b6'];

    return {
      labels: mainKpis.map(k => KPI_CONFIG[k]?.name || k),
      datasets: selectedCompanies.map((companyId, index) => {
        const company = companies.find(c => c.id === companyId);
        if (!company) return null;

        return {
          label: company.name,
          data: mainKpis.map(k => company.kpis[k]?.score || 0),
          backgroundColor: `${colors[index]}33`,
          borderColor: colors[index],
          borderWidth: 2,
          pointBackgroundColor: colors[index]
        };
      }).filter(Boolean)
    };
  }, [selectedCompanies, companies]);

  const selectedCompaniesData = useMemo(() => {
    return selectedCompanies.map(id => companies.find(c => c.id === id)).filter(Boolean);
  }, [selectedCompanies, companies]);

  return (
    <div className="comparison">
      <div className="section-header">
        <h2>🔍 Korxonalarni Taqqoslash</h2>
        <div className="selection-info">
          {selectedCompanies.length}/4 tanlangan
        </div>
      </div>

      <div className="company-selector">
        <h3>Taqqoslash uchun korxonalarni tanlang (maksimum 4 ta)</h3>
        <div className="company-grid">
          {availableCompanies.map(company => {
            const zone = getZone(company.overallIndex);
            const isSelected = selectedCompanies.includes(company.id);

            return (
              <div
                key={company.id}
                className={`company-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleCompany(company.id)}
              >
                <div className="company-card-header">
                  <h4>{company.name}</h4>
                  {isSelected && <span className="check-mark">✓</span>}
                </div>
                <div className="company-card-body">
                  <div className="score-display">
                    <span className="score-label">MM Indeksi</span>
                    <span className={`score-value score-${zone.name}`}>
                      {company.overallIndex.toFixed(1)}
                    </span>
                  </div>
                  <ZoneBadge zone={zone} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCompaniesData.length > 0 && (
        <>
          <div className="comparison-radar">
            <h3>📊 KPI Radar Taqqoslash</h3>
            {comparisonData && (
              <div className="radar-wrapper">
                <Radar
                  data={comparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { stepSize: 20 }
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="comparison-table">
            <h3>📋 Batafsil Taqqoslash</h3>
            <table>
              <thead>
                <tr>
                  <th>Ko'rsatkich</th>
                  {selectedCompaniesData.map(company => (
                    <th key={company.id}>{company.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="overall-row">
                  <td><strong>MM Indeksi</strong></td>
                  {selectedCompaniesData.map(company => (
                    <td key={company.id}>
                      <span className={`score-badge score-${getZone(company.overallIndex).name}`}>
                        {company.overallIndex.toFixed(1)}
                      </span>
                    </td>
                  ))}
                </tr>
                {Object.entries(KPI_CONFIG).slice(0, 10).map(([key, config]) => (
                  <tr key={key}>
                    <td>
                      <span className="kpi-icon">{config.icon}</span>
                      {config.name}
                    </td>
                    {selectedCompaniesData.map(company => {
                      const score = company.kpis[key]?.score || 0;
                      return (
                        <td key={company.id}>
                          <span className={`score-cell ${score >= 80 ? 'green' : score >= 50 ? 'yellow' : 'red'}`}>
                            {score}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedCompaniesData.length === 0 && (
        <div className="empty-comparison">
          <div className="empty-icon">🔍</div>
          <h3>Taqqoslash uchun korxonalarni tanlang</h3>
          <p>Yuqoridagi ro'yxatdan eng ko'pi bilan 4 ta korxonani tanlang</p>
        </div>
      )}
    </div>
  );
}
