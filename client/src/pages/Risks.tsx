import React, { useMemo, useState } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import { getZone } from '../utils/kpiCalculator';
import { RISK_PROFILES, KPI_CONFIG } from '../utils/kpiConfig';
import { ZoneBadge } from '../components/ZoneBadge';
import './Risks.css';

export function Risks() {
  const { companies, loading } = useCompanies();
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  const companiesWithData = useMemo(() => {
    return companies.filter(c => c.overallIndex > 0 || c.kpis?.ltifr?.score > 0);
  }, [companies]);

  const riskAnalysis = useMemo(() => {
    const analysis = companiesWithData.map(company => {
      const kpis = company.kpis;
      const criticalIssues: string[] = [];
      const warnings: string[] = [];

      if (kpis.ltifr?.score < 50) {
        criticalIssues.push('Baxtsiz hodisalar ko\'rsatkichi past');
      }
      if (kpis.trir?.score < 50) {
        criticalIssues.push('Jarohatlanish ko\'rsatkichi past');
      }
      if (kpis.ppe?.score < 70) {
        warnings.push('SHHV ta\'minoti yetarli emas');
      }
      if (kpis.training?.score < 80) {
        warnings.push('O\'qitish qamrovi yetarli emas');
      }
      if (kpis.equipment?.score < 70) {
        warnings.push('Uskuna nazorati yetarli emas');
      }

      return {
        ...company,
        criticalIssues,
        warnings,
        riskLevel: criticalIssues.length > 0 ? 'critical' : warnings.length > 0 ? 'warning' : 'normal'
      };
    });

    return analysis.sort((a, b) => {
      if (a.riskLevel === 'critical' && b.riskLevel !== 'critical') return -1;
      if (b.riskLevel === 'critical' && a.riskLevel !== 'critical') return 1;
      return b.warnings.length - a.warnings.length;
    });
  }, [companiesWithData]);

  const filteredCompanies = useMemo(() => {
    if (selectedRisk === 'all') return riskAnalysis;
    return riskAnalysis.filter(c => c.riskLevel === selectedRisk);
  }, [riskAnalysis, selectedRisk]);

  const stats = useMemo(() => ({
    critical: riskAnalysis.filter(c => c.riskLevel === 'critical').length,
    warning: riskAnalysis.filter(c => c.riskLevel === 'warning').length,
    normal: riskAnalysis.filter(c => c.riskLevel === 'normal').length
  }), [riskAnalysis]);

  if (loading) {
    return <div className="loading-state"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="risks-page">
      <div className="section-header">
        <h2>🎯 Xavflilik Tahlili</h2>
      </div>

      <div className="risk-stats">
        <div className="risk-stat critical" onClick={() => setSelectedRisk('critical')}>
          <div className="risk-stat-value">{stats.critical}</div>
          <div className="risk-stat-label">Kritik</div>
        </div>
        <div className="risk-stat warning" onClick={() => setSelectedRisk('warning')}>
          <div className="risk-stat-value">{stats.warning}</div>
          <div className="risk-stat-label">Ogohlantirish</div>
        </div>
        <div className="risk-stat normal" onClick={() => setSelectedRisk('normal')}>
          <div className="risk-stat-value">{stats.normal}</div>
          <div className="risk-stat-label">Normal</div>
        </div>
        <div className="risk-stat all" onClick={() => setSelectedRisk('all')}>
          <div className="risk-stat-value">{riskAnalysis.length}</div>
          <div className="risk-stat-label">Jami</div>
        </div>
      </div>

      <div className="risk-profiles-section">
        <h3>📊 Xavf Profillari</h3>
        <div className="risk-profiles-grid">
          {Object.entries(RISK_PROFILES).map(([key, profile]) => (
            <div key={key} className={`risk-profile-card ${key.toLowerCase()}`}>
              <h4>{profile.name}</h4>
              <p>{profile.description}</p>
              <div className="profile-requirements">
                <div><span>Min O'qitish:</span> {profile.minTraining}%</div>
                <div><span>Min Uskuna:</span> {profile.minEquipment}%</div>
                <div><span>Min SHHV:</span> {profile.minPPE}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="risk-table-container">
        <h3>🔍 Korxonalar Xavf Tahlili</h3>
        {filteredCompanies.length > 0 ? (
          <table className="risk-table">
            <thead>
              <tr>
                <th>Korxona</th>
                <th>MM Indeksi</th>
                <th>Zona</th>
                <th>Xavf Darajasi</th>
                <th>Muammolar</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(company => {
                const zone = getZone(company.overallIndex);
                return (
                  <tr key={company.id} className={`risk-row ${company.riskLevel}`}>
                    <td className="company-name">{company.name}</td>
                    <td className="score">{company.overallIndex.toFixed(1)}</td>
                    <td><ZoneBadge zone={zone} /></td>
                    <td>
                      <span className={`risk-badge ${company.riskLevel}`}>
                        {company.riskLevel === 'critical' ? '🔴 Kritik' :
                         company.riskLevel === 'warning' ? '🟡 Ogohlantirish' : '🟢 Normal'}
                      </span>
                    </td>
                    <td className="issues-cell">
                      {company.criticalIssues.map((issue, i) => (
                        <div key={i} className="issue critical">{issue}</div>
                      ))}
                      {company.warnings.map((warning, i) => (
                        <div key={i} className="issue warning">{warning}</div>
                      ))}
                      {company.criticalIssues.length === 0 && company.warnings.length === 0 && (
                        <span className="no-issues">Muammo topilmadi</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>Ma'lumot topilmadi</p>
          </div>
        )}
      </div>

      <div className="kpi-legend">
        <h3>📋 KPI Ko'rsatkichlar Ro'yxati</h3>
        <div className="kpi-grid">
          {Object.entries(KPI_CONFIG).map(([key, config]) => (
            <div key={key} className="kpi-card">
              <div className="kpi-icon">{config.icon}</div>
              <div className="kpi-info">
                <div className="kpi-name">{config.name}</div>
                <div className="kpi-weight">Vazn: {(config.weight * 100).toFixed(0)}%</div>
                {config.description && <div className="kpi-desc">{config.description}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
