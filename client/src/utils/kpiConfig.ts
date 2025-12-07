import { KPIConfig, RiskProfile, DepartmentProfile } from '../types';

export const KPI_CONFIG: Record<string, KPIConfig> = {
  ltifr: {
    name: "Baxtsiz hodisalar (LTIFR)",
    weight: 0.40,
    lowerIsBetter: true,
    critical: true,
    icon: "⚠️",
    description: "Lost Time Injury Frequency Rate"
  },
  trir: {
    name: "TRIR / Mikro-jarohatlar",
    weight: 0.10,
    lowerIsBetter: true,
    critical: true,
    icon: "🩹",
    description: "Total Recordable Incident Rate"
  },
  noincident: {
    name: "Bexavfsiz kunlar",
    weight: 0.06,
    lowerIsBetter: false,
    icon: "📅"
  },
  training: {
    name: "O'qitish qamrovi",
    weight: 0.05,
    lowerIsBetter: false,
    icon: "📚"
  },
  equipment: {
    name: "Uskuna nazorati",
    weight: 0.06,
    lowerIsBetter: false,
    icon: "🔧",
    description: "Rolling stock va uskunalar"
  },
  ppe: {
    name: "SHHV ta'minoti",
    weight: 0.05,
    lowerIsBetter: false,
    icon: "🦺"
  },
  raCoverage: {
    name: "Xavfni baholash",
    weight: 0.05,
    lowerIsBetter: false,
    icon: "🎯"
  },
  prevention: {
    name: "Profilaktika xarajatlari",
    weight: 0.04,
    lowerIsBetter: false,
    icon: "💰",
    description: "CAPEX/OPEX ratio"
  },
  nearMiss: {
    name: "Xabarlar (Near Miss)",
    weight: 0.04,
    lowerIsBetter: false,
    icon: "📢",
    description: "Safety Culture indicator"
  },
  responseTime: {
    name: "Murojaatga reaksiya",
    weight: 0.04,
    lowerIsBetter: false,
    icon: "⏱️"
  },
  inspection: {
    name: "Nazorat rejasi",
    weight: 0.03,
    lowerIsBetter: false,
    icon: "📋"
  },
  occupational: {
    name: "Kasbiy kasalliklar",
    weight: 0.02,
    lowerIsBetter: true,
    icon: "🏥"
  },
  compliance: {
    name: "Audit samaradorligi",
    weight: 0.02,
    lowerIsBetter: false,
    icon: "✅"
  },
  emergency: {
    name: "Avariya mashqlari",
    weight: 0.02,
    lowerIsBetter: false,
    icon: "🚨"
  },
  violations: {
    name: "Intizomiy buzilishlar",
    weight: 0.02,
    lowerIsBetter: true,
    icon: "🎫"
  },
  workStopInternal: {
    name: "Ichki nazorat tomonidan ish to'xtatish",
    weight: 0.03,
    lowerIsBetter: false,
    icon: "🛑",
    description: "Proaktiv xavfsizlik chorasi - ijobiy"
  },
  workStopExternal: {
    name: "Tashqi nazorat tomonidan ish to'xtatish",
    weight: 0.03,
    lowerIsBetter: true,
    icon: "🚫",
    description: "Jiddiy kamchilik - salbiy"
  },
  insurancePayments: {
    name: "Sug'urta to'lovlari",
    weight: 0.02,
    lowerIsBetter: true,
    icon: "💳",
    description: "Kompensatsiya to'lovlari"
  }
};

export const RISK_PROFILES: Record<string, RiskProfile> = {
  'HIGH': {
    name: 'Juda Yuqori Xavf',
    coefficient: 1.0,
    minLTIFR: 15,
    minTRIR: 8,
    penaltyMultiplier: 1.5,
    minTraining: 95,
    minEquipment: 90,
    minPPE: 95,
    minRACoverage: 85,
    description: "Lokomotiv, Vagon, Yo'l - Juda yuqori xavf"
  },
  'MEDIUM': {
    name: "O'rtacha Xavf",
    coefficient: 0.7,
    minLTIFR: 8,
    minTRIR: 5,
    penaltyMultiplier: 1.2,
    minTraining: 85,
    minEquipment: 80,
    minPPE: 85,
    minRACoverage: 75,
    description: "Elektr, Harakatni Boshqarish"
  },
  'LOW': {
    name: 'Past Xavf',
    coefficient: 0.4,
    minLTIFR: 3,
    minTRIR: 2,
    penaltyMultiplier: 1.0,
    minTraining: 70,
    minEquipment: 60,
    minPPE: 70,
    minRACoverage: 60,
    description: "Ofis ishlari, Zavodlar"
  }
};

export const RISK_CLASSIFICATION: Record<string, string> = {
  'locomotive': 'HIGH',
  'wagon': 'HIGH',
  'road': 'HIGH',
  'electric': 'MEDIUM',
  'traffic': 'MEDIUM',
  'factory': 'MEDIUM'
};

export const DEPARTMENT_PROFILES: DepartmentProfile[] = [
  { id: 'locomotive', name: "Lokomotiv xo'jaligi (Juda yuqori xavf)", riskLevel: 'critical', icon: '🚂' },
  { id: 'road', name: "Yo'l xo'jaligi (Yuqori fizik xavf)", riskLevel: 'high', icon: '🛤️' },
  { id: 'wagon', name: "Vagon xo'jaligi (Texnologik xavf)", riskLevel: 'high', icon: '🚃' },
  { id: 'electric', name: "Elektr va Aloqa (Elektroxavfsizlik)", riskLevel: 'high', icon: '⚡' },
  { id: 'traffic', name: "Harakatni Boshqarish (Inson omili)", riskLevel: 'medium', icon: '🚦' },
  { id: 'factory', name: "Zavodlar (Sanoat xavfsizligi)", riskLevel: 'high', icon: '🏭' }
];

export const KPI_WEIGHTS: Record<string, Record<string, number>> = {
  'locomotive': {
    'ltifr': 0.40,
    'trir': 0.10,
    'noincident': 0.06,
    'training': 0.05,
    'equipment': 0.06,
    'ppe': 0.05,
    'raCoverage': 0.05,
    'prevention': 0.04,
    'nearMiss': 0.04,
    'responseTime': 0.04,
    'inspection': 0.03,
    'occupational': 0.02,
    'compliance': 0.02,
    'emergency': 0.02,
    'violations': 0.02
  },
  'road': {
    'ltifr': 0.40,
    'trir': 0.10,
    'noincident': 0.06,
    'training': 0.05,
    'equipment': 0.06,
    'ppe': 0.05,
    'raCoverage': 0.05,
    'prevention': 0.04,
    'nearMiss': 0.04,
    'responseTime': 0.04,
    'inspection': 0.03,
    'occupational': 0.02,
    'compliance': 0.02,
    'emergency': 0.02,
    'violations': 0.02
  },
  'wagon': {
    'ltifr': 0.40,
    'trir': 0.10,
    'noincident': 0.06,
    'training': 0.05,
    'equipment': 0.06,
    'ppe': 0.05,
    'raCoverage': 0.05,
    'prevention': 0.04,
    'nearMiss': 0.04,
    'responseTime': 0.04,
    'inspection': 0.03,
    'occupational': 0.02,
    'compliance': 0.02,
    'emergency': 0.02,
    'violations': 0.02
  },
  'electric': {
    'ltifr': 0.38,
    'trir': 0.10,
    'noincident': 0.06,
    'training': 0.06,
    'equipment': 0.05,
    'ppe': 0.06,
    'raCoverage': 0.05,
    'prevention': 0.04,
    'nearMiss': 0.04,
    'responseTime': 0.04,
    'inspection': 0.03,
    'occupational': 0.02,
    'compliance': 0.02,
    'emergency': 0.03,
    'violations': 0.02
  },
  'traffic': {
    'ltifr': 0.35,
    'trir': 0.08,
    'noincident': 0.08,
    'training': 0.08,
    'equipment': 0.04,
    'ppe': 0.04,
    'raCoverage': 0.06,
    'prevention': 0.04,
    'nearMiss': 0.06,
    'responseTime': 0.05,
    'inspection': 0.04,
    'occupational': 0.02,
    'compliance': 0.02,
    'emergency': 0.02,
    'violations': 0.02
  },
  'factory': {
    'ltifr': 0.40,
    'trir': 0.10,
    'noincident': 0.06,
    'training': 0.05,
    'equipment': 0.06,
    'ppe': 0.05,
    'raCoverage': 0.05,
    'prevention': 0.04,
    'nearMiss': 0.04,
    'responseTime': 0.04,
    'inspection': 0.03,
    'occupational': 0.02,
    'compliance': 0.02,
    'emergency': 0.02,
    'violations': 0.02
  }
};

export const ACCIDENT_COEFFICIENTS = {
  fatal: { value: 100, label: "O'lim hollari", color: "#1a1a2e", icon: "💀" },
  severe: { value: 50, label: "Og'ir-o'rta og'ir", color: "#c0392b", icon: "🚑" },
  group: { value: 40, label: "Guruhli hodisa", color: "#d35400", icon: "👥" },
  light: { value: 10, label: "Yengil hodisa", color: "#f39c12", icon: "🩹" }
};
