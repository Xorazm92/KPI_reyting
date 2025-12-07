import React, { useMemo } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import { getZone } from '../utils/kpiCalculator';
import { KPI_CONFIG, DEPARTMENT_PROFILES } from '../utils/kpiConfig';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { StatCard } from '../components/StatCard';
import './Statistics.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function Statistics() {
  const { companies, loading } = useCompanies();

  const companiesWithData = useMemo(() => {
    return companies.filter(c => c.overallIndex > 0 || c.kpis?.ltifr?.score > 0);
  }, [companies]);

  const stats = useMemo(() => {
    const total = companiesWithData.length;
    const zones = {
      green: companiesWithData.filter(c => getZone(c.overallIndex).name === 'green').length,
      yellow: companiesWithData.filter(c => getZone(c.overallIndex).name === 'yellow').length,
      red: companiesWithData.filter(c => getZone(c.overallIndex).name === 'red').length
    };

    const avgScore = total > 0 
      ? companiesWithData.reduce((sum, c) => sum + c.overallIndex, 0) / total 
      : 0;

    const totalEmployees = companiesWithData.reduce((sum, c) => sum + c.employees, 0);

    const kpiAverages: Record<string, number> = {};
    Object.keys(KPI_CONFIG).forEach(key => {
      const scores = companiesWithData
        .map(c => c.kpis[key as keyof typeof c.kpis]?.score || 0)
        .filter(s => s > 0);
      kpiAverages[key] = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;
    });

    return { total, zones, avgScore, totalEmployees, kpiAverages };
  }, [companiesWithData]);

  const zoneChartData = {
    labels: ['Yashil zona', 'Sariq zona', 'Qizil zona'],
    datasets: [{
      data: [stats.zones.green, stats.zones.yellow, stats.zones.red],
      backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
      borderWidth: 0
    }]
  };

  const kpiBarData = useMemo(() => {
    const labels = Object.entries(KPI_CONFIG).slice(0, 10).map(([_, config]) => config.name.substring(0, 15));
    const data = Object.entries(KPI_CONFIG).slice(0, 10).map(([key]) => Math.round(stats.kpiAverages[key] || 0));
    const colors = data.map(v => v >= 80 ? '#27ae60' : v >= 50 ? '#f39c12' : '#e74c3c');

    return {
      labels,
      datasets: [{
        label: "O'rtacha ball",
        data,
        backgroundColor: colors,
        borderRadius: 6
      }]
    };
  }, [stats.kpiAverages]);

  const profileStats = useMemo(() => {
    return DEPARTMENT_PROFILES.map(profile => {
      const profileCompanies = companiesWithData.filter(c => c.profile === profile.id);
      const count = profileCompanies.length;
      const avgScore = count > 0 
        ? profileCompanies.reduce((sum, c) => sum + c.overallIndex, 0) / count 
        : 0;
      return { ...profile, count, avgScore };
    }).filter(p => p.count > 0);
  }, [companiesWithData]);

  if (loading) {
    return <div className="loading-state"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="statistics-page">
      <div className="section-header">
        <h2>📈 Statistika va Tahlil</h2>
      </div>

      <div className="stats-overview">
        <StatCard icon="🏭" value={stats.total} label="Jami korxonalar" />
        <StatCard icon="👥" value={stats.totalEmployees.toLocaleString()} label="Jami xodimlar" />
        <StatCard 
          icon="📊" 
          value={stats.avgScore.toFixed(1)} 
          label="O'rtacha MM Indeksi" 
          variant={stats.avgScore >= 80 ? 'green' : stats.avgScore >= 50 ? 'yellow' : 'red'}
        />
        <StatCard icon="🟢" value={stats.zones.green} label="Yashil zona" variant="green" />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>🎯 Zonalar Bo'yicha Taqsimot</h3>
          <div className="doughnut-wrapper">
            <Doughnut 
              data={zoneChartData} 
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
          <div className="zone-legend">
            <div className="legend-item green">
              <span className="legend-color"></span>
              <span>Yashil: {stats.zones.green} ({stats.total > 0 ? Math.round(stats.zones.green / stats.total * 100) : 0}%)</span>
            </div>
            <div className="legend-item yellow">
              <span className="legend-color"></span>
              <span>Sariq: {stats.zones.yellow} ({stats.total > 0 ? Math.round(stats.zones.yellow / stats.total * 100) : 0}%)</span>
            </div>
            <div className="legend-item red">
              <span className="legend-color"></span>
              <span>Qizil: {stats.zones.red} ({stats.total > 0 ? Math.round(stats.zones.red / stats.total * 100) : 0}%)</span>
            </div>
          </div>
        </div>

        <div className="chart-card wide">
          <h3>📊 KPI Ko'rsatkichlar Bo'yicha O'rtacha Ball</h3>
          <Bar 
            data={kpiBarData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                },
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {profileStats.length > 0 && (
        <div className="profile-stats">
          <h3>🏭 Profil Bo'yicha Statistika</h3>
          <div className="profile-cards">
            {profileStats.map(profile => (
              <div key={profile.id} className="profile-card">
                <div className="profile-icon">{profile.icon}</div>
                <div className="profile-info">
                  <div className="profile-name">{profile.name}</div>
                  <div className="profile-details">
                    <span>{profile.count} korxona</span>
                    <span className={`profile-score ${getZone(profile.avgScore).name}`}>
                      {profile.avgScore.toFixed(1)} ball
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="top-performers">
        <h3>🏆 Eng Yaxshi Korxonalar (Top 5)</h3>
        <div className="performers-list">
          {[...companiesWithData]
            .sort((a, b) => b.overallIndex - a.overallIndex)
            .slice(0, 5)
            .map((company, index) => (
              <div key={company.id} className="performer-item">
                <div className="performer-rank">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                </div>
                <div className="performer-info">
                  <div className="performer-name">{company.name}</div>
                  <div className="performer-employees">{company.employees.toLocaleString()} xodim</div>
                </div>
                <div className={`performer-score ${getZone(company.overallIndex).name}`}>
                  {company.overallIndex.toFixed(1)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
