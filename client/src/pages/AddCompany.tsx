import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useCompanies } from '../contexts/CompanyContext';
import { CompanyFormData, Company } from '../types';
import { DEPARTMENT_PROFILES } from '../utils/kpiConfig';
import { calculateCompanyKPIs, calculateOverallIndex } from '../utils/kpiCalculator';
import './AddCompany.css';

const INITIAL_FORM_DATA: CompanyFormData = {
  name: '',
  level: 'subsidiary',
  parent: '',
  profile: 'locomotive',
  employees: 0,
  fatal: 0,
  severe: 0,
  group: 0,
  light: 0,
  microInjuries: 0,
  noincident: 0,
  trainingPassed: 0,
  trainingRequired: 0,
  assessed: 0,
  totalWorkplaces: 0,
  reports: 0,
  closedIssues: 0,
  totalIssues: 0,
  mmBudget: 0,
  totalBudget: 0,
  ppeEquipped: 0,
  ppeRequired: 0,
  equipmentInspected: 0,
  equipmentTotal: 0,
  authorizedStaff: 0,
  totalStaffEquipment: 0,
  inspectionDone: 0,
  inspectionPlanned: 0,
  occupational: 0,
  auditIssues: 0,
  auditTotal: 0,
  emergencyParticipated: 0,
  emergencyPlanned: 0,
  redCards: 0,
  yellowCards: 0,
  greenCards: 0,
  workStopInternal: 0,
  workStopExternal: 0,
  insuranceAmount: 0,
  monthlyPayroll: 0
};

export function AddCompany() {
  const [, navigate] = useLocation();
  const { companies, addCompany } = useCompanies();
  const [formData, setFormData] = useState<CompanyFormData>(INITIAL_FORM_DATA);
  const [saving, setSaving] = useState(false);

  const parentOptions = useMemo(() => {
    if (formData.level === 'management') return [];
    if (formData.level === 'supervisor') {
      return companies.filter(c => c.level === 'management');
    }
    return companies.filter(c => c.level === 'management' || c.level === 'supervisor');
  }, [companies, formData.level]);

  const handleChange = (field: keyof CompanyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Korxona nomini kiriting');
      return;
    }

    setSaving(true);

    try {
      const kpis = calculateCompanyKPIs(formData);
      const overallIndex = calculateOverallIndex(kpis, formData.profile);

      const newCompany: Company = {
        id: `company_${Date.now()}`,
        name: formData.name.trim(),
        level: formData.level as Company['level'],
        supervisorId: formData.parent || null,
        riskGroup: formData.profile === 'locomotive' || formData.profile === 'road' || formData.profile === 'wagon' ? 'high' : 'medium',
        employees: formData.employees,
        overallIndex,
        profile: formData.profile,
        kpis,
        formData
      };

      const success = await addCompany(newCompany);
      
      if (success) {
        alert('Korxona muvaffaqiyatli qo\'shildi!');
        navigate('/');
      } else {
        alert('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
      }
    } catch (error) {
      console.error('Error adding company:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-company">
      <div className="section-header">
        <h2>➕ Yangi Korxona Qo'shish</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3>📋 Asosiy Ma'lumotlar</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Korxona nomi *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Masalan: Xorazm Metall LLC"
                required
              />
            </div>

            <div className="form-group">
              <label>Ierarxiya Darajasi *</label>
              <select
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value)}
              >
                <option value="subsidiary">Korxona (Subsidiary)</option>
                <option value="supervisor">Nazoratchi (Supervisor)</option>
                <option value="management">Boshqaruv (Management)</option>
              </select>
            </div>

            {parentOptions.length > 0 && (
              <div className="form-group">
                <label>Yuqori Tashkilot *</label>
                <select
                  value={formData.parent}
                  onChange={(e) => handleChange('parent', e.target.value)}
                >
                  <option value="">Tanlang...</option>
                  {parentOptions.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Xo'jalik Profili *</label>
              <select
                value={formData.profile}
                onChange={(e) => handleChange('profile', e.target.value)}
              >
                {DEPARTMENT_PROFILES.map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.icon} {profile.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Xodimlar soni *</label>
              <input
                type="number"
                value={formData.employees}
                onChange={(e) => handleChange('employees', parseInt(e.target.value) || 0)}
                min="1"
                required
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>📊 Ko'rsatkichlar Ma'lumotlari</h3>
          <p className="form-hint">Barcha maydonlar ixtiyoriy. Bo'sh qoldirgan maydonlar 0 sifatida hisoblanadi.</p>

          <div className="kpi-section">
            <div className="kpi-section-header">
              <span className="section-number">1-3</span>
              <span className="section-title">Hodisalar va Jarohatlar</span>
            </div>

            <div className="kpi-group">
              <label>1. Baxtsiz hodisalar (Og'irlik darajasi)</label>
              <div className="severity-inputs">
                <div className="severity-item fatal">
                  <span>💀 O'lim (×100)</span>
                  <input
                    type="number"
                    value={formData.fatal}
                    onChange={(e) => handleChange('fatal', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="severity-item severe">
                  <span>🚑 Og'ir-o'rta (×50)</span>
                  <input
                    type="number"
                    value={formData.severe}
                    onChange={(e) => handleChange('severe', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="severity-item group">
                  <span>👥 Guruh (×40)</span>
                  <input
                    type="number"
                    value={formData.group}
                    onChange={(e) => handleChange('group', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="severity-item light">
                  <span>🩹 Yengil (×10)</span>
                  <input
                    type="number"
                    value={formData.light}
                    onChange={(e) => handleChange('light', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="kpi-row">
              <div className="kpi-item">
                <label>2. Jarohatlanishlar</label>
                <input
                  type="number"
                  value={formData.microInjuries}
                  onChange={(e) => handleChange('microInjuries', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="kpi-item">
                <label>3. Noincident kunlar</label>
                <input
                  type="number"
                  value={formData.noincident}
                  onChange={(e) => handleChange('noincident', parseInt(e.target.value) || 0)}
                  min="0"
                  max="365"
                />
              </div>
            </div>
          </div>

          <div className="kpi-section">
            <div className="kpi-section-header">
              <span className="section-number">4-5</span>
              <span className="section-title">O'qish va Mehnat Sharoitlari</span>
            </div>

            <div className="kpi-row">
              <div className="kpi-item dual">
                <label>4. Majburiy MM o'quvlari</label>
                <div className="dual-inputs">
                  <div>
                    <span>O'tganlar</span>
                    <input
                      type="number"
                      value={formData.trainingPassed}
                      onChange={(e) => handleChange('trainingPassed', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div>
                    <span>Reja</span>
                    <input
                      type="number"
                      value={formData.trainingRequired}
                      onChange={(e) => handleChange('trainingRequired', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>
              </div>
              <div className="kpi-item dual">
                <label>5. Ish o'rinlarini baholash</label>
                <div className="dual-inputs">
                  <div>
                    <span>Baholangan</span>
                    <input
                      type="number"
                      value={formData.assessed}
                      onChange={(e) => handleChange('assessed', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div>
                    <span>Jami</span>
                    <input
                      type="number"
                      value={formData.totalWorkplaces}
                      onChange={(e) => handleChange('totalWorkplaces', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="kpi-section">
            <div className="kpi-section-header">
              <span className="section-number">6-7</span>
              <span className="section-title">Proaktivlik va Reaksiya</span>
            </div>

            <div className="kpi-row">
              <div className="kpi-item">
                <label>6. Near Miss xabarlari</label>
                <input
                  type="number"
                  value={formData.reports}
                  onChange={(e) => handleChange('reports', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="kpi-item dual">
                <label>7. Murojaatlarga Reaksiya</label>
                <div className="dual-inputs">
                  <div>
                    <span>Yopilgan</span>
                    <input
                      type="number"
                      value={formData.closedIssues}
                      onChange={(e) => handleChange('closedIssues', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div>
                    <span>Jami</span>
                    <input
                      type="number"
                      value={formData.totalIssues}
                      onChange={(e) => handleChange('totalIssues', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="kpi-section">
            <div className="kpi-section-header">
              <span className="section-number">8-9</span>
              <span className="section-title">Moliya va Ta'minot</span>
            </div>

            <div className="kpi-row">
              <div className="kpi-item dual">
                <label>8. Moliyalashtirish (mln so'm)</label>
                <div className="dual-inputs">
                  <div>
                    <span>MM Xarajatlari</span>
                    <input
                      type="number"
                      value={formData.mmBudget}
                      onChange={(e) => handleChange('mmBudget', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <span>Jami</span>
                    <input
                      type="number"
                      value={formData.totalBudget}
                      onChange={(e) => handleChange('totalBudget', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              <div className="kpi-item dual">
                <label>9. SHHV bilan ta'minlanganlik</label>
                <div className="dual-inputs">
                  <div>
                    <span>Ta'minlangan</span>
                    <input
                      type="number"
                      value={formData.ppeEquipped}
                      onChange={(e) => handleChange('ppeEquipped', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div>
                    <span>Kerak</span>
                    <input
                      type="number"
                      value={formData.ppeRequired}
                      onChange={(e) => handleChange('ppeRequired', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="kpi-section">
            <div className="kpi-section-header">
              <span className="section-number">YANGI</span>
              <span className="section-title">Ish To'xtatish va Sug'urta (Yangi bandlar)</span>
            </div>

            <div className="kpi-row">
              <div className="kpi-item">
                <label>🛑 Ichki nazorat tomonidan ish to'xtatish</label>
                <p className="field-hint">Proaktiv harakat - ijobiy baholanadi</p>
                <input
                  type="number"
                  value={formData.workStopInternal}
                  onChange={(e) => handleChange('workStopInternal', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="kpi-item">
                <label>🚫 Tashqi nazorat tomonidan ish to'xtatish</label>
                <p className="field-hint">Jiddiy kamchilik - jarima baholanadi</p>
                <input
                  type="number"
                  value={formData.workStopExternal}
                  onChange={(e) => handleChange('workStopExternal', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
            </div>

            <div className="kpi-row">
              <div className="kpi-item dual">
                <label>💳 Sug'urta/Kompensatsiya to'lovlari</label>
                <p className="field-hint">Ish haqi fondiga nisbatan hisoblanadi</p>
                <div className="dual-inputs">
                  <div>
                    <span>To'lov summasi (mln)</span>
                    <input
                      type="number"
                      value={formData.insuranceAmount}
                      onChange={(e) => handleChange('insuranceAmount', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <span>Oylik ish haqi fondi (mln)</span>
                    <input
                      type="number"
                      value={formData.monthlyPayroll}
                      onChange={(e) => handleChange('monthlyPayroll', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
            Bekor qilish
          </button>
          <button type="submit" className="btn-submit" disabled={saving}>
            {saving ? 'Saqlanmoqda...' : "Korxonani Qo'shish"}
          </button>
        </div>
      </form>
    </div>
  );
}
