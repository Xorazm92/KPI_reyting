// O'zbekiston Temir Yo'llari AJ - Tashkiliy Tuzilma Ma'lumotlari

// Make these globally accessible
window.KPI_WEIGHTS = {
    'road': { // Йўл хўжалиги
        'ltifr': 0.25, 'trir': 0.10, 'noincident': 0.05, 'training': 0.05, 'raCoverage': 0.08,
        'nearMiss': 0.06, 'responseTime': 0.05, 'prevention': 0.04, 'ppe': 0.08, 'equipment': 0.06,
        'inspection': 0.05, 'occupational': 0.03, 'compliance': 0.04, 'emergency': 0.02, 'violations': 0.04
    },
    'wagon': { // Вагон хўжалиги
        'ltifr': 0.25, 'trir': 0.10, 'noincident': 0.05, 'training': 0.06, 'raCoverage': 0.08,
        'nearMiss': 0.06, 'responseTime': 0.04, 'prevention': 0.04, 'ppe': 0.06, 'equipment': 0.08,
        'inspection': 0.05, 'occupational': 0.05, 'compliance': 0.04, 'emergency': 0.02, 'violations': 0.02
    },
    'locomotive': { // Lokomotiv xo'jaligi
        'ltifr': 0.30, 'trir': 0.10, 'noincident': 0.05, 'training': 0.05, 'raCoverage': 0.08,
        'nearMiss': 0.05, 'responseTime': 0.05, 'prevention': 0.05, 'ppe': 0.05, 'equipment': 0.10,
        'inspection': 0.05, 'occupational': 0.02, 'compliance': 0.03, 'emergency': 0.01, 'violations': 0.01
    },
    'electric': { // Электр ва Алоқа
        'ltifr': 0.25, 'trir': 0.08, 'noincident': 0.05, 'training': 0.08, 'raCoverage': 0.08,
        'nearMiss': 0.06, 'responseTime': 0.05, 'prevention': 0.04, 'ppe': 0.08, 'equipment': 0.05,
        'inspection': 0.05, 'occupational': 0.03, 'compliance': 0.06, 'emergency': 0.02, 'violations': 0.02
    },
    'traffic': { // Ҳаракатни Бошқариш
        'ltifr': 0.20, 'trir': 0.05, 'noincident': 0.08, 'training': 0.10, 'raCoverage': 0.05,
        'nearMiss': 0.10, 'responseTime': 0.08, 'prevention': 0.05, 'ppe': 0.02, 'equipment': 0.02,
        'inspection': 0.08, 'occupational': 0.02, 'compliance': 0.10, 'emergency': 0.04, 'violations': 0.01
    },
    'factory': { // Заводлар
        'ltifr': 0.25, 'trir': 0.10, 'noincident': 0.05, 'training': 0.05, 'raCoverage': 0.08,
        'nearMiss': 0.06, 'responseTime': 0.04, 'prevention': 0.05, 'ppe': 0.06, 'equipment': 0.08,
        'inspection': 0.05, 'occupational': 0.04, 'compliance': 0.04, 'emergency': 0.03, 'violations': 0.02
    }
};

window.DEPARTMENT_PROFILES = [
    { id: 'road', name: 'Йўл хўжалиги (Физик хавф юқори)' },
    { id: 'wagon', name: 'Вагон хўжалиги (Технологик хавф)' },
    { id: 'locomotive', name: 'Lokomotiv xo\'jaligi (Yuqori xavf)' },
    { id: 'electric', name: 'Электр ва Алоқа (Электрохавфсизлик)' },
    { id: 'traffic', name: 'Ҳаракатни Бошқариш (Инсон омили хавфи)' },
    { id: 'factory', name: 'Заводлар (Саноат хавфсизлиги)' }
];

// Keep const for backward compatibility
const KPI_WEIGHTS = window.KPI_WEIGHTS;
const DEPARTMENT_PROFILES = window.DEPARTMENT_PROFILES;

// Helper to generate empty KPIs for clean start
function getEmptyKPIs() {
    const kpis = {};
    const keys = [
        'ltifr', 'trir', 'noincident', 'training', 'raCoverage',
        'nearMiss', 'responseTime', 'prevention', 'ppe', 'equipment',
        'inspection', 'occupational', 'compliance', 'emergency', 'violations'
    ];

    keys.forEach(key => {
        kpis[key] = {
            value: 0,
            score: 0
        };
    });

    return kpis;
}

const UZ_RAILWAY_DATA = [
    // 1-Daraja: Boshqaruv
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

    // 2-Daraja: Asosiy Platformalar va Direksiyalar
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
        level: 'subsidiary', // Zavod o'zi hisobot beradi
        supervisorId: 'aj_head',
        riskGroup: 'high',
        employees: 1200,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },

    // 3-Daraja: Temiryo'linfratuzilma tarkibidagi MTUlar (Mintaqaviy Temir Yo'l Uzellari)
    // Bular ham o'z hududida "supervisor" hisoblanadi
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

    // 4-Daraja: Filiallar (MTUlar tarkibida)
    // Toshkent MTU
    { id: 'salor_masofa', name: "Salor temir yo'l masofasi", level: 'subsidiary', supervisorId: 'toshkent_mtu', riskGroup: 'high', employees: 150, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'toshkent_masofa', name: "Toshkent temir yo'l masofasi", level: 'subsidiary', supervisorId: 'toshkent_mtu', riskGroup: 'high', employees: 200, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'xovos_masofa', name: "Xovos temir yo'l masofasi", level: 'subsidiary', supervisorId: 'toshkent_mtu', riskGroup: 'high', employees: 180, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'toshkent_elektr', name: "Toshkent elektr ta'minoti", level: 'subsidiary', supervisorId: 'toshkent_mtu', riskGroup: 'high', employees: 120, overallIndex: 0, kpis: getEmptyKPIs() },

    // Qo'qon MTU
    { id: 'qoqon_depo', name: "Qo'qon lokomotiv deposi", level: 'subsidiary', supervisorId: 'qoqon_mtu', riskGroup: 'high', employees: 450, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'andijon_depo', name: "Andijon lokomotiv deposi", level: 'subsidiary', supervisorId: 'qoqon_mtu', riskGroup: 'high', employees: 300, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'qoqon_masofa', name: "Qo'qon temir yo'l masofasi", level: 'subsidiary', supervisorId: 'qoqon_mtu', riskGroup: 'high', employees: 220, overallIndex: 0, kpis: getEmptyKPIs() },

    // Buxoro MTU
    { id: 'buxoro_depo', name: "Buxoro lokomotiv deposi", level: 'subsidiary', supervisorId: 'buxoro_mtu', riskGroup: 'high', employees: 380, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'tinchlik_depo', name: "Tinchlik lokomotiv deposi", level: 'subsidiary', supervisorId: 'buxoro_mtu', riskGroup: 'high', employees: 250, overallIndex: 0, kpis: getEmptyKPIs() },

    // O'ztemiryo'lyo'lovchi tarkibi
    { id: 'vokzallar', name: "\"Temiryo'lvokzallari\" MChJ", level: 'subsidiary', supervisorId: 'yolovchi_aj', riskGroup: 'medium', employees: 800, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'shahar_atrofi', name: "\"Shahar atrofida yo'lovchi tashish\" MChJ", level: 'subsidiary', supervisorId: 'yolovchi_aj', riskGroup: 'medium', employees: 400, overallIndex: 0, kpis: getEmptyKPIs() },

    // Boshqa AJlar
    { id: 'vagon_tamir', name: "\"O'zvagonta'mir\" AJ", level: 'subsidiary', supervisorId: 'aj_head', riskGroup: 'high', employees: 600, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'konteyner', name: "\"O'ztemiryo'lkontener\" AJ", level: 'subsidiary', supervisorId: 'aj_head', riskGroup: 'medium', employees: 350, overallIndex: 0, kpis: getEmptyKPIs() },

    // Yangi qo'shilgan yuqori tashkilotlar (to'g'ridan-to'g'ri AJ ga hisobot beradi)
    {
        id: 'energiya_poezd',
        name: "1-son Energiyamontaj poezdi",
        level: 'supervisor',  // Yuqori tashkilot
        supervisorId: 'aj_head',
        riskGroup: 'high',
        employees: 280,
        overallIndex: 0,
        kpis: getEmptyKPIs(),
        profile: 'electric'
    },
    {
        id: 'tashkent_vagon_zavod',
        name: "Toshkent yo'lovchi vagonlarni ta'minlash zavodi",
        level: 'supervisor',  // Yuqori tashkilot
        supervisorId: 'aj_head',
        riskGroup: 'high',
        employees: 520,
        overallIndex: 0,
        kpis: getEmptyKPIs(),
        profile: 'factory'
    },
    {
        id: 'andijon_mex_zavod',
        name: "Andijon mehanika zavodi",
        level: 'supervisor',  // Yuqori tashkilot
        supervisorId: 'aj_head',
        riskGroup: 'high',
        employees: 450,
        overallIndex: 0,
        kpis: getEmptyKPIs(),
        profile: 'factory'
    }
];

// Make globally accessible
window.UZ_RAILWAY_DATA = UZ_RAILWAY_DATA;
