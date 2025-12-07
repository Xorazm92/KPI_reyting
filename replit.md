# O'zbekiston Temir Yo'llari AJ - Mehnat Muhofazasi Reyting Tizimi

## Overview
15+ bandlik professional xavfsizlik reyting tizimi - O'zbekiston temir yo'l sanoati uchun maxsus ishlab chiqilgan. React + TypeScript + Supabase bilan ishlab chiqilgan zamonaviy SPA.

## Hozirgi Holat (2024-12-07)
- **REACT + TYPESCRIPT** ga to'liq ko'chirildi
- Supabase NBT-KPI bazasi bilan ishlaydi (43 ta korxona real-time)
- 18 bandlik KPI tizimi (yangi bandlar qo'shildi)
- STRICT SCORING MODEL qo'llanildi
- Oylik (Monthly) hisobot tizimiga o'tildi

## Yangi O'zgarishlar (2024-12-07)

### 1. Oylik Hisobot Tizimi
- Choryaklik emas, **oylik** ma'lumotlar kiritish
- Yillik va oylik dinamika taqqoslash imkoniyati

### 2. "Ish To'xtatish" Bandlari (Near Miss o'rniga)
- **Ichki nazorat tomonidan ish to'xtatish** (workStopInternal)
  - Proaktiv harakat - IJOBIY baholanadi
  - Har bir to'xtatish +2 ball
- **Tashqi nazorat tomonidan ish to'xtatish** (workStopExternal)  
  - Jiddiy kamchilik - JARIMA baholanadi
  - Har bir to'xtatish -20 ball

### 3. Sug'urta/Kompensatsiya Bandi
- **insurancePayments** yangi KPI qo'shildi
- Ish haqi fondiga nisbatan hisoblanadi
- Formula: (To'lov summasi / Oylik IHF) × 100

### 4. Attestatsiya (Iş o'rinlarini baholash)
- Yangi qonunchilik talablariga moslashtirildi
- Baholash rejasining bujurilishi (%)
- Chora-tadbirlar rejasining bujurilishi (%)

## Texnik Tuzilma

### Frontend Stack
```
client/
├── src/
│   ├── components/     # UI komponentlari
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── StatCard.tsx
│   │   └── ZoneBadge.tsx
│   ├── contexts/       # React Context
│   │   ├── AuthContext.tsx
│   │   └── CompanyContext.tsx
│   ├── pages/          # Sahifalar
│   │   ├── Dashboard.tsx
│   │   ├── AddCompany.tsx
│   │   ├── Risks.tsx
│   │   ├── Comparison.tsx
│   │   └── Statistics.tsx
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── utils/          # Yordamchi funksiyalar
│   │   ├── kpiCalculator.ts
│   │   ├── kpiConfig.ts
│   │   ├── railwayData.ts
│   │   └── supabase.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Texnologiyalar
- **React 18** + **TypeScript**
- **Vite 5** - Build tool
- **Wouter** - Lightweight routing
- **Chart.js** + **react-chartjs-2** - Grafiklar
- **Supabase** - Backend/Database

### 18 Bandlik KPI Tizimi (100% Vazn)
| # | KPI | Vazn | Tavsif |
|---|-----|------|--------|
| 1 | LTIFR (Baxtsiz hodisalar) | 40% | Accident Severity Index |
| 2 | TRIR | 10% | Mikro-jarohatlar darajasi |
| 3 | Bexavfsiz kunlar | 6% | Hodisasiz kunlar soni |
| 4 | O'qitish qamrovi | 5% | MM o'quvlarini o'tganlar |
| 5 | Uskuna nazorati | 6% | Rolling stock va uskunalar |
| 6 | SHHV ta'minoti | 5% | Shaxsiy himoya vositalari |
| 7 | Xavfni baholash | 5% | Risk Assessment qamrovi |
| 8 | Profilaktika | 4% | CAPEX/OPEX ratio |
| 9 | Near Miss/Xabarlar | 4% | Safety Culture indicator |
| 10 | Murojaatga reaksiya | 4% | Nomuvofiqliklarni yopish |
| 11 | Nazorat rejasi | 3% | Ichki nazorat ijrosi |
| 12 | Kasbiy kasalliklar | 2% | Aniqlangan kasalliklar |
| 13 | Audit samaradorligi | 2% | Muvofiqlik darajasi |
| 14 | Avariya mashqlari | 2% | Tayyorgarlik darajasi |
| 15 | Intizomiy | 2% | Talon tizimi |
| **16** | **Ichki ish to'xtatish** | **3%** | **YANGI - Proaktiv (+)** |
| **17** | **Tashqi ish to'xtatish** | **3%** | **YANGI - Jarima (-)** |
| **18** | **Sug'urta to'lovlari** | **2%** | **YANGI - Kompensatsiya** |

### STRICT Scoring Model
**Penalty-to-Score konversiya:**
- 0 hodisa: 100 ball
- 1 hodisa: 85 ball
- 5 hodisa: 60 ball
- 10+ hodisa: 0 ball

**Risk Profiles:**
- **HIGH** (Lokomotiv, Yo'l, Vagon): minTraining 95%, minPPE 95%
- **MEDIUM** (Elektr, Harakatni Boshqarish): minTraining 85%, minPPE 85%
- **LOW** (Zavodlar): minTraining 70%, minPPE 70%

### Zona Klassifikatsiyasi
- 🟢 Yashil: 80+ ball - Xavfsiz/A'lo
- 🟡 Sariq: 50-79 ball - Qoniqarli
- 🔴 Qizil: <50 ball - Xavfli/Kritik

## Supabase Integration
- **URL**: https://uqxtzlmdvmseirolfwgq.supabase.co
- Real-time subscriptions enabled
- Companies table with full CRUD
- Auto-sync on data changes

## Sahifalar

### 1. Dashboard (/)
- Korxonalar reyting jadvali
- Top 3 podium
- Statistika kartalar
- Zona bo'yicha filtrlash

### 2. Xavflilik (/risks)
- Xavf tahlili
- Kritik/Ogohlantirish/Normal klassifikatsiya
- KPI legend

### 3. Korxona Qo'shish (/add-company)
- To'liq KPI forma
- Yangi bandlar (Ish to'xtatish, Sug'urta)
- Profile tanlash

### 4. Taqqoslash (/comparison)
- 2-5 korxonani tanlash
- Bar va Radar grafiklar
- Batafsil jadval

### 5. Statistika (/statistics)
- Doughnut grafik (zonalar)
- KPI o'rtacha ballari
- Top 5 korxonalar

## Development

### Commands
```bash
cd client && npm install    # Dependencies
cd client && npm run dev    # Development server (port 5000)
cd client && npm run build  # Production build
```

### Port
- Development: 5000
- Production: 5000

## Foydalanuvchi Sozlamalari
- **Til**: O'zbek
- **Standartlar**: ISO 45001, OSHA, ILO, O'zR Qonunlari
- **Hisobot davri**: Oylik (Monthly)
- **Scoring Model**: STRICT

## Test Hisoblar
- admin / admin123 (Full access)
- manager / manager123 (Manager access)
- supervisor / super123 (Supervisor access)
- user / user123 (View only)

---
**Oxirgi yangilanish**: 2024-12-07 (React + TypeScript conversion)
**Status**: Production Ready ✅
