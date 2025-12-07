
import React, { useMemo, useState } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { KPI_CONFIG } from '../utils/kpiConfig';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Chip,
  Stack
} from '@mui/material';
import { 
  CalendarMonth, 
  DateRange, 
  TrendingUp,
  Assessment,
  DonutLarge,
  BarChart,
  EmojiEvents
} from '@mui/icons-material';
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
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(241, 196, 15, 0.8)',
          'rgba(231, 76, 60, 0.8)'
        ],
        borderWidth: 0,
        hoverOffset: 10
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
        backgroundColor: 'rgba(245, 100, 0, 0.7)',
        borderColor: '#F56400',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(245, 100, 0, 0.9)'
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
        backgroundColor: sorted.map(c => 
          c.overallIndex >= 80 ? 'rgba(46, 204, 113, 0.7)' : 
          c.overallIndex >= 50 ? 'rgba(241, 196, 15, 0.7)' : 
          'rgba(231, 76, 60, 0.7)'
        ),
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 6
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
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#F56400',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    };
  }, [selectedKPI]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: { size: 12, weight: '600' }
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment sx={{ fontSize: 40 }} />
              Statistik Tahlil
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {companies.length} ta korxona ma'lumotlari
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(e, val) => val && setPeriod(val)}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}
          >
            <ToggleButton value="monthly" sx={{ color: '#fff', '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
              <CalendarMonth sx={{ mr: 1 }} /> Oylik
            </ToggleButton>
            <ToggleButton value="quarterly" sx={{ color: '#fff', '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
              <DateRange sx={{ mr: 1 }} /> Choraklik
            </ToggleButton>
            <ToggleButton value="yearly" sx={{ color: '#fff', '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
              <TrendingUp sx={{ mr: 1 }} /> Yillik
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <DonutLarge sx={{ color: '#F56400', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  Zona Taqsimoti
                </Typography>
              </Stack>
              <Box sx={{ height: 320, position: 'relative' }}>
                <Doughnut data={zoneDistribution} options={chartOptions} />
              </Box>
              <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
                <Chip label={`🟢 ${zoneDistribution.datasets[0].data[0]} ta`} color="success" />
                <Chip label={`🟡 ${zoneDistribution.datasets[0].data[1]} ta`} sx={{ bgcolor: '#f39c12', color: '#fff' }} />
                <Chip label={`🔴 ${zoneDistribution.datasets[0].data[2]} ta`} color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <BarChart sx={{ color: '#F56400', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  O'rtacha KPI Ballari
                </Typography>
              </Stack>
              <Box sx={{ height: 320 }}>
                <Bar 
                  data={avgKPIScores} 
                  options={{
                    ...chartOptions,
                    scales: { 
                      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
                      x: { grid: { display: false } }
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <EmojiEvents sx={{ color: '#F56400', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  Top 10 Korxonalar
                </Typography>
              </Stack>
              <Box sx={{ height: 400 }}>
                <Bar 
                  data={topCompanies} 
                  options={{
                    indexAxis: 'y',
                    ...chartOptions,
                    scales: { 
                      x: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
                      y: { grid: { display: false } }
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TrendingUp sx={{ color: '#F56400', fontSize: 28 }} />
                  <Typography variant="h6" fontWeight={700}>
                    KPI Tendensiyasi
                  </Typography>
                </Stack>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>KPI tanlash</InputLabel>
                  <Select 
                    value={selectedKPI} 
                    onChange={(e) => setSelectedKPI(e.target.value)}
                    label="KPI tanlash"
                  >
                    {Object.entries(KPI_CONFIG).slice(0, 8).map(([key, config]) => (
                      <MenuItem key={key} value={key}>
                        {config.icon} {config.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Box sx={{ height: 350 }}>
                <Line 
                  data={kpiTrend} 
                  options={{
                    ...chartOptions,
                    scales: { 
                      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
                      x: { grid: { display: false } }
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
