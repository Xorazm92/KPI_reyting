import React, { useMemo } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import { Link } from 'wouter';
import { getZone } from '../utils/kpiCalculator';
import './Risks.css';

export function Risks() {
  const { companies } = useCompanies();

  const riskAnalysis = useMemo(() => {
    const highRisk = companies.filter(c => c.overallIndex < 50);
    const mediumRisk = companies.filter(c => c.overallIndex >= 50 && c.overallIndex < 80);
    const lowRisk = companies.filter(c => c.overallIndex >= 80);

    const criticalKPIs = highRisk.flatMap(company => {
      return Object.entries(company.kpis)
        .filter(([_, kpi]) => kpi.score < 50)
        .map(([key, kpi]) => ({
          companyId: company.id,
          companyName: company.name,
          kpiKey: key,
          score: kpi.score
        }));
    });

    return { highRisk, mediumRisk, lowRisk, criticalKPIs };
  }, [companies]);

  return (
    <div className="risks">
      <div className="section-header">
        <h2>⚠️ Xavf Tahlili</h2>
      </div>

      <div className="risk-summary">
        <div className="risk-card high">
          <div className="risk-icon">🔴</div>
          <div className="risk-info">
            <h3>{riskAnalysis.highRisk.length}</h3>
            <p>Yuqori Xavf</p>
          </div>
        </div>
        <div className="risk-card medium">
          <div className="risk-icon">🟡</div>
          <div className="risk-info">
            <h3>{riskAnalysis.mediumRisk.length}</h3>
            <p>O'rtacha Xavf</p>
          </div>
        </div>
        <div className="risk-card low">
          <div className="risk-icon">🟢</div>
          <div className="risk-info">
            <h3>{riskAnalysis.lowRisk.length}</h3>
            <p>Past Xavf</p>
          </div>
        </div>
      </div>

      {riskAnalysis.highRisk.length > 0 && (
        <div className="risk-section">
          <h3>🚨 Yuqori Xavfli Korxonalar</h3>
          <div className="company-list">
            {riskAnalysis.highRisk.map(company => {
              const zone = getZone(company.overallIndex);
              return (
                <div key={company.id} className="company-risk-card">
                  <div className="company-header">
                    <h4>{company.name}</h4>
                    <span className={`score-badge score-${zone.name}`}>
                      {company.overallIndex.toFixed(1)}
                    </span>
                  </div>
                  <div className="company-meta">
                    <span>👥 {company.employees.toLocaleString()} xodim</span>
                    <span>📊 {company.profile}</span>
                  </div>
                  <Link href={`/company/${company.id}`}>
                    <button className="action-btn">Batafsil ko'rish</button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {riskAnalysis.criticalKPIs.length > 0 && (
        <div className="risk-section">
          <h3>⚡ Kritik KPI'lar (50 balldan past)</h3>
          <table className="critical-table">
            <thead>
              <tr>
                <th>Korxona</th>
                <th>KPI</th>
                <th>Ball</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {riskAnalysis.criticalKPIs.slice(0, 20).map((item, index) => (
                <tr key={index}>
                  <td>{item.companyName}</td>
                  <td>{item.kpiKey.toUpperCase()}</td>
                  <td>
                    <span className="score-cell red">{item.score}</span>
                  </td>
                  <td>
                    <Link href={`/company/${item.companyId}`}>
                      <button className="action-btn small">Ko'rish</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}