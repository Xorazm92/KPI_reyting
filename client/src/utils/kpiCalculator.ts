import { CompanyFormData, CompanyKPIs, KPIResult, Zone } from '../types';
import { KPI_CONFIG, KPI_WEIGHTS, RISK_PROFILES, RISK_CLASSIFICATION } from './kpiConfig';

export function penaltyToScore(penalty: number): number {
  if (penalty === 0) return 100;
  if (penalty === 1) return 85;
  if (penalty <= 5) return Math.round(85 - (penalty - 1) * (25 / 4));
  if (penalty <= 20) return Math.round(60 - (penalty - 5) * (30 / 15));
  if (penalty <= 50) return Math.round(30 - (penalty - 20) * (20 / 30));
  if (penalty <= 100) return Math.round(10 - (penalty - 50) * (10 / 50));
  return 0;
}

export function normalizeKPI(value: number, kpiKey: string): number {
  let score = 0;

  switch (kpiKey) {
    case 'ltifr':
      score = penaltyToScore(value);
      break;

    case 'trir':
      if (value === 0) {
        score = 100;
      } else if (value <= 0.2) {
        score = 100 - (value * 50);
      } else if (value <= 0.5) {
        score = 90 - ((value - 0.2) * 40);
      } else if (value <= 1.0) {
        score = 82 - ((value - 0.5) * 24);
      } else if (value <= 2.0) {
        score = 70 - ((value - 1.0) * 40);
      } else if (value <= 3.0) {
        score = 30 - ((value - 2.0) * 15);
      } else if (value <= 5.0) {
        score = 15 - ((value - 3.0) * 7.5);
      } else {
        score = 0;
      }
      break;

    case 'noincident':
      score = Math.min(100, (value / 365) * 100);
      break;

    case 'training':
    case 'raCoverage':
    case 'ppe':
    case 'equipment':
    case 'inspection':
    case 'compliance':
    case 'emergency':
    case 'responseTime':
      score = Math.min(100, Math.max(0, value));
      break;

    case 'nearMiss':
      if (value >= 60) {
        score = 100;
      } else if (value >= 40) {
        score = 85 + ((value - 40) / 20) * 15;
      } else if (value >= 20) {
        score = 60 + ((value - 20) / 20) * 25;
      } else if (value >= 10) {
        score = 40 + ((value - 10) / 10) * 20;
      } else if (value >= 5) {
        score = 20 + ((value - 5) / 5) * 20;
      } else {
        score = (value / 5) * 20;
      }
      break;

    case 'prevention':
      if (value >= 2 && value <= 5) {
        score = 100;
      } else if (value >= 1.5 && value < 2) {
        score = 80 + ((value - 1.5) * 40);
      } else if (value >= 1 && value < 1.5) {
        score = 60 + ((value - 1) * 40);
      } else if (value > 5 && value <= 7) {
        score = 100 - ((value - 5) * 15);
      } else if (value < 1) {
        score = value * 60;
      } else {
        score = Math.max(0, 70 - ((value - 7) * 10));
      }
      break;

    case 'occupational':
      if (value === 0) {
        score = 100;
      } else if (value === 1) {
        score = 55;
      } else if (value === 2) {
        score = 30;
      } else if (value === 3) {
        score = 15;
      } else {
        score = Math.max(0, 10 - (value - 3) * 3);
      }
      break;

    case 'violations':
      if (value === 0) {
        score = 100;
      } else if (value <= 2) {
        score = 95 - (value * 10);
      } else if (value <= 5) {
        score = 75 - ((value - 2) * 10);
      } else if (value <= 10) {
        score = 45 - ((value - 5) * 6);
      } else if (value <= 20) {
        score = 15 - ((value - 10) * 1.5);
      } else {
        score = 0;
      }
      break;

    case 'workStopInternal':
      score = Math.min(100, value * 2);
      break;

    case 'workStopExternal':
      if (value === 0) {
        score = 100;
      } else {
        score = Math.max(0, 100 - (value * 20));
      }
      break;

    case 'insurancePayments':
      if (value === 0) {
        score = 100;
      } else if (value <= 0.5) {
        score = 90 - (value * 20);
      } else if (value <= 1) {
        score = 80 - ((value - 0.5) * 40);
      } else if (value <= 2) {
        score = 60 - ((value - 1) * 30);
      } else {
        score = Math.max(0, 30 - ((value - 2) * 15));
      }
      break;
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}

export function calculateAccidentSeverity(fatal: number, severe: number, group: number, light: number): number {
  return (fatal * 100) + (severe * 50) + (group * 40) + (light * 10);
}

export function calculateMicroInjury(count: number, employees: number): number {
  return employees > 0 ? (count / employees) * 100 : 0;
}

export function calculatePercentage(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}

export function calculateNearMissCulture(count: number, employees: number): number {
  return employees > 0 ? (count / employees) * 100 : 0;
}

export function calculateHighRiskControl(
  inspected: number,
  totalRisk: number,
  authorized: number,
  totalStaff: number
): number {
  const equipmentPart = totalRisk > 0 ? (inspected / totalRisk) * 100 : 0;
  const staffPart = totalStaff > 0 ? (authorized / totalStaff) * 100 : 0;
  return (equipmentPart * 0.6) + (staffPart * 0.4);
}

export function calculateDisciplineIndex(red: number, yellow: number, green: number, employees: number): number {
  const penaltyPoints = (red * 10) + (yellow * 3) + (green * 1);
  return employees > 0 ? (penaltyPoints / employees) * 100 : 0;
}

export function calculateInsuranceRatio(insuranceAmount: number, monthlyPayroll: number): number {
  return monthlyPayroll > 0 ? (insuranceAmount / monthlyPayroll) * 100 : 0;
}

export function getRiskProfile(department: string) {
  const riskClass = RISK_CLASSIFICATION[department] || 'MEDIUM';
  return RISK_PROFILES[riskClass];
}

export function checkMinimumRequirements(scores: Record<string, number>, department: string) {
  const risk = getRiskProfile(department);
  const violations: Array<{ metric: string; required: number; actual: number; penalty: number }> = [];

  if (scores.ltifr && scores.ltifr < risk.minLTIFR) {
    violations.push({ metric: 'ltifr', required: risk.minLTIFR, actual: scores.ltifr, penalty: 25 });
  }
  if (scores.trir && scores.trir < risk.minTRIR) {
    violations.push({ metric: 'trir', required: risk.minTRIR, actual: scores.trir, penalty: 20 });
  }
  if (scores.training && scores.training < risk.minTraining) {
    violations.push({ metric: 'training', required: risk.minTraining, actual: scores.training, penalty: 15 });
  }
  if (scores.equipment && scores.equipment < risk.minEquipment) {
    violations.push({ metric: 'equipment', required: risk.minEquipment, actual: scores.equipment, penalty: 15 });
  }
  if (scores.ppe && scores.ppe < risk.minPPE) {
    violations.push({ metric: 'ppe', required: risk.minPPE, actual: scores.ppe, penalty: 20 });
  }
  if (scores.raCoverage && scores.raCoverage < risk.minRACoverage) {
    violations.push({ metric: 'raCoverage', required: risk.minRACoverage, actual: scores.raCoverage, penalty: 12 });
  }

  return violations;
}

export function calculateCompanyKPIs(formData: CompanyFormData): CompanyKPIs {
  const employees = formData.employees || 1;

  const ltifr = {
    value: calculateAccidentSeverity(formData.fatal, formData.severe, formData.group, formData.light),
    score: 0
  };
  ltifr.score = normalizeKPI(ltifr.value, 'ltifr');

  const trir = {
    value: calculateMicroInjury(formData.microInjuries, employees),
    score: 0
  };
  trir.score = normalizeKPI(trir.value, 'trir');

  const noincident = {
    value: formData.noincident,
    score: normalizeKPI(formData.noincident, 'noincident')
  };

  const training = {
    value: calculatePercentage(formData.trainingPassed, formData.trainingRequired),
    score: 0
  };
  training.score = normalizeKPI(training.value, 'training');

  const raCoverage = {
    value: calculatePercentage(formData.assessed, formData.totalWorkplaces),
    score: 0
  };
  raCoverage.score = normalizeKPI(raCoverage.value, 'raCoverage');

  const nearMiss = {
    value: calculateNearMissCulture(formData.reports, employees),
    score: 0
  };
  nearMiss.score = normalizeKPI(nearMiss.value, 'nearMiss');

  const responseTime = {
    value: calculatePercentage(formData.closedIssues, formData.totalIssues),
    score: 0
  };
  responseTime.score = normalizeKPI(responseTime.value, 'responseTime');

  const prevention = {
    value: calculatePercentage(formData.mmBudget, formData.totalBudget),
    score: 0
  };
  prevention.score = normalizeKPI(prevention.value, 'prevention');

  const ppe = {
    value: calculatePercentage(formData.ppeEquipped, formData.ppeRequired),
    score: 0
  };
  ppe.score = normalizeKPI(ppe.value, 'ppe');

  const equipment = {
    value: calculateHighRiskControl(
      formData.equipmentInspected,
      formData.equipmentTotal,
      formData.authorizedStaff,
      formData.totalStaffEquipment
    ),
    score: 0
  };
  equipment.score = normalizeKPI(equipment.value, 'equipment');

  const inspection = {
    value: calculatePercentage(formData.inspectionDone, formData.inspectionPlanned),
    score: 0
  };
  inspection.score = normalizeKPI(inspection.value, 'inspection');

  const occupational = {
    value: formData.occupational,
    score: normalizeKPI(formData.occupational, 'occupational')
  };

  const compliance = {
    value: calculatePercentage(formData.auditTotal - formData.auditIssues, formData.auditTotal),
    score: 0
  };
  compliance.score = normalizeKPI(compliance.value, 'compliance');

  const emergency = {
    value: calculatePercentage(formData.emergencyParticipated, formData.emergencyPlanned),
    score: 0
  };
  emergency.score = normalizeKPI(emergency.value, 'emergency');

  const violations = {
    value: calculateDisciplineIndex(formData.redCards, formData.yellowCards, formData.greenCards, employees),
    score: 0
  };
  violations.score = normalizeKPI(violations.value, 'violations');

  const workStopInternal = {
    value: formData.workStopInternal || 0,
    score: normalizeKPI(formData.workStopInternal || 0, 'workStopInternal')
  };

  const workStopExternal = {
    value: formData.workStopExternal || 0,
    score: normalizeKPI(formData.workStopExternal || 0, 'workStopExternal')
  };

  const insuranceRatio = calculateInsuranceRatio(formData.insuranceAmount || 0, formData.monthlyPayroll || 1);
  const insurancePayments = {
    value: insuranceRatio,
    score: normalizeKPI(insuranceRatio, 'insurancePayments')
  };

  return {
    ltifr,
    trir,
    noincident,
    training,
    equipment,
    ppe,
    raCoverage,
    prevention,
    nearMiss,
    responseTime,
    inspection,
    occupational,
    compliance,
    emergency,
    violations,
    workStopInternal,
    workStopExternal,
    insurancePayments
  };
}

export function calculateOverallIndex(kpiResults: CompanyKPIs, profileId: string): number {
  let totalScore = 0;
  let totalWeight = 0;

  const profileWeights = KPI_WEIGHTS[profileId] || {};

  for (const [key, result] of Object.entries(kpiResults)) {
    const config = KPI_CONFIG[key];
    if (config && result && typeof result === 'object' && 'score' in result) {
      const weight = profileWeights[key] !== undefined ? profileWeights[key] : config.weight;
      totalScore += result.score * weight;
      totalWeight += weight;
    }
  }

  let weightedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

  const kpiValues: Record<string, number> = {};
  for (const [key, result] of Object.entries(kpiResults)) {
    if (result && typeof result === 'object' && 'score' in result) {
      kpiValues[key] = result.score || 0;
    }
  }

  const violations = checkMinimumRequirements(kpiValues, profileId);
  if (violations.length > 0) {
    let minRequirementsPenalty = 0;
    for (const violation of violations) {
      minRequirementsPenalty += violation.penalty;
    }
    weightedScore = Math.max(0, weightedScore - minRequirementsPenalty);
  }

  return Math.round(weightedScore * 100) / 100;
}

export function getZone(score: number): Zone {
  if (score >= 80) return { name: 'green', label: '🟢 Yaxshi', class: 'green' };
  if (score >= 50) return { name: 'yellow', label: '🟡 Qoniqarli', class: 'yellow' };
  return { name: 'red', label: '🔴 Xavfli', class: 'red' };
}

export function getEmptyKPIs(): CompanyKPIs {
  const emptyResult: KPIResult = { value: 0, score: 0 };
  return {
    ltifr: { ...emptyResult },
    trir: { ...emptyResult },
    noincident: { ...emptyResult },
    training: { ...emptyResult },
    equipment: { ...emptyResult },
    ppe: { ...emptyResult },
    raCoverage: { ...emptyResult },
    prevention: { ...emptyResult },
    nearMiss: { ...emptyResult },
    responseTime: { ...emptyResult },
    inspection: { ...emptyResult },
    occupational: { ...emptyResult },
    compliance: { ...emptyResult },
    emergency: { ...emptyResult },
    violations: { ...emptyResult },
    workStopInternal: { ...emptyResult },
    workStopExternal: { ...emptyResult },
    insurancePayments: { ...emptyResult }
  };
}
