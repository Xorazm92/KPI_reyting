# O'zbekiston Temir Yo'llari AJ - Mehnat Muhofazasi Reyting Tizimi

## Overview
15 bandlik professional xavfsizlik reyting tizimi - O'zbekiston temir yo'l sanoati uchun maxsus ishlab chiqilgan. Firebase bilan integratsiya qilingan.

## Hozirgi Holat (2024-12-01)
- Firebase NBT-KPI bazasi bilan ishlaydi
- 15 bandlik KPI tizimi to'liq joriy etildi (vaznlar 100% ga teng)
- LTIFR formulasi OSHA standartiga muvofiq (200,000 faktor)
- Penalty → Score konversiya jadvali yaratildi
- TRIR normalizatsiyasi uzluksiz kamayish bilan to'g'rilandi

## Asosiy Xususiyatlar

### 15 Bandlik KPI Tizimi
| # | KPI | Vazn | Tavsif |
|---|-----|------|--------|
| 1 | LTIFR (Baxtsiz hodisalar) | 40% | Accident Severity Index - ENG MUHIM |
| 2 | TRIR | 10% | Mikro-jarohatlar darajasi |
| 3 | Bexavfsiz kunlar | 6% | Hodisasiz kunlar soni |
| 4 | O'qitish qamrovi | 5% | MM o'quvlarini o'tganlar |
| 5 | Uskuna nazorati | 6% | Rolling stock va uskunalar |
| 6 | SHHV ta'minoti | 5% | Shaxsiy himoya vositalari |
| 7 | Xavfni baholash | 5% | Risk Assessment qamrovi |
| 8 | Profilaktika | 4% | CAPEX/OPEX ratio |
| 9 | Near Miss | 4% | Safety Culture indicator |
| 10 | Murojaatga reaksiya | 4% | Nomuvofiqliklarni yopish |
| 11 | Nazorat rejasi | 3% | Ichki nazorat ijrosi |
| 12 | Kasbiy kasalliklar | 2% | Aniqlangan kasalliklar |
| 13 | Audit samaradorligi | 2% | Muvofiqlik darajasi |
| 14 | Avariya mashqlari | 2% | Tayyorgarlik darajasi |
| 15 | Intizomiy | 2% | Talon tizimi |

**Jami: 100%**

### Department Profillar
6 ta xo'jalik profili - har biri o'ziga xos vazn koeffitsentlari bilan (barchasi 100% ga teng):
- **Lokomotiv** (locomotive) - LTIFR 40%, Juda yuqori xavf
- **Yo'l xo'jaligi** (road) - LTIFR 40%, Yuqori fizik xavf
- **Vagon xo'jaligi** (wagon) - LTIFR 40%, Texnologik xavf
- **Elektr va Aloqa** (electric) - LTIFR 38%, Elektroxavfsizlik
- **Harakatni Boshqarish** (traffic) - LTIFR 35%, Inson omili
- **Zavodlar** (factory) - LTIFR 40%, Sanoat xavfsizligi

### Professional Formulalar
```javascript
// LTIFR Helper (agar soat ma'lumoti bo'lsa)
// OSHA standart: 200,000 = 100 xodim × 2000 soat/yil
LTIFR = (Lost Time Injuries × 200,000) / Total Hours Worked

// TRIR Helper
TRIR = (Recordable Incidents × 200,000) / Total Hours Worked

// Accident Severity Index (joriy tizim)
// Penalty = O'lim×100 + Og'ir×50 + Guruh×40 + Yengil×10
// Score = penaltyToScore(Penalty) // 0-100 ball
```

### Penalty → Score Konversiyasi
| Jarima ballari | Score |
|----------------|-------|
| 0 | 100 |
| 1-10 | 95-80 |
| 11-50 | 80-40 |
| 51-100 | 40-10 |
| 101-200 | 10-5 |
| 201-500 | 5-0 |
| 500+ | 0 |

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

## So'nggi O'zgarishlar (2024-12-01)
- [x] KPI vaznlar 100% ga to'g'rilandi (barcha profillar)
- [x] LTIFR formulasi OSHA 200,000 faktoriga o'zgartirildi
- [x] TRIR normalizatsiyasi uzluksiz kamayish bilan tuzatildi
- [x] Wizard va benchmark CSS styling qo'shildi
- [x] Peer grouping va sector benchmarks qo'shildi

## Foydalanuvchi Sozlamalari
- Til: O'zbek
- Standartlar: ISO 45001, OSHA, ILO, O'zR Qonunlari
- Port: 5000

---
Oxirgi yangilanish: 2024-12-01
