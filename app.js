// ===================================
// KPI Configuration (Same as before)
// ===================================
const KPI_CONFIG = {
    ltifr: { name: "LTIFR", weight: 0.12, lowerIsBetter: true },
    trir: { name: "TRIR", weight: 0.10, lowerIsBetter: true },
    noincident: { name: "Noincident", weight: 0.08, lowerIsBetter: false },
    training: { name: "O'quv", weight: 0.06, lowerIsBetter: false },
    raCoverage: { name: "RA Coverage", weight: 0.08, lowerIsBetter: false },
    nearMiss: { name: "Near Miss", weight: 0.06, lowerIsBetter: false },
    responseTime: { name: "Javob tezligi", weight: 0.08, lowerIsBetter: true },
    prevention: { name: "Profilaktika", weight: 0.08, lowerIsBetter: false },
    ppe: { name: "SHHV", weight: 0.06, lowerIsBetter: false },
    equipment: { name: "Uskuna", weight: 0.05, lowerIsBetter: false },
    inspection: { name: "Inspeksiya", weight: 0.08, lowerIsBetter: false },
    occupational: { name: "Kasbiy kasallik", weight: 0.05, lowerIsBetter: true },
    compliance: { name: "Rioya", weight: 0.05, lowerIsBetter: false },
    emergency: { name: "FV tayyorgarlik", weight: 0.05, lowerIsBetter: false },
    violations: { name: "Buzilishlar", weight: 0.08, lowerIsBetter: true }
};

// ===================================
// Global State
// ===================================
let companies = [];
let currentEditId = null;
let comparisonCharts = {};

// ===================================
// KPI Calculator Class
// ===================================
class KPICalculator {
    constructor(companyData) {
        this.company = companyData;
    }

    calculateLTIFR(accidents) {
        return this.company.totalHours > 0 ? (accidents / this.company.totalHours) * 1000000 : 0;
    }

    calculateTRIR(injuries) {
        return this.company.totalHours > 0 ? (injuries / this.company.totalHours) * 1000000 : 0;
    }

    calculateNoincident(days) {
        return (days / 365) * 100;
    }

    calculateTraining(trained) {
        return this.company.employees > 0 ? (trained / this.company.employees) * 100 : 0;
    }

    calculateRACoverage(assessed, total) {
        return total > 0 ? (assessed / total) * 100 : 0;
    }

    calculateNearMiss(count) {
        return this.company.employees > 0 ? count / this.company.employees : 0;
    }

    calculateResponseTime(days, requests) {
        return requests > 0 ? days / requests : 0;
    }

    calculatePrevention(mmBudget, totalBudget) {
        return totalBudget > 0 ? (mmBudget / totalBudget) * 100 : 0;
    }

    calculatePPE(equipped) {
        return this.company.employees > 0 ? (equipped / this.company.employees) * 100 : 0;
    }

    calculateEquipment(inspected, total) {
        return total > 0 ? (inspected / total) * 100 : 0;
    }

    calculateInspection(completed, planned) {
        return planned > 0 ? (completed / planned) * 100 : 0;
    }

    calculateOccupational(count) {
        return count;
    }

    calculateCompliance(nonCompliance, totalPoints) {
        return totalPoints > 0 ? (1 - (nonCompliance / totalPoints)) * 100 : 0;
    }

    calculateEmergency(participated, planned) {
        return planned > 0 ? (participated / planned) * 100 : 0;
    }

    calculateViolations(count) {
        return this.company.employees > 0 ? (count / this.company.employees) * 100 : 0;
    }
}

// ===================================
// Normalization Functions
// ===================================
function normalizeKPI(value, kpiKey) {
    let score = 0;

    switch (kpiKey) {
        case 'ltifr':
            score = Math.max(0, 100 - (value * 20));
            break;
        case 'trir':
            score = Math.max(0, 100 - (value * 10));
            break;
        case 'noincident':
        case 'training':
        case 'raCoverage':
        case 'ppe':
        case 'equipment':
        case 'inspection':
        case 'compliance':
        case 'emergency':
            score = Math.min(100, value);
            break;
        case 'nearMiss':
            score = Math.min(100, (value / 0.5) * 100);
            break;
        case 'responseTime':
            if (value <= 1) score = 100;
            else if (value <= 3) score = 100 - ((value - 1) * 20);
            else score = Math.max(0, 100 - ((value - 1) * 25));
            break;
        case 'prevention':
            if (value >= 2 && value <= 5) score = 100;
            else if (value < 2) score = (value / 2) * 100;
            else score = Math.max(0, 100 - ((value - 5) * 10));
            break;
        case 'occupational':
            score = Math.max(0, 100 - (value * 50));
            break;
        case 'violations':
            score = Math.max(0, 100 - (value * 10));
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
function calculateOverallIndex(kpiResults) {
    let totalScore = 0;
    let totalWeight = 0;

    for (const [key, result] of Object.entries(kpiResults)) {
        const config = KPI_CONFIG[key];
        if (config && result.score !== undefined) {
            totalScore += result.score * config.weight;
            totalWeight += config.weight;
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
        value: calculator.calculateLTIFR(parseFloat(formData.accidents) || 0),
        score: 0
    };
    kpiResults.ltifr.score = normalizeKPI(kpiResults.ltifr.value, 'ltifr');

    kpiResults.trir = {
        value: calculator.calculateTRIR(parseFloat(formData.injuries) || 0),
        score: 0
    };
    kpiResults.trir.score = normalizeKPI(kpiResults.trir.value, 'trir');

    kpiResults.noincident = {
        value: calculator.calculateNoincident(parseFloat(formData.noincident) || 0),
        score: 0
    };
    kpiResults.noincident.score = normalizeKPI(kpiResults.noincident.value, 'noincident');

    kpiResults.training = {
        value: calculator.calculateTraining(parseFloat(formData.trained) || 0),
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
        value: calculator.calculateNearMiss(parseFloat(formData.nearMiss) || 0),
        score: 0
    };
    kpiResults.nearMiss.score = normalizeKPI(kpiResults.nearMiss.value, 'nearMiss');

    kpiResults.responseTime = {
        value: calculator.calculateResponseTime(
            parseFloat(formData.responseDays) || 0,
            parseFloat(formData.requests) || 1
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
        value: calculator.calculatePPE(parseFloat(formData.ppe) || 0),
        score: 0
    };
    kpiResults.ppe.score = normalizeKPI(kpiResults.ppe.value, 'ppe');

    kpiResults.equipment = {
        value: calculator.calculateEquipment(
            parseFloat(formData.equipmentInspected) || 0,
            parseFloat(formData.totalEquipment) || 1
        ),
        score: 0
    };
    kpiResults.equipment.score = normalizeKPI(kpiResults.equipment.value, 'equipment');

    kpiResults.inspection = {
        value: calculator.calculateInspection(
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
        value: calculator.calculateCompliance(
            parseFloat(formData.nonCompliance) || 0,
            parseFloat(formData.totalPoints) || 1
        ),
        score: 0
    };
    kpiResults.compliance.score = normalizeKPI(kpiResults.compliance.value, 'compliance');

    kpiResults.emergency = {
        value: calculator.calculateEmergency(
            parseFloat(formData.emergencyParticipated) || 0,
            parseFloat(formData.emergencyPlanned) || 1
        ),
        score: 0
    };
    kpiResults.emergency.score = normalizeKPI(kpiResults.emergency.value, 'emergency');

    kpiResults.violations = {
        value: calculator.calculateViolations(parseFloat(formData.violations) || 0),
        score: 0
    };
    kpiResults.violations.score = normalizeKPI(kpiResults.violations.value, 'violations');

    return kpiResults;
}

// ===================================
// Company Management
// ===================================
function addOrUpdateCompany(formData) {
    const kpis = calculateCompanyKPIs(formData);
    const overallIndex = calculateOverallIndex(kpis);
    const zone = getZone(overallIndex);

    const company = {
        id: currentEditId || generateId(),
        name: formData.name,
        employees: parseFloat(formData.employees),
        totalHours: parseFloat(formData.totalHours),
        kpis: kpis,
        overallIndex: overallIndex,
        zone: zone.name,
        dateAdded: currentEditId ? companies.find(c => c.id === currentEditId).dateAdded : new Date().toISOString()
    };

    if (currentEditId) {
        const index = companies.findIndex(c => c.id === currentEditId);
        companies[index] = company;
        currentEditId = null;
    } else {
        companies.push(company);
    }

    calculateRankings();
    saveToLocalStorage();
    renderDashboard();
    switchTab('dashboard');
    resetForm();
}

function deleteCompany(id) {
    if (confirm('Bu korxonani o\'chirmoqchimisiz?')) {
        companies = companies.filter(c => c.id !== id);
        calculateRankings();
        saveToLocalStorage();
        renderDashboard();
    }
}

function editCompany(id) {
    const company = companies.find(c => c.id === id);
    if (!company) return;

    currentEditId = id;

    // Fill form with company data
    document.getElementById('company-name').value = company.name;
    document.getElementById('company-employees').value = company.employees;
    document.getElementById('company-hours').value = company.totalHours;

    // Note: You would need to store raw input data to properly restore form
    // For now, we'll just switch to the form
    document.getElementById('form-title').textContent = '✏️ Korxonani Tahrirlash';
    switchTab('add-company');
}

function calculateRankings() {
    companies.sort((a, b) => b.overallIndex - a.overallIndex);
    companies.forEach((company, index) => {
        company.rank = index + 1;
    });
}

function generateId() {
    return 'company_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===================================
// Rendering Functions
// ===================================
function renderDashboard() {
    renderStatistics();
    renderPodium();
    renderRankingTable();
    updateComparisonSelection();
    renderStatisticsCharts();
}

function renderStatistics() {
    document.getElementById('total-companies').textContent = companies.length;
    document.getElementById('green-zone-count').textContent = companies.filter(c => c.zone === 'green').length;
    document.getElementById('yellow-zone-count').textContent = companies.filter(c => c.zone === 'yellow').length;
    document.getElementById('red-zone-count').textContent = companies.filter(c => c.zone === 'red').length;
}

function renderPodium() {
    const podiumSection = document.getElementById('podium-section');

    if (companies.length === 0) {
        podiumSection.style.display = 'none';
        return;
    }

    podiumSection.style.display = 'flex';
    podiumSection.innerHTML = '';

    const medals = ['🥇', '🥈', '🥉'];
    const places = ['first', 'second', 'third'];

    for (let i = 0; i < Math.min(3, companies.length); i++) {
        const company = companies[i];
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

function renderRankingTable() {
    const tbody = document.getElementById('ranking-tbody');
    const emptyState = document.getElementById('empty-state');
    const table = document.querySelector('.ranking-table');

    if (companies.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';
    tbody.innerHTML = '';

    companies.forEach(company => {
        const zone = getZone(company.overallIndex);
        const row = document.createElement('tr');
        row.className = 'slide-up';
        row.innerHTML = `
            <td>
                <div class="rank-badge ${company.rank <= 3 ? 'top3' : ''}">
                    ${company.rank}
                </div>
            </td>
            <td>
                <div class="company-info">
                    <div class="company-name">${company.name}</div>
                    <div class="company-meta">Qo'shilgan: ${new Date(company.dateAdded).toLocaleDateString('uz-UZ')}</div>
                </div>
            </td>
            <td>${company.employees}</td>
            <td>
                <div class="index-display">${company.overallIndex.toFixed(1)}</div>
            </td>
            <td>
                <span class="zone-badge ${zone.class}">${zone.label}</span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon" onclick="viewCompanyDetails('${company.id}')" title="Batafsil">👁️</button>
                    <button class="btn-icon" onclick="editCompany('${company.id}')" title="Tahrirlash">✏️</button>
                    <button class="btn-icon" onclick="deleteCompany('${company.id}')" title="O'chirish">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewCompanyDetails(id) {
    const company = companies.find(c => c.id === id);
    if (!company) return;

    let details = `Korxona: ${company.name}\n`;
    details += `Xodimlar: ${company.employees}\n`;
    details += `MM Indeksi: ${company.overallIndex.toFixed(1)}\n`;
    details += `Reyting: #${company.rank}\n\n`;
    details += `KPI Ballari:\n`;

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
        const colors = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
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
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#b4b8d4' },
                    grid: { color: '#2d3748' }
                },
                x: {
                    ticks: { color: '#b4b8d4' },
                    grid: { color: '#2d3748' }
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
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#b4b8d4', backdropColor: 'transparent' },
                    grid: { color: '#2d3748' },
                    pointLabels: { color: '#b4b8d4' }
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
                        if (c.zone === 'green') return '#10b981';
                        if (c.zone === 'yellow') return '#f59e0b';
                        return '#ef4444';
                    })
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#ffffff' } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#b4b8d4' },
                        grid: { color: '#2d3748' }
                    },
                    x: {
                        ticks: { color: '#b4b8d4' },
                        grid: { color: '#2d3748' }
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
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#ffffff' } }
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
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#ffffff' } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#b4b8d4' },
                        grid: { color: '#2d3748' }
                    },
                    x: {
                        ticks: { color: '#b4b8d4' },
                        grid: { color: '#2d3748' }
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
    document.getElementById('company-employees').value = '190';
    document.getElementById('company-hours').value = '420000';
    document.getElementById('input-accidents').value = '2';
    document.getElementById('input-injuries').value = '7';
    document.getElementById('input-noincident').value = '353';
    document.getElementById('input-trained').value = '186';
    document.getElementById('input-assessed').value = '45';
    document.getElementById('input-total-workplaces').value = '50';
    document.getElementById('input-nearmiss').value = '60';
    document.getElementById('input-response-days').value = '84';
    document.getElementById('input-requests').value = '40';
    document.getElementById('input-mm-budget').value = '420';
    document.getElementById('input-total-budget').value = '18200';
    document.getElementById('input-ppe').value = '188';
    document.getElementById('input-equipment-inspected').value = '142';
    document.getElementById('input-total-equipment').value = '150';
    document.getElementById('input-inspection-done').value = '26';
    document.getElementById('input-inspection-planned').value = '30';
    document.getElementById('input-occupational').value = '1';
    document.getElementById('input-noncompliance').value = '11';
    document.getElementById('input-total-points').value = '120';
    document.getElementById('input-emergency-participated').value = '162';
    document.getElementById('input-emergency-planned').value = '180';
    document.getElementById('input-violations').value = '14';
}

// ===================================
// LocalStorage
// ===================================
function saveToLocalStorage() {
    localStorage.setItem('mmCompanies', JSON.stringify(companies));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('mmCompanies');
    if (saved) {
        companies = JSON.parse(saved);
        calculateRankings();
        renderDashboard();
    }
}

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
// Event Listeners
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Form submission
    document.getElementById('company-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('company-name').value,
            employees: document.getElementById('company-employees').value,
            totalHours: document.getElementById('company-hours').value,
            accidents: document.getElementById('input-accidents').value,
            injuries: document.getElementById('input-injuries').value,
            noincident: document.getElementById('input-noincident').value,
            trained: document.getElementById('input-trained').value,
            assessed: document.getElementById('input-assessed').value,
            totalWorkplaces: document.getElementById('input-total-workplaces').value,
            nearMiss: document.getElementById('input-nearmiss').value,
            responseDays: document.getElementById('input-response-days').value,
            requests: document.getElementById('input-requests').value,
            mmBudget: document.getElementById('input-mm-budget').value,
            totalBudget: document.getElementById('input-total-budget').value,
            ppe: document.getElementById('input-ppe').value,
            equipmentInspected: document.getElementById('input-equipment-inspected').value,
            totalEquipment: document.getElementById('input-total-equipment').value,
            inspectionDone: document.getElementById('input-inspection-done').value,
            inspectionPlanned: document.getElementById('input-inspection-planned').value,
            occupational: document.getElementById('input-occupational').value,
            nonCompliance: document.getElementById('input-noncompliance').value,
            totalPoints: document.getElementById('input-total-points').value,
            emergencyParticipated: document.getElementById('input-emergency-participated').value,
            emergencyPlanned: document.getElementById('input-emergency-planned').value,
            violations: document.getElementById('input-violations').value
        };

        addOrUpdateCompany(formData);
    });

    // Buttons
    document.getElementById('load-sample-btn').addEventListener('click', loadSampleData);
    document.getElementById('cancel-btn').addEventListener('click', () => {
        resetForm();
        switchTab('dashboard');
    });
    document.getElementById('compare-btn').addEventListener('click', compareCompanies);
    document.getElementById('export-all-btn').addEventListener('click', exportData);
    document.getElementById('import-btn').addEventListener('click', importData);

    // File import
    document.getElementById('file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    companies = data.companies || [];
                    calculateRankings();
                    saveToLocalStorage();
                    renderDashboard();
                    alert('Ma\'lumotlar muvaffaqiyatli yuklandi!');
                } catch (error) {
                    alert('Fayl formatida xatolik!');
                }
            };
            reader.readAsText(file);
        }
    });

    // Load saved data
    loadFromLocalStorage();

    console.log('MM Ko\'p Korxonali Reyting Tizimi yuklandi ✅');
});
