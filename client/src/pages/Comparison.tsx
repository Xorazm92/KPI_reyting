
import React, { useState, useMemo } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import { KPI_CONFIG } from '../utils/kpiConfig';
import { getZone } from '../utils/kpiCalculator';
import { ZoneBadge } from '../components/ZoneBadge';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar
} from '@mui/material';
import { CompareArrows, Radar as RadarIcon, TableChart, CheckCircle } from '@mui/icons-material';
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
          borderWidth: 3,
          pointBackgroundColor: colors[index],
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        };
      }).filter(Boolean)
    };
  }, [selectedCompanies, companies]);

  const selectedCompaniesData = useMemo(() => {
    return selectedCompanies.map(id => companies.find(c => c.id === id)).filter(Boolean);
  }, [selectedCompanies, companies]);

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CompareArrows sx={{ fontSize: 40 }} />
              Korxonalarni Taqqoslash
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
              Maksimum 4 ta korxonani tanlang
            </Typography>
          </Box>
          <Chip 
            label={`${selectedCompanies.length}/4 tanlangan`}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.3)', 
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              px: 2,
              py: 3
            }}
          />
        </Stack>
      </Paper>

      <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Taqqoslash uchun korxonalarni tanlang
          </Typography>
          <Grid container spacing={2}>
            {availableCompanies.map(company => {
              const zone = getZone(company.overallIndex);
              const isSelected = selectedCompanies.includes(company.id);

              return (
                <Grid item xs={12} sm={6} md={3} key={company.id}>
                  <Card
                    elevation={isSelected ? 4 : 1}
                    sx={{
                      borderRadius: 2,
                      border: isSelected ? '3px solid #F56400' : '2px solid #e0e0e0',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      bgcolor: isSelected ? '#fff5f0' : '#fff',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => toggleCompany(company.id)}
                  >
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" fontWeight={600} noWrap>
                            {company.name}
                          </Typography>
                          {isSelected && (
                            <Avatar sx={{ bgcolor: '#27ae60', width: 24, height: 24 }}>
                              <CheckCircle sx={{ fontSize: 16 }} />
                            </Avatar>
                          )}
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            MM Indeksi
                          </Typography>
                          <Chip
                            label={company.overallIndex.toFixed(1)}
                            size="small"
                            sx={{
                              bgcolor: zone.name === 'green' ? '#d4edda' : zone.name === 'yellow' ? '#fff3cd' : '#f8d7da',
                              color: zone.name === 'green' ? '#27ae60' : zone.name === 'yellow' ? '#f39c12' : '#e74c3c',
                              fontWeight: 700
                            }}
                          />
                        </Stack>
                        <ZoneBadge zone={zone} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {selectedCompaniesData.length > 0 && (
        <>
          <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <RadarIcon sx={{ color: '#F56400', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  KPI Radar Taqqoslash
                </Typography>
              </Stack>
              {comparisonData && (
                <Box sx={{ height: 450, position: 'relative' }}>
                  <Radar
                    data={comparisonData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          ticks: { stepSize: 20, backdropColor: 'transparent' },
                          grid: { color: 'rgba(0,0,0,0.1)' }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { padding: 15, font: { size: 12, weight: '600' } }
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <TableChart sx={{ color: '#F56400', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  Batafsil Taqqoslash
                </Typography>
              </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Ko'rsatkich</TableCell>
                      {selectedCompaniesData.map(company => (
                        <TableCell key={company.id} sx={{ fontWeight: 700 }}>
                          {company.name}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ bgcolor: '#fff5f0' }}>
                      <TableCell sx={{ fontWeight: 700 }}>MM Indeksi</TableCell>
                      {selectedCompaniesData.map(company => (
                        <TableCell key={company.id}>
                          <Chip
                            label={company.overallIndex.toFixed(1)}
                            sx={{
                              bgcolor: getZone(company.overallIndex).name === 'green' ? '#d4edda' : getZone(company.overallIndex).name === 'yellow' ? '#fff3cd' : '#f8d7da',
                              color: getZone(company.overallIndex).name === 'green' ? '#27ae60' : getZone(company.overallIndex).name === 'yellow' ? '#f39c12' : '#e74c3c',
                              fontWeight: 700
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                    {Object.entries(KPI_CONFIG).slice(0, 10).map(([key, config]) => (
                      <TableRow key={key} sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <span>{config.icon}</span>
                            <Typography variant="body2">{config.name}</Typography>
                          </Stack>
                        </TableCell>
                        {selectedCompaniesData.map(company => {
                          const score = company.kpis[key]?.score || 0;
                          return (
                            <TableCell key={company.id}>
                              <Chip
                                label={score}
                                size="small"
                                sx={{
                                  bgcolor: score >= 80 ? '#d4edda' : score >= 50 ? '#fff3cd' : '#f8d7da',
                                  color: score >= 80 ? '#27ae60' : score >= 50 ? '#f39c12' : '#e74c3c',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}

      {selectedCompaniesData.length === 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            borderRadius: 3, 
            textAlign: 'center',
            bgcolor: '#fafafa'
          }}
        >
          <Avatar sx={{ bgcolor: '#F56400', width: 80, height: 80, mx: 'auto', mb: 2 }}>
            <CompareArrows sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Taqqoslash uchun korxonalarni tanlang
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Yuqoridagi ro'yxatdan eng ko'pi bilan 4 ta korxonani tanlang
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
