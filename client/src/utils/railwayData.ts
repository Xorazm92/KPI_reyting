import { Company } from '../types';
import { getEmptyKPIs } from './kpiCalculator';

export const UZ_RAILWAY_DATA: Company[] = [
  {
    id: 'aj_head',
    name: "O'zbekiston Temir Yo'llari AJ",
    level: 'management',
    supervisorId: null,
    riskGroup: 'low',
    employees: 500,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'infra_aj',
    name: "\"Temiryo'linfratuzilma\" AJ",
    level: 'supervisor',
    supervisorId: 'aj_head',
    riskGroup: 'high',
    employees: 15000,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'yolovchi_aj',
    name: "\"O'ztemiryo'lyo'lovchi\" AJ",
    level: 'supervisor',
    supervisorId: 'aj_head',
    riskGroup: 'medium',
    employees: 5000,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'kargo_aj',
    name: "\"O'ztemiryo'lkargo\" AJ",
    level: 'supervisor',
    supervisorId: 'aj_head',
    riskGroup: 'medium',
    employees: 3000,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'quyuv_mex',
    name: "\"Quyuv mexanika zavodi\" AJ",
    level: 'subsidiary',
    supervisorId: 'aj_head',
    riskGroup: 'high',
    employees: 1200,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'toshkent_mtu',
    name: "Toshkent MTU",
    level: 'supervisor',
    supervisorId: 'infra_aj',
    riskGroup: 'high',
    employees: 3500,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'qoqon_mtu',
    name: "Qo'qon MTU",
    level: 'supervisor',
    supervisorId: 'infra_aj',
    riskGroup: 'high',
    employees: 2800,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'buxoro_mtu',
    name: "Buxoro MTU",
    level: 'supervisor',
    supervisorId: 'infra_aj',
    riskGroup: 'high',
    employees: 3100,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'qongirot_mtu',
    name: "Qo'ng'irot MTU",
    level: 'supervisor',
    supervisorId: 'infra_aj',
    riskGroup: 'high',
    employees: 2200,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'qarshi_mtu',
    name: "Qarshi MTU",
    level: 'supervisor',
    supervisorId: 'infra_aj',
    riskGroup: 'high',
    employees: 2500,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'termiz_mtu',
    name: "Termiz MTU",
    level: 'supervisor',
    supervisorId: 'infra_aj',
    riskGroup: 'high',
    employees: 1800,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'salor_masofa',
    name: "Salor temir yo'l masofasi",
    level: 'subsidiary',
    supervisorId: 'toshkent_mtu',
    riskGroup: 'high',
    employees: 150,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'toshkent_masofa',
    name: "Toshkent temir yo'l masofasi",
    level: 'subsidiary',
    supervisorId: 'toshkent_mtu',
    riskGroup: 'high',
    employees: 200,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'xovos_masofa',
    name: "Xovos temir yo'l masofasi",
    level: 'subsidiary',
    supervisorId: 'toshkent_mtu',
    riskGroup: 'high',
    employees: 180,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'toshkent_elektr',
    name: "Toshkent elektr ta'minoti",
    level: 'subsidiary',
    supervisorId: 'toshkent_mtu',
    riskGroup: 'high',
    employees: 120,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'qoqon_depo',
    name: "Qo'qon lokomotiv deposi",
    level: 'subsidiary',
    supervisorId: 'qoqon_mtu',
    riskGroup: 'high',
    employees: 450,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'andijon_depo',
    name: "Andijon lokomotiv deposi",
    level: 'subsidiary',
    supervisorId: 'qoqon_mtu',
    riskGroup: 'high',
    employees: 300,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'qoqon_masofa',
    name: "Qo'qon temir yo'l masofasi",
    level: 'subsidiary',
    supervisorId: 'qoqon_mtu',
    riskGroup: 'high',
    employees: 220,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'buxoro_depo',
    name: "Buxoro lokomotiv deposi",
    level: 'subsidiary',
    supervisorId: 'buxoro_mtu',
    riskGroup: 'high',
    employees: 380,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'tinchlik_depo',
    name: "Tinchlik lokomotiv deposi",
    level: 'subsidiary',
    supervisorId: 'buxoro_mtu',
    riskGroup: 'high',
    employees: 250,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'vokzallar',
    name: "\"Temiryo'lvokzallari\" MChJ",
    level: 'subsidiary',
    supervisorId: 'yolovchi_aj',
    riskGroup: 'medium',
    employees: 800,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'shahar_atrofi',
    name: "\"Shahar atrofida yo'lovchi tashish\" MChJ",
    level: 'subsidiary',
    supervisorId: 'yolovchi_aj',
    riskGroup: 'medium',
    employees: 400,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'vagon_tamir',
    name: "\"O'zvagonta'mir\" AJ",
    level: 'subsidiary',
    supervisorId: 'aj_head',
    riskGroup: 'high',
    employees: 600,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'konteyner',
    name: "\"O'ztemiryo'lkontener\" AJ",
    level: 'subsidiary',
    supervisorId: 'aj_head',
    riskGroup: 'medium',
    employees: 350,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  },
  {
    id: 'energiya_poezd',
    name: "1-son Energiyamontaj poezdi",
    level: 'supervisor',
    supervisorId: 'aj_head',
    riskGroup: 'high',
    employees: 280,
    overallIndex: 0,
    profile: 'electric',
    kpis: getEmptyKPIs()
  },
  {
    id: 'tashkent_vagon_zavod',
    name: "Toshkent yo'lovchi vagonlarni ta'minlash zavodi",
    level: 'supervisor',
    supervisorId: 'aj_head',
    riskGroup: 'high',
    employees: 520,
    overallIndex: 0,
    kpis: getEmptyKPIs()
  }
];
