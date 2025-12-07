import React, { useMemo, useState } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { KPI_CONFIG } from '../utils/kpiConfig';
import './Statistics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

export function Statistics() {
  const { companies } = useCompanies();
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedKPI, setSelectedKPI] = useState<string>('ltifr');

  const zoneDistribution = useMemo(() => {
    const green = companies.filter(c => c.overallIndex >= 80).length;
    const yellow = companies.filter(c => c.overallIndex >= 50 && c.overallIndex < 80).length;
    const red = companies.filter(c => c.overallIndex < 50).length;

    return {
      labels: ['🟢 Yashil Zona', '🟡 Sariq Zona', '🔴 Qizil Zona'],
      datasets: [{
        data: [green, yellow, red],
        backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, [companies]);

  const avgKPIScores = useMemo(() => {
    const kpiKeys = Object.keys(KPI_CONFIG).slice(0, 8);
    const averages = kpiKeys.map(key => {
      const scores = companies.map(c => c.kpis[key]?.score || 0);
      return scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    return {
      labels: kpiKeys.map(k => KPI_CONFIG[k].name),
      datasets: [{
        label: "O'rtacha Ball",
        data: averages,
        backgroundColor: '#F56400',
        borderColor: '#d55700',
        borderWidth: 2
      }]
    };
  }, [companies]);

  const topCompanies = useMemo(() => {
    const sorted = [...companies].sort((a, b) => b.overallIndex - a.overallIndex).slice(0, 10);
    return {
      labels: sorted.map(c => c.name.slice(0, 20)),
      datasets: [{
        label: 'MM Indeksi',
        data: sorted.map(c => c.overallIndex),
        backgroundColor: sorted.map(c => c.overallIndex >= 80 ? '#27ae60' : c.overallIndex >= 50 ? '#f39c12' : '#e74c3c'),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, [companies]);

  const kpiTrend = useMemo(() => {
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun'];
    const avgScores = months.map(() => Math.random() * 30 + 60);

    return {
      labels: months,
      datasets: [{
        label: KPI_CONFIG[selectedKPI]?.name || 'KPI',
        data: avgScores,
        borderColor: '#F56400',
        backgroundColor: 'rgba(245, 100, 0, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }, [selectedKPI]);

  return (
    <div className="statistics">
      <div className="section-header">
        <h2>📊 Statistik Tahlil</h2>
        <div className="period-selector">
          {(['monthly', 'quarterly', 'yearly'] as const).map(p => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'monthly' ? '📅 Oylik' : p === 'quarterly' ? '📆 Choraklik' : '📈 Yillik'}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="chart-card">
          <h3>🎯 Zona Taqsimoti</h3>
          <div className="chart-wrapper">
            <Doughnut data={zoneDistribution} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card">
          <h3>📊 O'rtacha KPI Ballari</h3>
          <div className="chart-wrapper">
            <Bar 
              data={avgKPIScores} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 100 } }
              }} 
            />
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>🏆 Top 10 Korxonalar</h3>
          <div className="chart-wrapper">
            <Bar 
              data={topCompanies} 
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: { x: { beginAtZero: true, max: 100 } }
              }} 
            />
          </div>
        </div>

        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>📈 KPI Tendensiyasi</h3>
            <select value={selectedKPI} onChange={(e) => setSelectedKPI(e.target.value)} className="kpi-select">
              {Object.entries(KPI_CONFIG).slice(0, 8).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
          </div>
          <div className="chart-wrapper">
            <Line 
              data={kpiTrend} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 100 } }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}