# O'zbekiston Temir Yo'llari AJ - Mehnat Muhofazasi Reyting Tizimi

## Overview
15 bandlik professional xavfsizlik reyting tizimi - O'zbekiston temir yo'l sanoati uchun maxsus ishlab chiqilgan. Firebase bilan integratsiya qilingan.

## Hozirgi Holat (2024-12-01)
- Firebase NBT-KPI bazasi bilan ishlaydi
- 15 bandlik KPI tizimi to'liq joriy etildi
- LTIFR va TRIR xalqaro formulalari qo'shildi
- Penalty → Score konversiya jadvali yaratildi

## Asosiy Xususiyatlar

### 15 Bandlik KPI Tizimi
| # | KPI | Vazn | Tavsif |
|---|-----|------|--------|
| 1 | LTIFR | 45% | Lost Time Injury Frequency Rate - ENG MUHIM |
| 2 | TRIR | 12% | Total Recordable Incident Rate |
| 3 | Bexavfsiz kunlar | 6% | Hodisasiz kunlar soni |
| 4 | O'qitish qamrovi | 5% | MM o'quvlarini o'tganlar |
| 5 | Uskuna nazorati | 6% | Rolling stock va uskunalar |
| 6 | SHHV ta'minoti | 5% | Shaxsiy himoya vositalari |
| 7 | Xavfni baholash | 5% | Risk Assessment qamrovi |
| 8 | Profilaktika | 4% | CAPEX/OPEX ratio |
| 9 | Near Miss | 4% | Safety Culture indicator |
| 10 | Murojaatga reaksiya | 3% | Nomuvofiqliklarni yopish |
| 11 | Nazorat rejasi | 3% | Ichki nazorat ijrosi |
| 12 | Kasbiy kasalliklar | 2% | Aniqlangan kasalliklar |
| 13 | Audit samaradorligi | 2% | Muvofiqlik darajasi |
| 14 | Avariya mashqlari | 2% | Tayyorgarlik darajasi |
| 15 | Intizomiy | 1% | Talon tizimi |

### Department Profillar
6 ta xo'jalik profili - har biri o'ziga xos vazn koeffitsentlari bilan:
- **Lokomotiv** (locomotive) - Juda yuqori xavf
- **Yo'l xo'jaligi** (road) - Yuqori fizik xavf
- **Vagon xo'jaligi** (wagon) - Texnologik xavf
- **Elektr va Aloqa** (electric) - Elektroxavfsizlik
- **Harakatni Boshqarish** (traffic) - Inson omili
- **Zavodlar** (factory) - Sanoat xavfsizligi

### Professional Formulalar
```javascript
// LTIFR = (Lost Time Injuries × 1,000,000) / Total Hours Worked
LTIFR = (LTI × 1000000) / THW

// TRIR = (Recordable Incidents / Total Hours Worked) × 200,000
TRIR = (RI × 200000) / THW

// Penalty Score = O'lim×100 + Og'ir×50 + Guruh×40 + Yengil×10
```

### Zona Klassifikatsiyasi (OSHA)
- 🟢 Yashil zona: 80+ ball - Xavfsiz
- 🟡 Sariq zona: 50-79 ball - O'rtacha xavf
- 🔴 Qizil zona: <50 ball - Yuqori xavf

## Texnik Tuzilma

### Fayllar
- `index.html` - Asosiy interfeys (Login, Dashboard, Form)
- `app.js` - Biznes logika, KPI hisoblash, Firebase operatsiyalari
- `data.js` - KPI vaznlar, koeffitsentlar, benchmark jadvallar
- `styles.css` - UI/UX styling, wizard, responsive design
- `auth.js` - Autentifikatsiya va rol tizimi
- `filter.js` - Tashkiliy struktura filtrlari
- `hierarchy.js` - Ierarxik ma'lumotlar

### Firebase Konfiguratsiya
```javascript
// NBT-KPI loyihasi
apiKey: "AIzaSyAYhBShtJwKVPkiMYMBXaUXOQTrJSefHuk"
projectId: "nbt-kpi"
```

## Keyingi Vazifalar
- [ ] Multi-step wizard formasini joriy etish
- [ ] Real-time score preview qo'shish
- [ ] Peer group benchmarking
- [ ] Visual dashboard grafiklar

## Foydalanuvchi Sozlamalari
- Til: O'zbek
- Standartlar: ISO 45001, OSHA, ILO, O'zR Qonunlari
- Port: 5000

---
Oxirgi yangilanish: 2024-12-01
