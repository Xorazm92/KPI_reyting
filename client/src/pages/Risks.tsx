
import React, { useMemo } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import { Link } from 'wouter';
import { getZone } from '../utils/kpiCalculator';
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
  Button,
  Avatar
} from '@mui/material';
import { 
  Warning, 
  CheckCircle, 
  Error,
  Visibility,
  TrendingDown,
  Shield
} from '@mui/icons-material';
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
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Shield sx={{ fontSize: 40 }} />
          Xavf Tahlili
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
          Korxonalar xavflilik darajasi bo'yicha tahlil
        </Typography>
      </Paper>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              borderRadius: 3, 
              borderLeft: '6px solid #e74c3c',
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#e74c3c', width: 60, height: 60 }}>
                  <Error sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={700} color="#e74c3c">
                    {riskAnalysis.highRisk.length}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Yuqori Xavf
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              borderRadius: 3, 
              borderLeft: '6px solid #f39c12',
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#f39c12', width: 60, height: 60 }}>
                  <Warning sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={700} color="#f39c12">
                    {riskAnalysis.mediumRisk.length}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    O'rtacha Xavf
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              borderRadius: 3, 
              borderLeft: '6px solid #27ae60',
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#27ae60', width: 60, height: 60 }}>
                  <CheckCircle sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={700} color="#27ae60">
                    {riskAnalysis.lowRisk.length}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Past Xavf
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {riskAnalysis.highRisk.length > 0 && (
        <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingDown sx={{ color: '#e74c3c' }} />
              Yuqori Xavfli Korxonalar
            </Typography>
            <Grid container spacing={2}>
              {riskAnalysis.highRisk.map(company => {
                const zone = getZone(company.overallIndex);
                return (
                  <Grid item xs={12} sm={6} md={4} key={company.id}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        borderRadius: 2,
                        border: '2px solid #e74c3c',
                        transition: 'all 0.3s',
                        '&:hover': { boxShadow: 4, borderColor: '#c0392b' }
                      }}
                    >
                      <CardContent>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={600} noWrap>
                              {company.name}
                            </Typography>
                            <Chip 
                              label={company.overallIndex.toFixed(1)} 
                              size="small"
                              sx={{ 
                                bgcolor: '#f8d7da', 
                                color: '#e74c3c',
                                fontWeight: 700
                              }} 
                            />
                          </Stack>
                          <Stack direction="row" spacing={1}>
                            <Chip label={`👥 ${company.employees.toLocaleString()}`} size="small" variant="outlined" />
                            <Chip label={company.profile} size="small" variant="outlined" />
                          </Stack>
                          <Link href={`/company/${company.id}`} style={{ textDecoration: 'none' }}>
                            <Button 
                              fullWidth 
                              variant="contained" 
                              startIcon={<Visibility />}
                              sx={{ 
                                bgcolor: '#F56400',
                                '&:hover': { bgcolor: '#d55700' }
                              }}
                            >
                              Batafsil
                            </Button>
                          </Link>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {riskAnalysis.criticalKPIs.length > 0 && (
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Error sx={{ color: '#e74c3c' }} />
              Kritik KPI'lar (50 balldan past)
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Korxona</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>KPI</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ball</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amallar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {riskAnalysis.criticalKPIs.slice(0, 20).map((item, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:hover': { bgcolor: '#f8f9fa' },
                        transition: 'all 0.2s'
                      }}
                    >
                      <TableCell>{item.companyName}</TableCell>
                      <TableCell>
                        <Chip label={item.kpiKey.toUpperCase()} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.score} 
                          size="small"
                          sx={{ bgcolor: '#f8d7da', color: '#e74c3c', fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/company/${item.companyId}`} style={{ textDecoration: 'none' }}>
                          <Button 
                            size="small" 
                            variant="outlined"
                            startIcon={<Visibility />}
                            sx={{ 
                              borderColor: '#F56400',
                              color: '#F56400',
                              '&:hover': { bgcolor: '#fff5f0', borderColor: '#d55700' }
                            }}
                          >
                            Ko'rish
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
