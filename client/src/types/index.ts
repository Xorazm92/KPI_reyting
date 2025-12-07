export interface User {
  username: string;
  role: 'admin' | 'manager' | 'supervisor' | 'user';
}

export interface KPIResult {
  value: number;
  score: number;
}

export interface CompanyKPIs {
  ltifr: KPIResult;
  trir: KPIResult;
  noincident: KPIResult;
  training: KPIResult;
  equipment: KPIResult;
  ppe: KPIResult;
  raCoverage: KPIResult;
  prevention: KPIResult;
  nearMiss: KPIResult;
  responseTime: KPIResult;
  inspection: KPIResult;
  occupational: KPIResult;
  compliance: KPIResult;
  emergency: KPIResult;
  violations: KPIResult;
  workStopInternal?: KPIResult;
  workStopExternal?: KPIResult;
  insurancePayments?: KPIResult;
}

export interface Company {
  id: string;
  name: string;
  level: 'management' | 'supervisor' | 'subsidiary';
  supervisorId: string | null;
  riskGroup: 'low' | 'medium' | 'high';
  employees: number;
  overallIndex: number;
  profile?: string;
  kpis: CompanyKPIs;
  formData?: CompanyFormData;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyFormData {
  name: string;
  level: string;
  parent: string;
  profile: string;
  employees: number;
  fatal: number;
  severe: number;
  group: number;
  light: number;
  microInjuries: number;
  noincident: number;
  trainingPassed: number;
  trainingRequired: number;
  assessed: number;
  totalWorkplaces: number;
  reports: number;
  closedIssues: number;
  totalIssues: number;
  mmBudget: number;
  totalBudget: number;
  ppeEquipped: number;
  ppeRequired: number;
  equipmentInspected: number;
  equipmentTotal: number;
  authorizedStaff: number;
  totalStaffEquipment: number;
  inspectionDone: number;
  inspectionPlanned: number;
  occupational: number;
  auditIssues: number;
  auditTotal: number;
  emergencyParticipated: number;
  emergencyPlanned: number;
  redCards: number;
  yellowCards: number;
  greenCards: number;
  workStopInternal: number;
  workStopExternal: number;
  insuranceAmount: number;
  monthlyPayroll: number;
}

export interface RiskProfile {
  name: string;
  coefficient: number;
  minLTIFR: number;
  minTRIR: number;
  penaltyMultiplier: number;
  minTraining: number;
  minEquipment: number;
  minPPE: number;
  minRACoverage: number;
  description: string;
}

export interface DepartmentProfile {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  icon: string;
}

export interface KPIConfig {
  name: string;
  weight: number;
  lowerIsBetter: boolean;
  critical?: boolean;
  icon: string;
  description?: string;
}

export interface Zone {
  name: 'green' | 'yellow' | 'red';
  label: string;
  class: string;
}

export type ReportPeriod = 'monthly' | 'quarterly' | 'yearly';
