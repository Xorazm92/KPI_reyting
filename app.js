// ===================================
// FIREBASE CONFIGURATION (NBT-KPI)
// ===================================
const firebaseConfig = {
    apiKey: "AIzaSyCgDZtXjpmO3hN2e6lEZKLMVYe9ZKBDyO4",
    authDomain: "nbt-kpi.firebaseapp.com",
    projectId: "nbt-kpi",
    storageBucket: "nbt-kpi.firebasestorage.app",
    messagingSenderId: "859763032556",
    appId: "1:859763032556:web:38ec98599f45376cf2c0c9",
    measurementId: "G-G0158DFT8P"
};

// Initialize Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase (NBT-KPI) muvaffaqiyatli ulandi! ✅");
} catch (error) {
    console.error("Firebase ulanishda xatolik:", error);
    alert("Firebase ulanmadi. Internetni tekshiring.");
}

// ===================================
// KPI Configuration & Weights
// ===================================
const KPI_CONFIG = {
    ltifr: { name: "Baxtsiz hodisalar (Og'irlik)", weight: 0.12, lowerIsBetter: true },
    trir: { name: "Mikro-jarohatlar", weight: 0.10, lowerIsBetter: true },
    noincident: { name: "Noincident kunlar", weight: 0.08, lowerIsBetter: false },
    training: { name: "Majburiy o'quv qamrovi", weight: 0.06, lowerIsBetter: false },
    raCoverage: { name: "Xavfni baholash", weight: 0.08, lowerIsBetter: false },
    nearMiss: { name: "Xabarlar va Takliflar", weight: 0.06, lowerIsBetter: false },
    responseTime: { name: "Murojaatga reaksiya", weight: 0.08, lowerIsBetter: false }, // Changed to false (higher % is better)
    prevention: { name: "Profilaktika", weight: 0.08, lowerIsBetter: false },
    ppe: { name: "SHHV ta'minoti", weight: 0.06, lowerIsBetter: false },
    equipment: { name: "Uskuna nazorati", weight: 0.05, lowerIsBetter: false },
    inspection: { name: "Nazorat rejasi ijrosi", weight: 0.08, lowerIsBetter: false },
    occupational: { name: "Kasbiy kasallik", weight: 0.05, lowerIsBetter: true },
    compliance: { name: "Audit samaradorligi", weight: 0.05, lowerIsBetter: false },
    emergency: { name: "Avariya tayyorgarligi", weight: 0.05, lowerIsBetter: false },
    violations: { name: "Intizomiy buzilishlar", weight: 0.08, lowerIsBetter: true }
};

// ===================================
// Global State
// ===================================
let companies = [];
let currentEditId = null;
let comparisonCharts = {};
let selectedOrganizationId = 'all'; // Default: Show all entered companies (with data)

// Initialize Application
// This initialization is moved to the main DOMContentLoaded at the end of the file

function populateProfileSelect() {
    console.log('populateProfileSelect called');
    const select = document.getElementById('company-profile');

    // Use global variable explicitly
    const profiles = window.DEPARTMENT_PROFILES || [];
    console.log('DEPARTMENT_PROFILES (global):', profiles);

    if (!select) {
        console.error('company-profile select not found!');
        return;
    }

    // Clear existing options except the first one
    while (select.options.length > 1) {
        select.remove(1);
    }

    profiles.forEach(profile => {
        const option = document.createElement('option');
        option.value = profile.id;
        option.textContent = profile.name;
        select.appendChild(option);
        console.log('Added profile:', profile.name);
    });

    console.log('Total options:', select.options.length);
}

// ===================================
// KPI Calculator Class
// ===================================
class KPICalculator {
    constructor(companyData) {
        this.company = companyData;
    }

    calculateAccidentSeverity(fatal, severe, group, light) {
        // Penalty points: Fatal=100, Severe=50, Group=40, Light=10
        const penalty = (fatal * 100) + (severe * 50) + (group * 40) + (light * 10);
        return penalty;
    }

    calculateMicroInjury(count) {
        // Rate per 100 employees
        return this.company.employees > 0 ? (count / this.company.employees) * 100 : 0;
    }

    calculateNoincident(days) {
        return (days / 365) * 100;
    }

    calculateTrainingEffectiveness(passed, required) {
        return required > 0 ? (passed / required) * 100 : 0;
    }

    calculateRACoverage(assessed, total) {
        return total > 0 ? (assessed / total) * 100 : 0;
    }

    calculateNearMissCulture(count) {
        // Rate per 100 employees
        return this.company.employees > 0 ? (count / this.company.employees) * 100 : 0;
    }

    calculateResponseIndex(closed, total) {
        return total > 0 ? (closed / total) * 100 : 0;
    }

    calculatePrevention(mmBudget, totalBudget) {
        return totalBudget > 0 ? (mmBudget / totalBudget) * 100 : 0;
    }

    calculatePPECompliance(equipped, required) {
        return required > 0 ? (equipped / required) * 100 : 0;
    }

    calculateHighRiskControl(inspected, totalRisk, authorized, totalStaff) {
        const equipmentPart = totalRisk > 0 ? (inspected / totalRisk) * 100 : 0;
        const staffPart = totalStaff > 0 ? (authorized / totalStaff) * 100 : 0;
        // Weighted: 60% Equipment, 40% Staff
        return (equipmentPart * 0.6) + (staffPart * 0.4);
    }

    calculateInspectionExecution(done, planned) {
        return planned > 0 ? (done / planned) * 100 : 0;
    }

    calculateOccupational(count) {
        return count;
    }

    calculateAuditEffectiveness(issues, totalPoints) {
        return totalPoints > 0 ? (1 - (issues / totalPoints)) * 100 : 0;
    }

    calculateEmergencyPreparedness(participated, planned) {
        return planned > 0 ? (participated / planned) * 100 : 0;
    }

    calculateDisciplineIndex(red, yellow, green) {
        // Penalty points: Red=10, Yellow=3, Green=1
        const penaltyPoints = (red * 10) + (yellow * 3) + (green * 1);
        // Rate per 100 employees
        return this.company.employees > 0 ? (penaltyPoints / this.company.employees) * 100 : 0;
    }
}

// ===================================
// Normalization Functions
// ===================================
function normalizeKPI(value, kpiKey) {
    let score = 0;

    switch (kpiKey) {
        case 'ltifr': // Accident Severity
            score = Math.max(0, 100 - value);
            break;
        case 'trir': // Micro Injuries
            score = Math.max(0, 100 - (value * 20));
            break;
        case 'noincident':
        case 'training':
        case 'raCoverage':
        case 'ppe':
        case 'equipment':
        case 'inspection':
        case 'compliance':
        case 'emergency':
        case 'responseTime': // Now it's % closed on time
            score = Math.min(100, value);
            break;
        case 'nearMiss': // Reports & Proposals
            // Target: 10 reports per 100 employees per month (120 per year)
            // Value is rate per 100 employees
            score = Math.min(100, (value / 120) * 100);
            break;
        case 'prevention':
            if (value >= 2 && value <= 5) score = 100;
            else if (value < 2) score = (value / 2) * 100;
            else score = Math.max(0, 100 - ((value - 5) * 10));
            break;
        case 'occupational':
            score = Math.max(0, 100 - (value * 50));
            break;
        case 'violations': // Discipline Index
            score = Math.max(0, 100 - value);
            break;
    }

    return Math.round(Math.max(0, Math.min(100, score)));
}

// ===================================
// Zone Classification
// ===================================
function getZone(score) {
    if (score >= 80) return { name: 'green', label: '🟢 Yaxshi', class: 'green' };
    if (score >= 50) return { name: 'yellow', label: '🟡 Qoniqarli', class: 'yellow' };
    return { name: 'red', label: '🔴 Xavfli', class: 'red' };
}

// ===================================
// Calculate Overall Index
// ===================================
function calculateOverallIndex(kpiResults, profileId) {
    let totalScore = 0;
    let totalWeight = 0;

    // Get weights for the selected profile, or fallback to default weights from KPI_CONFIG
    const profileWeights = KPI_WEIGHTS[profileId] || {};

    for (const [key, result] of Object.entries(kpiResults)) {
        const config = KPI_CONFIG[key];
        if (config && result.score !== undefined) {
            // Use profile-specific weight if available, otherwise use default
            const weight = profileWeights[key] !== undefined ? profileWeights[key] : config.weight;

            totalScore += result.score * weight;
            totalWeight += weight;
        }
    }

    return totalWeight > 0 ? Math.round(totalScore / totalWeight * 100) / 100 : 0;
}

// ===================================
// Calculate Company KPIs
// ===================================
function calculateCompanyKPIs(formData) {
    const companyData = {
        employees: parseFloat(formData.employees) || 0,
        totalHours: parseFloat(formData.totalHours) || 0
    };

    const calculator = new KPICalculator(companyData);
    const kpiResults = {};

    // Calculate all KPIs
    kpiResults.ltifr = {
        value: calculator.calculateAccidentSeverity(
            parseFloat(formData.fatal) || 0,
            parseFloat(formData.severe) || 0,
            parseFloat(formData.group) || 0,
            parseFloat(formData.light) || 0
        ),
        score: 0
    };
    kpiResults.ltifr.score = normalizeKPI(kpiResults.ltifr.value, 'ltifr');

    kpiResults.trir = {
        value: calculator.calculateMicroInjury(parseFloat(formData.microInjuries) || 0),
        score: 0
    };
    kpiResults.trir.score = normalizeKPI(kpiResults.trir.value, 'trir');

    kpiResults.noincident = {
        value: calculator.calculateNoincident(parseFloat(formData.noincident) || 0),
        score: 0
    };
    kpiResults.noincident.score = normalizeKPI(kpiResults.noincident.value, 'noincident');

    kpiResults.training = {
        value: calculator.calculateTrainingEffectiveness(
            parseFloat(formData.trainingPassed) || 0,
            parseFloat(formData.trainingRequired) || 1
        ),
        score: 0
    };
    kpiResults.training.score = normalizeKPI(kpiResults.training.value, 'training');

    kpiResults.raCoverage = {
        value: calculator.calculateRACoverage(
            parseFloat(formData.assessed) || 0,
            parseFloat(formData.totalWorkplaces) || 1
        ),
        score: 0
    };
    kpiResults.raCoverage.score = normalizeKPI(kpiResults.raCoverage.value, 'raCoverage');

    kpiResults.nearMiss = {
        value: calculator.calculateNearMissCulture(parseFloat(formData.reports) || 0),
        score: 0
    };
    kpiResults.nearMiss.score = normalizeKPI(kpiResults.nearMiss.value, 'nearMiss');

    kpiResults.responseTime = {
        value: calculator.calculateResponseIndex(
            parseFloat(formData.closedIssues) || 0,
            parseFloat(formData.totalIssues) || 1
        ),
        score: 0
    };
    kpiResults.responseTime.score = normalizeKPI(kpiResults.responseTime.value, 'responseTime');

    kpiResults.prevention = {
        value: calculator.calculatePrevention(
            parseFloat(formData.mmBudget) || 0,
            parseFloat(formData.totalBudget) || 1
        ),
        score: 0
    };
    kpiResults.prevention.score = normalizeKPI(kpiResults.prevention.value, 'prevention');

    kpiResults.ppe = {
        value: calculator.calculatePPECompliance(
            parseFloat(formData.ppeEquipped) || 0,
            parseFloat(formData.ppeRequired) || 1
        ),
        score: 0
    };
    kpiResults.ppe.score = normalizeKPI(kpiResults.ppe.value, 'ppe');

    kpiResults.equipment = {
        value: calculator.calculateHighRiskControl(
            parseFloat(formData.equipmentInspected) || 0,
            parseFloat(formData.equipmentTotal) || 1,
            parseFloat(formData.authorizedStaff) || 0,
            parseFloat(formData.totalStaffEquipment) || 1
        ),
        score: 0
    };
    kpiResults.equipment.score = normalizeKPI(kpiResults.equipment.value, 'equipment');

    kpiResults.inspection = {
        value: calculator.calculateInspectionExecution(
            parseFloat(formData.inspectionDone) || 0,
            parseFloat(formData.inspectionPlanned) || 1
        ),
        score: 0
    };
    kpiResults.inspection.score = normalizeKPI(kpiResults.inspection.value, 'inspection');

    kpiResults.occupational = {
        value: calculator.calculateOccupational(parseFloat(formData.occupational) || 0),
        score: 0
    };
    kpiResults.occupational.score = normalizeKPI(kpiResults.occupational.value, 'occupational');

    kpiResults.compliance = {
        value: calculator.calculateAuditEffectiveness(
            parseFloat(formData.auditIssues) || 0,
            parseFloat(formData.auditTotal) || 1
        ),
        score: 0
    };
    kpiResults.compliance.score = normalizeKPI(kpiResults.compliance.value, 'compliance');

    kpiResults.emergency = {
        value: calculator.calculateEmergencyPreparedness(
            parseFloat(formData.emergencyParticipated) || 0,
            parseFloat(formData.emergencyPlanned) || 1
        ),
        score: 0
    };
    kpiResults.emergency.score = normalizeKPI(kpiResults.emergency.value, 'emergency');

    kpiResults.violations = {
        value: calculator.calculateDisciplineIndex(
            parseFloat(formData.ticketRed) || 0,
            parseFloat(formData.ticketYellow) || 0,
            parseFloat(formData.ticketGreen) || 0
        ),
        score: 0
    };
    kpiResults.violations.score = normalizeKPI(kpiResults.violations.value, 'violations');

    return kpiResults;
}

// ===================================
// Company Management
// Company Management (Hybrid: Firebase + LocalStorage)
// ===================================

function addOrUpdateCompany(formData) {
    console.log("🚀 addOrUpdateCompany ishga tushdi", formData);

    try {
        const kpis = calculateCompanyKPIs(formData);
        const profileId = document.getElementById('company-profile').value;
        const overallIndex = calculateOverallIndex(kpis, profileId);
        const zone = getZone(overallIndex);

        // Generate or use existing ID
        const id = currentEditId || generateId();
        console.log("📌 ID:", id, "| Edit mode:", currentEditId ? "Ha" : "Yo'q");

        const companyData = {
            id: id,
            name: formData.name,
            profile: profileId,
            employees: parseFloat(formData.employees) || 0,
            totalHours: parseFloat(formData.totalHours) || 0,
            kpis: kpis,
            overallIndex: overallIndex,
            zone: zone.name,
            dateAdded: currentEditId
                ? (companies.find(c => c.id === currentEditId)?.dateAdded || new Date().toISOString())
                : new Date().toISOString(),
            rawData: formData
        };

        console.log("📝 Tayyorlangan ma'lumot:", companyData);

        // Clear edit mode immediately
        const wasEditing = !!currentEditId;
        currentEditId = null;

        // 1. Try Firebase
        if (db) {
            console.log("🔥 Firebase ga yozilmoqda...");
            console.log("📄 Saqlash uchun ma'lumot:", {
                id: id,
                name: companyData.name,
                employees: companyData.employees,
                overallIndex: companyData.overallIndex
            });

            db.collection("companies").doc(id).set(companyData, { merge: true })
                .then(() => {
                    console.log("✅ Firebase: Muvaffaqiyatli saqlandi!");
                    console.log("📊 Saqlangan ID:", id);
                    finishSave(wasEditing);
                })
                .catch((error) => {
                    console.error("❌ Firebase Xatosi:", error);
                    console.error("Xato kodi:", error.code);
                    console.error("Xato xabari:", error.message);

                    let errorMsg = "Firebase xatosi: ";
                    if (error.code === 'permission-denied') {
                        errorMsg += "Ruxsat berilmagan!\n\n";
                        errorMsg += "Firebase Console'da Firestore Security Rules'ni tekshiring.\n";
                        errorMsg += "Development uchun: allow read, write: if true;\n\n";
                    } else if (error.code === 'unavailable') {
                        errorMsg += "Internet ulanishi yo'q!\n\n";
                    } else {
                        errorMsg += error.message + "\n\n";
                    }
                    errorMsg += "Lokal xotiraga saqlashga urinib ko'ramiz.";

                    alert(errorMsg);
                    saveLocal(companyData, wasEditing);
                });
        } else {
            // 2. Fallback to LocalStorage
            console.warn("⚠️ Firebase mavjud emas. Lokalga saqlanmoqda...");
            saveLocal(companyData, wasEditing);
        }
    } catch (err) {
        console.error("❌ addOrUpdateCompany ichida xato:", err);
        alert("Dastur xatosi: " + err.message);
        currentEditId = null; // Reset state
    }
}

function saveLocal(companyData, wasEditing) {
    console.log("💾 LocalStorage ga saqlanmoqda...");

    if (wasEditing) {
        const index = companies.findIndex(c => c.id === companyData.id);
        if (index !== -1) {
            companies[index] = companyData;
            console.log("✏️ Mavjud korxona yangilandi:", companyData.name);
        } else {
            companies.push(companyData);
            console.log("➕ Yangi korxona qo'shildi (edit topilmadi):", companyData.name);
        }
    } else {
        companies.push(companyData);
        console.log("➕ Yangi korxona qo'shildi:", companyData.name);
    }

    localStorage.setItem('mm_companies', JSON.stringify(companies));
    console.log("✅ LocalStorage yangilandi. Jami:", companies.length);
    finishSave(wasEditing);
}

function finishSave(wasEditing = false) {
    console.log("🎯 finishSave:", wasEditing ? "Tahrirlandi" : "Yangi qo'shildi");

    try {
        // 1. Switch tab immediately
        switchTab('dashboard');

        // 2. Update UI
        calculateRankings();
        renderDashboard();

        // 3. Reset form
        resetForm();

        // 4. Show success
        const message = wasEditing
            ? 'Korxona muvaffaqiyatli yangilandi! ✅'
            : 'Korxona muvaffaqiyatli qo\'shildi! ✅';

        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }

        console.log("✅ finishSave tugadi");
    } catch (e) {
        console.error("❌ finishSave xatosi:", e);
    }
}

function deleteCompany(id) {
    if (confirm('Bu korxonani o\'chirmoqchimisiz?')) {
        if (db) {
            db.collection("companies").doc(id).delete().then(() => {
                console.log("🗑️ Firebase: O'chirildi!");
                if (typeof showNotification === 'function') showNotification('Korxona o\'chirildi 🗑️', 'warning');
            }).catch(err => {
                console.error("❌ O'chirishda xato:", err);
                alert("O'chirishda xatolik: " + err.message);
            });
        } else {
            companies = companies.filter(c => c.id !== id);
            localStorage.setItem('mm_companies', JSON.stringify(companies));
            calculateRankings();
            renderDashboard();
            if (typeof showNotification === 'function') showNotification('Korxona o\'chirildi (Lokal) 🗑️', 'warning');
        }
    }
}

// ===================================
// Data Loading (Hybrid)
// ===================================

function loadCompanies() {
    console.log("📡 loadCompanies chaqirildi. db:", db ? "Mavjud ✅" : "Yo'q ❌");

    // 1. Try Firebase Real-time Listener
    if (db) {
        console.log("🔥 Firebase real-time listener o'rnatilmoqda...");

        db.collection("companies").onSnapshot((querySnapshot) => {
            console.log("📥 Firebase snapshot olindi. Hujjatlar soni:", querySnapshot.size);

            companies = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                companies.push(data);
            });

            console.log("✅ Firebase dan yangilandi:", companies.length, "ta korxona");

            // Agar Firebase bo'sh bo'lsa, lokal/default ma'lumotlarni tekshiramiz
            if (companies.length === 0) {
                console.warn("⚠️ Firebase'da ma'lumot yo'q. Default shablon yuklanmoqda...");
                // Faqat boshlash uchun shablon yuklaymiz (0 ball bilan)
                companies = window.UZ_RAILWAY_DATA || [];
            } else {
                // Firebase da ma'lumot bor - faqat shuni ishlatamiz!
                // Qo'shimcha merge QILMAYMIZ.
                console.log("🔥 Faqat Firebase ma'lumotlari ishlatilmoqda.");

                // Backup uchun saqlab qo'yamiz
                localStorage.setItem('mm_companies', JSON.stringify(companies));
            }

            refreshUI();

            if (companies.length > 0) {
                console.log("Korxonalar:", companies.map(c => c.name).join(", "));
                // Save to localStorage as backup
                localStorage.setItem('mm_companies', JSON.stringify(companies));
            } else {
                console.warn("⚠️ Firebase'da ma'lumot yo'q. LocalStorage'dan yuklanmoqda...");
                loadLocal();
                return;
            }

            refreshUI();
        }, (error) => {
            console.error("❌ Firebase yuklashda xato:", error);
            console.error("Xato kodi:", error.code);
            console.error("Xato xabari:", error.message);

            // Show user-friendly error
            const errorMsg = `Firebase xatosi: ${error.message}\n\nLokal xotiradan yuklanadi.`;
            console.warn(errorMsg);

            loadLocal();
        });
    } else {
        // 2. Fallback to LocalStorage
        console.warn("⚠️ Firebase mavjud emas. LocalStorage ishlatiladi.");
        loadLocal();
    }
}

function loadLocal() {
    console.log("💾 LocalStorage dan yuklash...");
    const saved = localStorage.getItem('mm_companies');
    let localData = [];
    if (saved) {
        try {
            localData = JSON.parse(saved);
        } catch (e) {
            console.error("❌ LocalStorage parse xatosi:", e);
        }
    }

    // Merge logic REMOVED to respect "Only what is saved" rule
    // But if local is completely empty, we load the template (0 scores) so user can start

    if (localData.length === 0) {
        console.log("ℹ️ LocalStorage bo'sh, default shablon yuklanmoqda...");
        companies = window.UZ_RAILWAY_DATA || [];
    } else {
        console.log("💾 LocalStorage ma'lumotlari ishlatilmoqda.");
        companies = localData;
    }

    console.log("✅ Jami korxonalar:", companies.length);
    refreshUI();
}

function refreshUI() {
    console.log("🔄 refreshUI: UI yangilanmoqda...");
    calculateParentCompanyRatings(); // Calculate parent ratings from subsidiaries
    calculateRankings();
    initializeOrganizationFilter(); // Initialize filter selector
    renderDashboard();
    updateUIForRole();
    console.log("✅ UI yangilandi");
}

// Helper: Generate ID
function generateId() {
    return 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function editCompany(id) {
    const company = companies.find(c => c.id === id);
    if (!company) return;

    currentEditId = id;

    // Fill form with company data
    document.getElementById('company-name').value = company.name;
    document.getElementById('company-profile').value = company.profile || '';
    document.getElementById('company-employees').value = company.employees;

    // Set Level and Update Parent Select
    const levelSelect = document.getElementById('company-level');
    if (levelSelect) {
        levelSelect.value = company.level || 'subsidiary';
        // Trigger update to populate parent dropdown
        updateParentSelect();

        // Set Parent after dropdown is populated
        const parentSelect = document.getElementById('company-parent');
        if (parentSelect && company.supervisorId) {
            parentSelect.value = company.supervisorId;
        }
    }

    // Restore raw data if available
    if (company.rawData) {
        const d = company.rawData;

        // KPI 1
        document.getElementById('input-fatal').value = d.fatal || 0;
        document.getElementById('input-severe').value = d.severe || 0;
        document.getElementById('input-group').value = d.group || 0;
        document.getElementById('input-light').value = d.light || 0;

        // KPI 2
        document.getElementById('input-micro-injuries').value = d.microInjuries || 0;

        // KPI 3
        document.getElementById('input-noincident').value = d.noincident || 0;

        // KPI 4
        document.getElementById('input-training-required').value = d.trainingRequired || 0;
        document.getElementById('input-training-passed').value = d.trainingPassed || 0;

        // KPI 5
        document.getElementById('input-assessed').value = d.assessed || 0;
        document.getElementById('input-total-workplaces').value = d.totalWorkplaces || 0;

        // KPI 6
        document.getElementById('input-reports').value = d.reports || 0;

        // KPI 7
        document.getElementById('input-closed-issues').value = d.closedIssues || 0;
        document.getElementById('input-total-issues').value = d.totalIssues || 0;

        // KPI 8
        document.getElementById('input-mm-budget').value = d.mmBudget || 0;
        document.getElementById('input-total-budget').value = d.totalBudget || 0;

        // KPI 9
        document.getElementById('input-ppe-equipped').value = d.ppeEquipped || 0;
        document.getElementById('input-ppe-required').value = d.ppeRequired || 0;

        // KPI 10
        document.getElementById('input-equipment-inspected').value = d.equipmentInspected || 0;
        document.getElementById('input-total-equipment').value = d.equipmentTotal || 0;
        document.getElementById('input-authorized-personnel').value = d.authorizedStaff || 0;
        document.getElementById('input-required-personnel').value = d.totalStaffEquipment || 0;

        // KPI 11
        document.getElementById('input-inspections-conducted').value = d.inspectionDone || 0;
        document.getElementById('input-inspections-planned').value = d.inspectionPlanned || 0;

        // KPI 12
        document.getElementById('input-occupational-diseases').value = d.occupational || 0;

        // KPI 13
        document.getElementById('input-audit-noncompliance').value = d.auditIssues || 0;
        document.getElementById('input-audit-points').value = d.auditTotal || 0;

        // KPI 14
        document.getElementById('input-drills-conducted').value = d.emergencyParticipated || 0;
        document.getElementById('input-drills-planned').value = d.emergencyPlanned || 0;

        // KPI 15
        document.getElementById('input-ticket-red').value = d.ticketRed || 0;
        document.getElementById('input-ticket-yellow').value = d.ticketYellow || 0;
        document.getElementById('input-ticket-green').value = d.ticketGreen || 0;
    }

    document.getElementById('form-title').textContent = '✏️ Korxonani Tahrirlash';
    document.getElementById('save-company-btn').textContent = '💾 Yangilash';
    switchTab('add-company');
}

function resetForm() {
    document.getElementById('company-form').reset();
    currentEditId = null;
    document.getElementById('form-title').textContent = '➕ Yangi Korxona Qo\'shish';
    document.getElementById('save-company-btn').textContent = '💾 Saqlash';

    // Set default values if needed
    document.getElementById('company-profile').value = 'factory';
}

function calculateRankings() {
    companies.sort((a, b) => b.overallIndex - a.overallIndex);
    companies.forEach((company, index) => {
        company.rank = index + 1;
    });
}

// Calculate parent company ratings based on subsidiaries
function calculateParentCompanyRatings() {
    // Get all parent companies (supervisors)
    const parents = companies.filter(c => c.level === 'supervisor');

    parents.forEach(parent => {
        // Find all subsidiaries of this parent
        const subsidiaries = companies.filter(c => c.supervisorId === parent.id);

        if (subsidiaries.length > 0) {
            // Calculate average rating from subsidiaries
            const totalIndex = subsidiaries.reduce((sum, sub) => sum + (sub.overallIndex || 0), 0);
            const avgIndex = totalIndex / subsidiaries.length;

            // Update parent's overall index
            parent.overallIndex = avgIndex;
            parent.zone = getZone(avgIndex).name;

            // Also calculate average KPIs
            if (subsidiaries[0].kpis) {
                const avgKPIs = {};
                const kpiKeys = Object.keys(subsidiaries[0].kpis);

                kpiKeys.forEach(key => {
                    const totalScore = subsidiaries.reduce((sum, sub) =>
                        sum + (sub.kpis[key]?.score || 0), 0);
                    avgKPIs[key] = {
                        value: totalScore / subsidiaries.length,
                        score: Math.round(totalScore / subsidiaries.length)
                    };
                });

                parent.kpis = avgKPIs;
            }
        }
    });
}

// ===================================
// Rendering Functions
// ===================================
// OLD renderDashboard REMOVED - Using robust version below (line ~1633)

function renderStatistics(displayCompanies = companies) {
    document.getElementById('total-companies').textContent = companies.length;

    // Calculate zones dynamically
    const greenCount = companies.filter(c => getZone(c.overallIndex).name === 'green').length;
    const yellowCount = companies.filter(c => getZone(c.overallIndex).name === 'yellow').length;
    const redCount = companies.filter(c => getZone(c.overallIndex).name === 'red').length;

    document.getElementById('green-zone-count').textContent = greenCount;
    document.getElementById('yellow-zone-count').textContent = yellowCount;
    document.getElementById('red-zone-count').textContent = redCount;
}

// ... (renderPodium is fine) ...

// ===================================
// Data Generation
// ===================================
function generateSampleData() {
    const baseKPIs = {
        ltifr: { value: 0, score: 100 },
        trir: { value: 0, score: 100 },
        noincident: { value: 365, score: 100 },
        training: { value: 100, score: 100 },
        raCoverage: { value: 100, score: 100 },
        nearMiss: { value: 120, score: 100 },
        responseTime: { value: 100, score: 100 },
        prevention: { value: 5, score: 100 },
        ppe: { value: 100, score: 100 },
        equipment: { value: 100, score: 100 },
        inspection: { value: 100, score: 100 },
        occupational: { value: 0, score: 100 },
        compliance: { value: 100, score: 100 },
        emergency: { value: 100, score: 100 },
        violations: { value: 0, score: 100 }
    };

    // Helper to create a company with slight variations
    const createCompany = (id, name, level, parent, baseScore, employees) => {
        const kpis = JSON.parse(JSON.stringify(baseKPIs));

        // Vary scores slightly based on baseScore
        Object.keys(kpis).forEach(key => {
            const variance = Math.random() * 20 - 10; // +/- 10
            let score = baseScore + variance;
            score = Math.max(0, Math.min(100, score));
            kpis[key].score = Math.round(score);
        });

        // Force some specific issues for realism
        if (baseScore < 60) {
            kpis.ltifr.score = 20; // High severity accident
            kpis.violations.score = 30; // Discipline issues
        } else if (baseScore < 80) {
            kpis.nearMiss.score = 50; // Low reporting culture
        }

        const overallIndex = calculateOverallIndex(kpis, 'factory'); // Use default profile
        const zone = getZone(overallIndex);

        return {
            id, name, level, parent, employees, totalHours: employees * 2000,
            kpis, overallIndex, zone: zone.name, dateAdded: new Date().toISOString(),
            profile: 'factory'
        };
    };

    const companies = [];

    // 1. Management (Headquarters)
    const mgmtId = 'comp_mgmt_01';
    companies.push(createCompany(mgmtId, "O'zbekiston Temir Yo'llari AJ", 'management', null, 95, 5000));

    // 2. Supervisors (Regional)
    const sup1Id = 'comp_sup_01';
    const sup2Id = 'comp_sup_02';
    companies.push(createCompany(sup1Id, "Toshkent MTU", 'supervisor', mgmtId, 88, 1200));
    companies.push(createCompany(sup2Id, "Qo'qon MTU", 'supervisor', mgmtId, 82, 900));

    // 3. Subsidiaries (Factories/Depots)
    // Under Toshkent MTU
    companies.push(createCompany('comp_sub_01', "Toshkent elektr ta'minoti", 'subsidiary', sup1Id, 92, 350));
    companies.push(createCompany('comp_sub_02', "Salor temir yo'l masofasi", 'subsidiary', sup1Id, 75, 200)); // Yellow
    companies.push(createCompany('comp_sub_03', "Toshkent vagon deposi", 'subsidiary', sup1Id, 45, 450)); // Red

    // Under Qo'qon MTU
    companies.push(createCompany('comp_sub_04', "Qo'qon lokomotiv deposi", 'subsidiary', sup2Id, 85, 300));
    companies.push(createCompany('comp_sub_05', "Andijon signalizatsiya", 'subsidiary', sup2Id, 65, 150)); // Yellow

    return companies;
}

function renderPodium(displayCompanies = companies) {
    const podiumSection = document.getElementById('podium-section');

    if (displayCompanies.length === 0) {
        podiumSection.style.display = 'none';
        return;
    }

    podiumSection.style.display = 'flex';
    podiumSection.innerHTML = '';

    const medals = ['🥇', '🥈', '🥉'];
    const places = ['first', 'second', 'third'];

    for (let i = 0; i < Math.min(3, displayCompanies.length); i++) {
        const company = displayCompanies[i];
        const zone = getZone(company.overallIndex);

        const podiumPlace = document.createElement('div');
        podiumPlace.className = `podium-place ${places[i]}`;
        podiumPlace.innerHTML = `
            <div class="podium-medal">${medals[i]}</div>
            <div class="podium-company">${company.name}</div>
            <div class="podium-index">${company.overallIndex.toFixed(1)}</div>
            <div class="podium-base">
                <div class="zone-badge ${zone.class}">${zone.label}</div>
            </div>
        `;

        podiumSection.appendChild(podiumPlace);
    }
}

// The original renderRankingTable function is now integrated into the new renderDashboard.
// Keeping it commented out or removing it depends on whether it's used elsewhere.
// For this change, it's effectively replaced.

function viewCompanyDetails(id) {
    const company = companies.find(c => c.id === id);
    if (!company) return;

    let details = `Korxona: ${company.name} \n`;
    details += `Xodimlar: ${company.employees} \n`;
    details += `MM Indeksi: ${company.overallIndex.toFixed(1)} \n`;
    details += `Reyting: #${company.rank} \n\n`;
    details += `KPI Ballari: \n`;

    for (const [key, kpi] of Object.entries(company.kpis)) {
        const config = KPI_CONFIG[key];
        details += `${config.name}: ${kpi.score}/100\n`;
    }

    alert(details);
}

// ===================================
// Comparison Functions
// ===================================
function updateComparisonSelection() {
    const container = document.getElementById('comparison-selection');
    const emptyState = document.getElementById('comparison-empty');

    if (companies.length < 2) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.getElementById('compare-btn').disabled = true;
        return;
    }

    emptyState.style.display = 'none';
    document.getElementById('compare-btn').disabled = false;

    container.innerHTML = companies.map(company => `
        <label class="comparison-checkbox">
            <input type="checkbox" value="${company.id}" class="compare-checkbox">
            <span>${company.name}</span>
        </label>
    `).join('');
}

function compareCompanies() {
    const selected = Array.from(document.querySelectorAll('.compare-checkbox:checked')).map(cb => cb.value);

    if (selected.length < 2) {
        alert('Kamida 2 ta korxonani tanlang!');
        return;
    }

    const selectedCompanies = companies.filter(c => selected.includes(c.id));
    renderComparisonTable(selectedCompanies);
    renderComparisonCharts(selectedCompanies);

    document.getElementById('comparison-results').style.display = 'block';
}

function renderComparisonTable(selectedCompanies) {
    const table = document.getElementById('comparison-table');

    let html = '<thead><tr><th>KPI</th>';
    selectedCompanies.forEach(c => {
        html += `<th>${c.name}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Add overall index row
    html += '<tr><td><strong>MM Indeksi</strong></td>';
    const maxIndex = Math.max(...selectedCompanies.map(c => c.overallIndex));
    const minIndex = Math.min(...selectedCompanies.map(c => c.overallIndex));
    selectedCompanies.forEach(c => {
        const isBest = c.overallIndex === maxIndex;
        const isWorst = c.overallIndex === minIndex && selectedCompanies.length > 2;
        html += `<td class="${isBest ? 'best' : isWorst ? 'worst' : ''}">${c.overallIndex.toFixed(1)}</td>`;
    });
    html += '</tr>';

    // Add KPI rows
    for (const [key, config] of Object.entries(KPI_CONFIG)) {
        html += `<tr><td>${config.name}</td>`;

        const scores = selectedCompanies.map(c => c.kpis[key].score);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        selectedCompanies.forEach(c => {
            const score = c.kpis[key].score;
            const isBest = score === maxScore;
            const isWorst = score === minScore && selectedCompanies.length > 2;
            html += `<td class="${isBest ? 'best' : isWorst ? 'worst' : ''}">${score}</td>`;
        });

        html += '</tr>';
    }

    html += '</tbody>';
    table.innerHTML = html;
}

function renderComparisonCharts(selectedCompanies) {
    // Destroy existing charts
    if (comparisonCharts.bar) comparisonCharts.bar.destroy();
    if (comparisonCharts.radar) comparisonCharts.radar.destroy();

    // Bar Chart
    const barCtx = document.getElementById('comparison-chart').getContext('2d');
    const kpiNames = Object.values(KPI_CONFIG).map(c => c.name);

    const datasets = selectedCompanies.map((company, index) => {
        const colors = ['#F56400', '#2d9f5d', '#ffb84d', '#e74c3c', '#3498db'];
        return {
            label: company.name,
            data: Object.keys(KPI_CONFIG).map(key => company.kpis[key].score),
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length],
            borderWidth: 2
        };
    });

    comparisonCharts.bar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: kpiNames,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#222222' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#555555' },
                    grid: { color: '#e0e0e0' }
                },
                x: {
                    ticks: { color: '#555555' },
                    grid: { color: '#e0e0e0' }
                }
            }
        }
    });

    // Radar Chart
    const radarCtx = document.getElementById('radar-chart').getContext('2d');
    comparisonCharts.radar = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: kpiNames,
            datasets: datasets.map(ds => ({
                ...ds,
                fill: true,
                backgroundColor: ds.backgroundColor + '33',
                pointBackgroundColor: ds.backgroundColor,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: ds.backgroundColor
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#222222' }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#555555', backdropColor: 'transparent' },
                    grid: { color: '#e0e0e0' },
                    pointLabels: { color: '#555555' }
                }
            }
        }
    });
}

// ===================================
// Statistics Charts
// ===================================
function renderStatisticsCharts() {
    if (companies.length === 0) return;

    // Index Distribution
    const indexCtx = document.getElementById('index-distribution-chart')?.getContext('2d');
    if (indexCtx) {
        if (comparisonCharts.indexDist) comparisonCharts.indexDist.destroy();

        comparisonCharts.indexDist = new Chart(indexCtx, {
            type: 'bar',
            data: {
                labels: companies.map(c => c.name),
                datasets: [{
                    label: 'MM Indeksi',
                    data: companies.map(c => c.overallIndex),
                    backgroundColor: companies.map(c => {
                        if (c.zone === 'green') return '#2d9f5d';
                        if (c.zone === 'yellow') return '#ffb84d';
                        return '#e74c3c';
                    })
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#222222' } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#555555' },
                        grid: { color: '#e0e0e0' }
                    },
                    x: {
                        ticks: { color: '#555555' },
                        grid: { color: '#e0e0e0' }
                    }
                }
            }
        });
    }

    // Zone Pie Chart
    const pieCtx = document.getElementById('zone-pie-chart')?.getContext('2d');
    if (pieCtx) {
        if (comparisonCharts.zonePie) comparisonCharts.zonePie.destroy();

        const greenCount = companies.filter(c => c.zone === 'green').length;
        const yellowCount = companies.filter(c => c.zone === 'yellow').length;
        const redCount = companies.filter(c => c.zone === 'red').length;

        comparisonCharts.zonePie = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['🟢 Yaxshi', '🟡 Qoniqarli', '🔴 Xavfli'],
                datasets: [{
                    data: [greenCount, yellowCount, redCount],
                    backgroundColor: ['#2d9f5d', '#ffb84d', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#222222' } }
                }
            }
        });
    }

    // Average KPI Scores
    const avgCtx = document.getElementById('avg-kpi-chart')?.getContext('2d');
    if (avgCtx && companies.length > 0) {
        if (comparisonCharts.avgKpi) comparisonCharts.avgKpi.destroy();

        const avgScores = {};
        Object.keys(KPI_CONFIG).forEach(key => {
            const scores = companies.map(c => c.kpis[key].score);
            avgScores[key] = scores.reduce((a, b) => a + b, 0) / scores.length;
        });

        comparisonCharts.avgKpi = new Chart(avgCtx, {
            type: 'bar',
            data: {
                labels: Object.values(KPI_CONFIG).map(c => c.name),
                datasets: [{
                    label: 'O\'rtacha ball',
                    data: Object.values(avgScores),
                    backgroundColor: '#F56400'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#222222' } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#555555' },
                        grid: { color: '#e0e0e0' }
                    },
                    x: {
                        ticks: { color: '#555555' },
                        grid: { color: '#e0e0e0' }
                    }
                }
            }
        });
    }
}

// ===================================
// Tab Navigation
// ===================================
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');

    if (tabName === 'statistics') {
        setTimeout(renderStatisticsCharts, 100);
    }
}

// ===================================
// Form Handling
// ===================================
function resetForm() {
    document.getElementById('company-form').reset();
    currentEditId = null;
    document.getElementById('form-title').textContent = '➕ Yangi Korxona Qo\'shish';
}

function loadSampleData() {
    document.getElementById('company-name').value = 'Xorazm Metall LLC';
    document.getElementById('company-profile').value = 'factory'; // Default to Factory for sample
    document.getElementById('company-employees').value = '190';
    document.getElementById('company-hours').value = '420000';

    // Detailed inputs
    document.getElementById('input-fatal').value = '0';
    document.getElementById('input-severe').value = '1';
    document.getElementById('input-group').value = '0';
    document.getElementById('input-light').value = '2';

    document.getElementById('input-micro-injuries').value = '7';
    document.getElementById('input-noincident').value = '353';

    document.getElementById('input-training-required').value = '50';
    document.getElementById('input-training-passed').value = '48';

    document.getElementById('input-assessed').value = '45';
    document.getElementById('input-total-workplaces').value = '50';

    document.getElementById('input-reports').value = '60';

    document.getElementById('input-closed-issues').value = '35';
    document.getElementById('input-total-issues').value = '40';

    document.getElementById('input-mm-budget').value = '420';
    document.getElementById('input-total-budget').value = '18200';

    document.getElementById('input-ppe-equipped').value = '188';
    document.getElementById('input-ppe-required').value = '190';

    document.getElementById('input-equipment-inspected').value = '14';
    document.getElementById('input-total-equipment').value = '15'; // Updated ID
    document.getElementById('input-authorized-personnel').value = '28'; // Updated ID
    document.getElementById('input-required-personnel').value = '30'; // Updated ID

    document.getElementById('input-inspections-conducted').value = '26'; // Updated ID
    document.getElementById('input-inspections-planned').value = '30'; // Updated ID

    document.getElementById('input-occupational-diseases').value = '1'; // Updated ID

    document.getElementById('input-audit-noncompliance').value = '11'; // Updated ID
    document.getElementById('input-audit-points').value = '120'; // Updated ID

    document.getElementById('input-drills-conducted').value = '162'; // Updated ID
    document.getElementById('input-drills-planned').value = '180'; // Updated ID

    document.getElementById('input-ticket-red').value = '1';
    document.getElementById('input-ticket-yellow').value = '3';
    document.getElementById('input-ticket-green').value = '8';
}

// ===================================
// LocalStorage
// ===================================
function saveToLocalStorage() {
    localStorage.setItem('mm_companies', JSON.stringify(companies));
}

// This function is now handled by the hybrid version above (lines 525-567)
// Removed duplicate to prevent conflicts

// ===================================
// Form Helpers
// ===================================
function updateParentSelect() {
    const levelSelect = document.getElementById('company-level');
    const parentSelect = document.getElementById('company-parent');
    const parentGroup = document.getElementById('parent-select-group');

    if (!levelSelect || !parentSelect) return;

    const level = levelSelect.value;

    // Hide parent select for management level
    if (level === 'management') {
        parentGroup.style.display = 'none';
        return;
    }

    parentGroup.style.display = 'block';

    // Use EXACT SAME structure data as filter (UZ_RAILWAY_DATA)
    const structureData = window.UZ_RAILWAY_DATA || [];

    // Clear and rebuild using SAME logic as createOrganizationSelector
    parentSelect.innerHTML = '<option value="">Tanlang...</option>';

    if (level === 'supervisor') {
        // Supervisors can report to Management
        const management = structureData.filter(c => c.level === 'management');
        if (management.length > 0) {
            const group = document.createElement('optgroup');
            group.label = "🏛️ Boshqaruv";
            management.forEach(org => {
                const option = document.createElement('option');
                option.value = org.id;
                option.textContent = org.name;
                group.appendChild(option);
            });
            parentSelect.appendChild(group);
        }

    } else if (level === 'subsidiary') {
        // Subsidiaries report to Supervisors - USE EXACT SAME GROUPING AS FILTER
        const supervisors = structureData.filter(c => c.level === 'supervisor');

        // Group by parent (same as filter.js)
        const supervisorsByParent = {};
        supervisors.forEach(org => {
            const parentId = org.supervisorId || 'other';
            if (!supervisorsByParent[parentId]) {
                supervisorsByParent[parentId] = [];
            }
            supervisorsByParent[parentId].push(org);
        });

        // Add "Yuqori Tashkilotlar" group
        const group = document.createElement('optgroup');
        group.label = "🏭 Yuqori Tashkilotlar";

        // Direct AJ Supervisors
        if (supervisorsByParent['aj_head']) {
            supervisorsByParent['aj_head'].forEach(org => {
                const option = document.createElement('option');
                option.value = org.id;
                option.textContent = `  📍 ${org.name}`;
                group.appendChild(option);
            });
        }

        parentSelect.appendChild(group);

        // Infrastructure MTUs (under infra_aj) - with separator
        if (supervisorsByParent['infra_aj']) {
            const separator = document.createElement('option');
            separator.disabled = true;
            separator.textContent = "─── Temiryo'linfratuzilma ───";
            parentSelect.appendChild(separator);

            supervisorsByParent['infra_aj'].forEach(org => {
                const option = document.createElement('option');
                option.value = org.id;
                option.textContent = `    🚉 ${org.name}`;
                parentSelect.appendChild(option);
            });
        }
    }
}

// Initialize form listeners
document.addEventListener('DOMContentLoaded', () => {
    const levelSelect = document.getElementById('company-level');
    if (levelSelect) {
        levelSelect.addEventListener('change', updateParentSelect);
        // Call immediately to populate on page load
        updateParentSelect();
    }
});

// ===================================
// Export/Import
// ===================================
function exportData() {
    const data = {
        companies: companies,
        exportDate: new Date().toISOString(),
        version: '2.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MM_Reyting_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('file-input').click();
}

// ===================================
// Event Listeners & Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Form submission
    const form = document.getElementById('company-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const employeesCount = parseInt(document.getElementById('company-employees').value) || 0;

            const formData = {
                name: document.getElementById('company-name').value,
                employees: employeesCount,
                totalHours: employeesCount * 1820,

                // KPI 1
                fatal: document.getElementById('input-fatal').value,
                severe: document.getElementById('input-severe').value,
                group: document.getElementById('input-group').value,
                light: document.getElementById('input-light').value,

                // KPI 2
                microInjuries: document.getElementById('input-micro-injuries').value,

                // KPI 3
                noincident: document.getElementById('input-noincident').value,

                // KPI 4
                trainingRequired: document.getElementById('input-training-required').value,
                trainingPassed: document.getElementById('input-training-passed').value,

                // KPI 5
                assessed: document.getElementById('input-assessed').value,
                totalWorkplaces: document.getElementById('input-total-workplaces').value,

                // KPI 6
                reports: document.getElementById('input-reports').value,

                // KPI 7
                closedIssues: document.getElementById('input-closed-issues').value,
                totalIssues: document.getElementById('input-total-issues').value,

                // KPI 8
                mmBudget: document.getElementById('input-mm-budget').value,
                totalBudget: document.getElementById('input-total-budget').value,

                // KPI 9
                ppeEquipped: document.getElementById('input-ppe-equipped').value,
                ppeRequired: document.getElementById('input-ppe-required').value,

                // KPI 10
                equipmentInspected: document.getElementById('input-equipment-inspected').value,
                equipmentTotal: document.getElementById('input-total-equipment').value,
                authorizedStaff: document.getElementById('input-authorized-personnel').value,
                totalStaffEquipment: document.getElementById('input-required-personnel').value,

                // KPI 11
                inspectionDone: document.getElementById('input-inspections-conducted').value,
                inspectionPlanned: document.getElementById('input-inspections-planned').value,

                // KPI 12
                occupational: document.getElementById('input-occupational-diseases').value,

                // KPI 13
                auditIssues: document.getElementById('input-audit-noncompliance').value,
                auditTotal: document.getElementById('input-audit-points').value,

                // KPI 14
                emergencyParticipated: document.getElementById('input-drills-conducted').value,
                emergencyPlanned: document.getElementById('input-drills-planned').value,

                // KPI 15
                ticketRed: document.getElementById('input-ticket-red').value,
                ticketYellow: document.getElementById('input-ticket-yellow').value,
                ticketGreen: document.getElementById('input-ticket-green').value
            };

            addOrUpdateCompany(formData);
        });
    }

    // Buttons
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            resetForm();
            switchTab('dashboard');
        });
    }

    const compareBtn = document.getElementById('compare-btn');
    if (compareBtn) compareBtn.addEventListener('click', compareCompanies);

    const exportBtn = document.getElementById('export-all-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportData);

    const importBtn = document.getElementById('import-btn');
    if (importBtn) importBtn.addEventListener('click', importData);

    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        if (data.companies) {
                            companies = data.companies;
                            // For Firebase, we might need to loop and save each, but for now let's just render
                            // Or warn user that import only works locally for now
                            alert("Import qilingan ma'lumotlar faqat lokal ko'rinadi. Saqlash uchun har birini tahrirlab saqlash kerak.");
                            renderDashboard();
                            switchTab('dashboard');
                        }
                    } catch (error) {
                        alert('Fayl formatida xatolik!');
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // Initialize
    initializeTabs();
    populateProfileSelect();
    updateParentSelect();
    loadCompanies(); // This will call refreshUI which includes renderDashboard

    console.log('MM Ko\'p Korxonali Reyting Tizimi yuklandi ✅');
});

// ===================================
// Global Rendering Functions
// ===================================

// ===================================
// ROBUST FILTERING & RENDERING SYSTEM
// ===================================

// 1. Clear and Simple Filtering Logic
function getFilteredCompanies() {
    const orgId = selectedOrganizationId;
    const structureData = window.UZ_RAILWAY_DATA || [];

    console.log(`🔍 Filter: "${orgId}", Companies count: ${companies.length}`);

    // CASE 1: Show ALL companies (default)
    if (!orgId || orgId === 'all') {
        if (companies.length > 0) {
            console.log(`✅ Showing all ${companies.length} companies from database`);
            return companies;
        }
        console.log(`⚠️ No companies in database, showing structure (${structureData.length})`);
        return structureData;
    }

    // CASE 2: Filter by organization
    // First, try to find the organization in loaded companies
    let selectedOrg = companies.find(c => c.id === orgId);

    // If not found, try structure data
    if (!selectedOrg) {
        selectedOrg = structureData.find(c => c.id === orgId);
        console.log(`📋 Organization "${orgId}" found in structure:`, selectedOrg ? 'Yes' : 'No');
    }

    // CASE 2a: "O'zbekiston Temir Yo'llari AJ" selected
    // Show all supervisors (parent companies)
    if (orgId === 'aj_head' || (selectedOrg && selectedOrg.id === 'aj_head')) {
        const supervisors = companies.filter(c =>
            c.level === 'supervisor' && c.supervisorId === 'aj_head'
        );

        if (supervisors.length > 0) {
            console.log(`✅ Showing ${supervisors.length} supervisors under AJ`);
            return supervisors;
        }

        // Fallback: show structure supervisors
        const structureSupervisors = structureData.filter(c =>
            c.level === 'supervisor' && c.supervisorId === 'aj_head'
        );
        console.log(`⚠️ No supervisors in database, showing ${structureSupervisors.length} from structure`);
        return structureSupervisors;
    }

    // CASE 2b: Parent company (supervisor) selected
    // Show all subsidiaries of this parent
    if (selectedOrg && selectedOrg.level === 'supervisor') {
        const subsidiaries = companies.filter(c => c.supervisorId === orgId);

        if (subsidiaries.length > 0) {
            console.log(`✅ Showing ${subsidiaries.length} subsidiaries under "${selectedOrg.name}"`);
            return subsidiaries;
        }

        // Fallback: show structure subsidiaries
        const structureSubsidiaries = structureData.filter(c => c.supervisorId === orgId);
        console.log(`⚠️ No subsidiaries in database, showing ${structureSubsidiaries.length} from structure`);
        return structureSubsidiaries;
    }

    // CASE 2c: Try to find children by supervisorId (fallback)
    const children = companies.filter(c => c.supervisorId === orgId);
    if (children.length > 0) {
        console.log(`✅ Found ${children.length} children with supervisorId="${orgId}"`);
        return children;
    }

    // CASE 3: Single company selected or no match
    if (selectedOrg) {
        console.log(`✅ Showing single company: "${selectedOrg.name}"`);
        return [selectedOrg];
    }

    // CASE 4: No match found
    console.log(`⚠️ No match found for "${orgId}", showing all companies`);
    return companies.length > 0 ? companies : structureData;
}

// 2. Main Render Function
function renderDashboard() {
    // Get filtered data
    const displayCompanies = getFilteredCompanies();
    console.log(`📊 Render Dashboard: ${displayCompanies.length} companies for filter '${selectedOrganizationId}'`);

    // Update UI components
    renderStatistics(displayCompanies);
    renderPodium(displayCompanies);
    renderRankingTable(displayCompanies);

    updateComparisonSelection();
    renderStatisticsCharts(displayCompanies);
    renderRiskAnalysis(displayCompanies);
}

// 3. Robust Table Rendering
function renderRankingTable(displayCompanies) {
    // Safety check: if argument is missing, use global companies
    const data = displayCompanies || companies;

    const tbody1 = document.getElementById('ranking-tbody');
    const tbody2 = document.getElementById('ranking-table-body');
    const emptyState = document.getElementById('empty-state');

    // Clear existing content
    if (tbody1) tbody1.innerHTML = '';
    if (tbody2) tbody2.innerHTML = '';

    // Handle Empty State
    if (!data || data.length === 0) {
        if (tbody2) tbody2.innerHTML = '<tr><td colspan="6" class="empty-msg">Ma\'lumotlar yo\'q. Korxona qo\'shing.</td></tr>';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    // Hide empty state
    if (emptyState) emptyState.style.display = 'none';

    // Sort by score descending
    const sortedCompanies = [...data].sort((a, b) => b.overallIndex - a.overallIndex);

    // Generate HTML
    const tableHTML = sortedCompanies.map((company, index) => {
        const zone = getZone(company.overallIndex);
        return `
        <tr>
            <td>
                <div class="rank-badge ${index < 3 ? 'top3' : ''}">${index + 1}</div>
            </td>
            <td>
                <div class="company-info">
                    <div class="company-name">${company.name}</div>
                    <div class="company-meta">${company.profile || 'Korxona'}</div>
                </div>
            </td>
            <td>${company.employees}</td>
            <td>
                <div class="index-display">${company.overallIndex.toFixed(1)}</div>
            </td>
            <td><span class="zone-badge ${zone.class}">${zone.label}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon" onclick="viewCompanyDetails('${company.id}')" title="Ko'rish">👁️</button>
                    <button class="btn-icon" onclick="editCompany('${company.id}')" title="Tahrirlash">✏️</button>
                    <button class="btn-icon" onclick="deleteCompany('${company.id}')" title="O'chirish">🗑️</button>
                </div>
            </td>
        </tr>
        `;
    }).join('');

    // Inject HTML
    if (tbody1) tbody1.innerHTML = tableHTML;
    if (tbody2) tbody2.innerHTML = tableHTML;
}

function renderRiskAnalysis(displayCompanies = companies) {
    const container = document.getElementById('risk-analysis-container');
    if (!container) return;

    if (displayCompanies.length === 0) {
        container.innerHTML = '<div class="empty-state">Tahlil qilish uchun korxonalar mavjud emas.</div>';
        return;
    }

    // Re-calculate zones to be safe
    const redCompanies = displayCompanies.filter(c => getZone(c.overallIndex).name === 'red');
    const yellowCompanies = displayCompanies.filter(c => getZone(c.overallIndex).name === 'yellow');
    const greenCompanies = displayCompanies.filter(c => getZone(c.overallIndex).name === 'green');

    let html = `
    <div class="risk-dashboard">
        <div class="risk-column red-column">
            <h3>🔴 Yuqori Xavf (${redCompanies.length})</h3>
            <div class="risk-list">
                ${redCompanies.length ? redCompanies.map(c => createRiskCard(c)).join('') : '<p class="empty-msg">Toza</p>'}
            </div>
        </div>
        <div class="risk-column yellow-column">
            <h3>🟡 O'rta Xavf (${yellowCompanies.length})</h3>
            <div class="risk-list">
                ${yellowCompanies.length ? yellowCompanies.map(c => createRiskCard(c)).join('') : '<p class="empty-msg">Toza</p>'}
            </div>
        </div>
         <div class="risk-column green-column">
            <h3>🟢 Past Xavf (${greenCompanies.length})</h3>
            <div class="risk-list">
                ${greenCompanies.length ? greenCompanies.map(c => createRiskCard(c)).join('') : '<p class="empty-msg">Toza</p>'}
            </div>
        </div>
    </div>
`;

    container.innerHTML = html;
}

function createRiskCard(company) {
    // Find worst KPIs (lowest scores)
    const worstKPIs = Object.entries(company.kpis)
        .sort(([, a], [, b]) => a.score - b.score)
        .slice(0, 3);

    return `
    <div class="risk-card">
        <div class="risk-header">
            <strong>${company.name}</strong>
            <span class="risk-score">${company.overallIndex.toFixed(1)}</span>
        </div>
        <div class="worst-kpis">
            <small>Muammoli sohalar:</small>
            <ul>
                ${worstKPIs.map(([key, val]) => `
                    <li>${KPI_CONFIG[key].name}: <strong>${val.score}</strong></li>
                `).join('')}
            </ul>
        </div>
        <button class="btn-sm btn-outline" onclick="viewCompanyDetails('${company.id}')">Tahlil</button>
    </div>
`;
}

function exportTableToExcel(tableId, filename = 'reyting_jadvali') {
    const table = document.getElementById(tableId);
    if (!table) return;

    let downloadLink;
    const dataType = 'application/vnd.ms-excel';
    const tableHTML = table.outerHTML.replace(/ /g, '%20');

    filename = filename ? filename + '.xls' : 'excel_data.xls';

    downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        downloadLink.download = filename;
        downloadLink.click();
    }
}

// renderDashboard now includes all necessary renders
// No override needed - integrated directly

function initializeTabs() {
    // Set default tab
    switchTab('dashboard');
}

function populateProfileSelect() {
    // This function ensures the profile select is populated correctly
    // Currently profiles are hardcoded in HTML, but we can enhance this later
    // For now, it's a placeholder to prevent errors
}

// ===================================
// Organization Filtering Functions
// ===================================

function initializeOrganizationFilter() {
    const container = document.getElementById('organization-filter-container');
    if (!container) return;

    // Use Firebase/Database companies if available, otherwise use structure
    // This ensures filter shows actual saved organizations
    const structureData = window.UZ_RAILWAY_DATA || [];
    const dataSource = companies.length > 0 ? companies : structureData;

    // Create selector HTML using actual database data
    container.innerHTML = createOrganizationSelector(dataSource);

    // Attach event listener
    const select = document.getElementById('org-filter');
    if (select) {
        // Set default value to 'all' to show all entered companies
        select.value = selectedOrganizationId || 'all';

        select.addEventListener('change', (e) => {
            selectedOrganizationId = e.target.value;
            applyOrganizationFilter();
        });
    }
}

function applyOrganizationFilter() {
    console.log('🔍 Filtrlash:', selectedOrganizationId);

    // Update ranking title and context
    updateRankingContext();

    // Re-render dashboard with filtered data
    renderDashboard();
}

function updateRankingContext() {
    const titleEl = document.getElementById('ranking-title');
    const contextEl = document.getElementById('ranking-context');

    if (!titleEl || !contextEl) return;

    // Look up in structure data first (for static info like name), then in loaded companies
    const structureData = window.UZ_RAILWAY_DATA || [];
    const selectedOrg = structureData.find(c => c.id === selectedOrganizationId) || companies.find(c => c.id === selectedOrganizationId);

    const context = getRankingContext(selectedOrg);

    // Update title
    titleEl.textContent = context.title;

    // Update context box
    if (selectedOrganizationId === 'all') {
        contextEl.classList.remove('active');
    } else {
        contextEl.classList.add('active');
        contextEl.innerHTML = `
            <h3>
                📊 ${context.title}
                <span class="context-badge">${context.level === 'supervisor' ? 'Yuqori tashkilotlar' : 'Korxonalar'}</span>
            </h3>
            <p>${context.description}</p>
        `;
    }
}

// OLD getFilteredCompanies REMOVED - Using integrated version above


// ===================================
// Data Reset Function
// ===================================
function resetData() {
    if (confirm("Diqqat! Barcha lokal ma'lumotlar o'chiriladi va standart holatga qaytariladi. Davom etasizmi?")) {
        localStorage.removeItem('mm_companies');
        location.reload();
    }
}
