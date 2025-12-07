import React, { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useCompanies } from '../contexts/CompanyContext';
import { StatCard } from '../components/StatCard';
import { ZoneBadge } from '../components/ZoneBadge';
import { getZone } from '../utils/kpiCalculator';
import { Company } from '../types';
import './Dashboard.css';

export function Dashboard() {
  const { companies, loading } = useCompanies();
  const [filter, setFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
  const [selectedParent, setSelectedParent] = useState<string>('all');

  const companiesWithData = useMemo(() => {
    return companies.filter(c => c.overallIndex > 0 || c.kpis?.ltifr?.score > 0);
  }, [companies]);

  const stats = useMemo(() => {
    const filtered = selectedParent === 'all' 
      ? companiesWithData 
      : companiesWithData.filter(c => c.supervisorId === selectedParent || c.id === selectedParent);
    
    return {
      total: filtered.length,
      green: filtered.filter(c => getZone(c.overallIndex).name === 'green').length,
      yellow: filtered.filter(c => getZone(c.overallIndex).name === 'yellow').length,
      red: filtered.filter(c => getZone(c.overallIndex).name === 'red').length
    };
  }, [companiesWithData, selectedParent]);

  const sortedCompanies = useMemo(() => {
    let filtered = selectedParent === 'all'
      ? companiesWithData
      : companiesWithData.filter(c => c.supervisorId === selectedParent || c.id === selectedParent);

    if (filter !== 'all') {
      filtered = filtered.filter(c => getZone(c.overallIndex).name === filter);
    }

    return [...filtered].sort((a, b) => b.overallIndex - a.overallIndex);
  }, [companiesWithData, filter, selectedParent]);

  const topThree = useMemo(() => sortedCompanies.slice(0, 3), [sortedCompanies]);

  const parentOrganizations = useMemo(() => {
    return companies.filter(c => c.level === 'management' || c.level === 'supervisor');
  }, [companies]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="section-header">
        <h2>🏆 Korxonalar Reytingi</h2>
        <div className="header-actions">
          <select 
            className="filter-select"
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
          >
            <option value="all">Barcha korxonalar</option>
            {parentOrganizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="🏭" value={stats.total} label="Jami korxonalar" />
        <StatCard icon="🟢" value={stats.green} label="Yashil zona" variant="green" />
        <StatCard icon="🟡" value={stats.yellow} label="Sariq zona" variant="yellow" />
        <StatCard icon="🔴" value={stats.red} label="Qizil zona" variant="red" />
      </div>

      {topThree.length >= 3 && (
        <div className="podium-section">
          <h3>🏆 Top 3 Korxonalar</h3>
          <div className="podium">
            <div className="podium-item second">
              <div className="podium-rank">🥈</div>
              <div className="podium-name">{topThree[1]?.name}</div>
              <div className="podium-score">{topThree[1]?.overallIndex.toFixed(1)}</div>
            </div>
            <div className="podium-item first">
              <div className="podium-rank">🥇</div>
              <div className="podium-name">{topThree[0]?.name}</div>
              <div className="podium-score">{topThree[0]?.overallIndex.toFixed(1)}</div>
            </div>
            <div className="podium-item third">
              <div className="podium-rank">🥉</div>
              <div className="podium-name">{topThree[2]?.name}</div>
              <div className="podium-score">{topThree[2]?.overallIndex.toFixed(1)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="filter-tabs">
        {(['all', 'green', 'yellow', 'red'] as const).map(f => (
          <button 
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Barchasi' : f === 'green' ? '🟢 Yashil' : f === 'yellow' ? '🟡 Sariq' : '🔴 Qizil'}
          </button>
        ))}
      </div>

      <div className="ranking-table-container">
        {sortedCompanies.length > 0 ? (
          <table className="ranking-table">
            <thead>
              <tr>
                <th>Reyting</th>
                <th>Korxona</th>
                <th>Xodimlar</th>
                <th>MM Indeksi</th>
                <th>Zona</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.map((company, index) => {
                const zone = getZone(company.overallIndex);
                return (
                  <tr key={company.id}>
                    <td className="rank-cell">
                      {index < 3 ? (
                        <span className={`rank-badge rank-${index + 1}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className="rank-number">{index + 1}</span>
                      )}
                    </td>
                    <td className="company-cell">
                      <div className="company-name">{company.name}</div>
                      <div className="company-meta">
                        <span className="company-level">{company.level}</span>
                        <span className="company-profile">{company.profile}</span>
                      </div>
                    </td>
                    <td>
                      <div className="employees-cell">
                        <span className="employees-count">{company.employees.toLocaleString()}</span>
                        <span className="employees-label">xodim</span>
                      </div>
                    </td>
                    <td className="score-cell">
                      <div className={`score-value score-${zone.name}`}>
                        {company.overallIndex.toFixed(1)}
                      </div>
                    </td>
                    <td>
                      <ZoneBadge zone={zone} />
                    </td>
                    <td>
                      <Link href={`/company/${company.id}`}>
                        <button className="action-btn view">Ko'rish</button>
                      </Link>
                      <Link href={`/edit/${company.id}`}>
                        <button className="action-btn edit">Tahrirlash</button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Hali korxonalar qo'shilmagan</h3>
            <p>Yangi korxona qo'shish uchun yuqoridagi "Korxona Qo'shish" tugmasini bosing</p>
          </div>
        )}
      </div>
    </div>
  );
}
