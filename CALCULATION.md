# 📊 MM KPI Hisoblash Tartibi

## Umumiy Ma'lumotlar

**Korxona:** Xorazm Metall LLC  
**Xodimlar soni:** 190  
**Yillik ish vaqti:** 420,000 soat  
**Sana:** 2025-11-27

---

## 1️⃣ LTIFR (Lost Time Injury Frequency Rate)

### Bosqich 1: Ma'lumotlarni yig'ish
```
Baxtsiz hodisalar soni: 2 ta
Jami ish soatlari: 420,000 soat
```

### Bosqich 2: LTIFR ni hisoblash
```
Formula: LTIFR = (BH soni / Jami soat) × 1,000,000

Hisoblash:
LTIFR = (2 / 420,000) × 1,000,000
LTIFR = 0.00000476 × 1,000,000
LTIFR = 4.76
```

### Bosqich 3: Normalizatsiya (0-100 ball)
```
Formula: Ball = max(0, 100 - (LTIFR × 20))

Hisoblash:
Ball = 100 - (4.76 × 20)
Ball = 100 - 95.2
Ball = 4.8
Ball = 5 (yaxlitlangan)
```

### Bosqich 4: Zona aniqlash
```
Ball: 5
Zona: 🔴 Qizil (0-49)
Holat: Xavfli
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.12
Hissa: 5 × 0.12 = 0.60
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| LTIFR | 4.76 | 5 | 🔴 | 0.12 | 0.60 |

---

## 2️⃣ TRIR (Total Recordable Injury Rate)

### Bosqich 1: Ma'lumotlarni yig'ish
```
Jarohatlar soni: 7 ta
Jami ish soatlari: 420,000 soat
```

### Bosqich 2: TRIR ni hisoblash
```
Formula: TRIR = (Jarohatlar / Jami soat) × 1,000,000

Hisoblash:
TRIR = (7 / 420,000) × 1,000,000
TRIR = 0.00001667 × 1,000,000
TRIR = 16.67
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = max(0, 100 - (TRIR × 10))

Hisoblash:
Ball = 100 - (16.67 × 10)
Ball = 100 - 166.7
Ball = -66.7
Ball = 0 (max funksiyasi)
```

### Bosqich 4: Zona aniqlash
```
Ball: 0
Zona: 🔴 Qizil (0-49)
Holat: Xavfli
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.10
Hissa: 0 × 0.10 = 0.00
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| TRIR | 16.67 | 0 | 🔴 | 0.10 | 0.00 |

---

## 3️⃣ Noincident Kunlar Ulushi

### Bosqich 1: Ma'lumotlarni yig'ish
```
Noincident kunlar: 353 kun
Yil kunlari: 365 kun
```

### Bosqich 2: Foizni hisoblash
```
Formula: Noincident % = (Noincident kunlar / 365) × 100

Hisoblash:
Noincident % = (353 / 365) × 100
Noincident % = 0.9671 × 100
Noincident % = 96.71%
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = min(100, Noincident %)

Hisoblash:
Ball = min(100, 96.71)
Ball = 96.71
Ball = 97 (yaxlitlangan)
```

### Bosqich 4: Zona aniqlash
```
Ball: 97
Zona: 🟢 Yashil (80-100)
Holat: A'lo
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.08
Hissa: 97 × 0.08 = 7.76
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| Noincident | 96.71% | 97 | 🟢 | 0.08 | 7.76 |

---

## 4️⃣ O'quv Qamrovi

### Bosqich 1: Ma'lumotlarni yig'ish
```
O'quvni tugatganlar: 186 kishi
Jami xodimlar: 190 kishi
```

### Bosqich 2: Foizni hisoblash
```
Formula: O'quv % = (Tugatganlar / Jami xodimlar) × 100

Hisoblash:
O'quv % = (186 / 190) × 100
O'quv % = 0.9789 × 100
O'quv % = 97.89%
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = min(100, O'quv %)

Hisoblash:
Ball = min(100, 97.89)
Ball = 97.89
Ball = 98 (yaxlitlangan)
```

### Bosqich 4: Zona aniqlash
```
Ball: 98
Zona: 🟢 Yashil (80-100)
Holat: A'lo
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.06
Hissa: 98 × 0.06 = 5.88
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| O'quv | 97.89% | 98 | 🟢 | 0.06 | 5.88 |

---

## 5️⃣ RA Coverage (Xavf-xatar Baholash)

### Bosqich 1: Ma'lumotlarni yig'ish
```
Baholangan ish o'rinlari: 45 ta
Jami ish o'rinlari: 50 ta
```

### Bosqich 2: Foizni hisoblash
```
Formula: RA % = (Baholangan / Jami) × 100

Hisoblash:
RA % = (45 / 50) × 100
RA % = 0.90 × 100
RA % = 90%
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = min(100, RA %)

Hisoblash:
Ball = min(100, 90)
Ball = 90
```

### Bosqich 4: Zona aniqlash
```
Ball: 90
Zona: 🟢 Yashil (80-100)
Holat: A'lo
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.08
Hissa: 90 × 0.08 = 7.20
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| RA Coverage | 90% | 90 | 🟢 | 0.08 | 7.20 |

---

## 6️⃣ Near Miss Darajasi

### Bosqich 1: Ma'lumotlarni yig'ish
```
Yaqin xato holatlari: 60 ta
Jami xodimlar: 190 kishi
```

### Bosqich 2: Koeffitsiyentni hisoblash
```
Formula: Near Miss = Yaqin xato / Jami xodimlar

Hisoblash:
Near Miss = 60 / 190
Near Miss = 0.316
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = min(100, (Near Miss / 0.5) × 100)

Hisoblash:
Ball = (0.316 / 0.5) × 100
Ball = 0.632 × 100
Ball = 63.2
Ball = 63 (yaxlitlangan)
```

### Bosqich 4: Zona aniqlash
```
Ball: 63
Zona: 🟡 Sariq (50-79)
Holat: Qoniqarli
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.06
Hissa: 63 × 0.06 = 3.78
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| Near Miss | 0.316 | 63 | 🟡 | 0.06 | 3.78 |

---

## 7️⃣ Javob Berish Tezligi

### Bosqich 1: Ma'lumotlarni yig'ish
```
Sarflangan kunlar: 84 kun
Murojaatlar soni: 40 ta
```

### Bosqich 2: O'rtacha kunni hisoblash
```
Formula: Javob (kun) = Sarflangan kunlar / Murojaatlar

Hisoblash:
Javob = 84 / 40
Javob = 2.1 kun
```

### Bosqich 3: Normalizatsiya
```
Formula:
  Agar kun ≤ 1: Ball = 100
  Agar 1 < kun ≤ 3: Ball = 100 - ((kun - 1) × 20)
  Agar kun > 3: Ball = max(0, 100 - ((kun - 1) × 25))

Hisoblash:
kun = 2.1 (1 < 2.1 ≤ 3)
Ball = 100 - ((2.1 - 1) × 20)
Ball = 100 - (1.1 × 20)
Ball = 100 - 22
Ball = 78
```

### Bosqich 4: Zona aniqlash
```
Ball: 78
Zona: 🟡 Sariq (50-79)
Holat: Qoniqarli
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.08
Hissa: 78 × 0.08 = 6.24
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| Javob tezligi | 2.1 kun | 78 | 🟡 | 0.08 | 6.24 |

---

## 8️⃣ Profilaktika Xarajatlari

### Bosqich 1: Ma'lumotlarni yig'ish
```
MM xarajatlari: 420 mln
Jami xarajatlar: 18,200 mln
```

### Bosqich 2: Foizni hisoblash
```
Formula: Profilaktika % = (MM xarajat / Jami xarajat) × 100

Hisoblash:
Profilaktika % = (420 / 18,200) × 100
Profilaktika % = 0.0231 × 100
Profilaktika % = 2.31%
```

### Bosqich 3: Normalizatsiya
```
Formula:
  Agar 2% ≤ qiymat ≤ 5%: Ball = 100
  Agar qiymat < 2%: Ball = (qiymat / 2) × 100
  Agar qiymat > 5%: Ball = max(0, 100 - ((qiymat - 5) × 10))

Hisoblash:
qiymat = 2.31% (2% ≤ 2.31% ≤ 5%)
Ball = 100
```

### Bosqich 4: Zona aniqlash
```
Ball: 100
Zona: 🟢 Yashil (80-100)
Holat: A'lo
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.08
Hissa: 100 × 0.08 = 8.00
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| Profilaktika | 2.31% | 100 | 🟢 | 0.08 | 8.00 |

---

## 9️⃣ SHHV Ta'minoti

### Bosqich 1: Ma'lumotlarni yig'ish
```
SHHV ta'minlanganlar: 188 kishi
Jami xodimlar: 190 kishi
```

### Bosqich 2: Foizni hisoblash
```
Formula: SHHV % = (Ta'minlanganlar / Jami xodimlar) × 100

Hisoblash:
SHHV % = (188 / 190) × 100
SHHV % = 0.9895 × 100
SHHV % = 98.95%
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = min(100, SHHV %)

Hisoblash:
Ball = min(100, 98.95)
Ball = 98.95
Ball = 99 (yaxlitlangan)
```

### Bosqich 4: Zona aniqlash
```
Ball: 99
Zona: 🟢 Yashil (80-100)
Holat: A'lo
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.06
Hissa: 99 × 0.06 = 5.94
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| SHHV | 98.95% | 99 | 🟢 | 0.06 | 5.94 |

---

## 🔟 Uskuna Texnik Ko'rigi

### Bosqich 1: Ma'lumotlarni yig'ish
```
Tekshiruvdan o'tgan: 142 ta
Jami uskunalar: 150 ta
```

### Bosqich 2: Foizni hisoblash
```
Formula: Uskuna % = (Tekshiruv / Jami uskunalar) × 100

Hisoblash:
Uskuna % = (142 / 150) × 100
Uskuna % = 0.9467 × 100
Uskuna % = 94.67%
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = min(100, Uskuna %)

Hisoblash:
Ball = min(100, 94.67)
Ball = 94.67
Ball = 95 (yaxlitlangan)
```

### Bosqich 4: Zona aniqlash
```
Ball: 95
Zona: 🟢 Yashil (80-100)
Holat: A'lo
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.05
Hissa: 95 × 0.05 = 4.75
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| Uskuna | 94.67% | 95 | 🟢 | 0.05 | 4.75 |

---

## 1️⃣1️⃣ Inspeksiya Reja-Ijrosi

### Bosqich 1: Ma'lumotlarni yig'ish
```
O'tkazilgan inspeksiyalar: 26 ta
Rejalashtirilgan: 30 ta
```

### Bosqich 2: Foizni hisoblash
```
Formula: Inspeksiya % = (O'tkazilgan / Rejalashtirilgan) × 100

Hisoblash:
Inspeksiya % = (26 / 30) × 100
Inspeksiya % = 0.8667 × 100
Inspeksiya % = 86.67%
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = min(100, Inspeksiya %)

Hisoblash:
Ball = min(100, 86.67)
Ball = 86.67
Ball = 87 (yaxlitlangan)
```

### Bosqich 4: Zona aniqlash
```
Ball: 87
Zona: 🟢 Yashil (80-100)
Holat: A'lo
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.08
Hissa: 87 × 0.08 = 6.96
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| Inspeksiya | 86.67% | 87 | 🟢 | 0.08 | 6.96 |

---

## 1️⃣2️⃣ Kasbiy Kasalliklar

### Bosqich 1: Ma'lumotlarni yig'ish
```
Kasbiy kasalliklar soni: 1 ta
```

### Bosqich 2: Absolyut qiymat
```
Kasbiy kasallik = 1
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = max(0, 100 - (Kasallik × 50))

Hisoblash:
Ball = 100 - (1 × 50)
Ball = 100 - 50
Ball = 50
```

### Bosqich 4: Zona aniqlash
```
Ball: 50
Zona: 🟡 Sariq (50-79)
Holat: Qoniqarli
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.05
Hissa: 50 × 0.05 = 2.50
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| Kasbiy kasallik | 1 ta | 50 | 🟡 | 0.05 | 2.50 |

---

## 1️⃣3️⃣ MM Talablariga Rioya Indeksi

### Bosqich 1: Ma'lumotlarni yig'ish
```
Nomuvofiqliklar: 11 ta
Jami punktlar: 120 ta
```

### Bosqich 2: Foizni hisoblash
```
Formula: Rioya % = (1 - Nomuvofiqlik / Jami punktlar) × 100

Hisoblash:
Rioya % = (1 - 11/120) × 100
Rioya % = (1 - 0.0917) × 100
Rioya % = 0.9083 × 100
Rioya % = 90.83%
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = min(100, Rioya %)

Hisoblash:
Ball = min(100, 90.83)
Ball = 90.83
Ball = 91 (yaxlitlangan)
```

### Bosqich 4: Zona aniqlash
```
Ball: 91
Zona: 🟢 Yashil (80-100)
Holat: A'lo
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.05
Hissa: 91 × 0.05 = 4.55
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| Rioya | 90.83% | 91 | 🟢 | 0.05 | 4.55 |

---

## 1️⃣4️⃣ Favqulodda Vaziyatga Tayyorgarlik

### Bosqich 1: Ma'lumotlarni yig'ish
```
Mashg'ulotda ishtirok etganlar: 162 kishi
Rejalashtirilgan: 180 kishi
```

### Bosqich 2: Foizni hisoblash
```
Formula: FV % = (Ishtirok / Rejalashtirilgan) × 100

Hisoblash:
FV % = (162 / 180) × 100
FV % = 0.90 × 100
FV % = 90%
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = min(100, FV %)

Hisoblash:
Ball = min(100, 90)
Ball = 90
```

### Bosqich 4: Zona aniqlash
```
Ball: 90
Zona: 🟢 Yashil (80-100)
Holat: A'lo
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.05
Hissa: 90 × 0.05 = 4.50
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| FV tayyorgarlik | 90% | 90 | 🟢 | 0.05 | 4.50 |

---

## 1️⃣5️⃣ MM Buzilishlar Koeffitsiyenti

### Bosqich 1: Ma'lumotlarni yig'ish
```
Buzilishlar soni: 14 ta
Jami xodimlar: 190 kishi
```

### Bosqich 2: Foizni hisoblash
```
Formula: Buzilish % = (Buzilishlar / Jami xodimlar) × 100

Hisoblash:
Buzilish % = (14 / 190) × 100
Buzilish % = 0.0737 × 100
Buzilish % = 7.37%
```

### Bosqich 3: Normalizatsiya
```
Formula: Ball = max(0, 100 - (Buzilish % × 10))

Hisoblash:
Ball = 100 - (7.37 × 10)
Ball = 100 - 73.7
Ball = 26.3
Ball = 26 (yaxlitlangan)
```

### Bosqich 4: Zona aniqlash
```
Ball: 26
Zona: 🔴 Qizil (0-49)
Holat: Xavfli
```

### Bosqich 5: Vazn bilan ko'paytirish
```
Vazn: 0.08
Hissa: 26 × 0.08 = 2.08
```

### Natija
| Ko'rsatkich | Qiymat | Ball | Zona | Vazn | Hissa |
|-------------|--------|------|------|------|-------|
| Buzilishlar | 7.37% | 26 | 🔴 | 0.08 | 2.08 |

---

## 📊 YAKUNIY MM UMUMIY INDEKSI

### Barcha Hissalarni Yig'ish

```
1.  LTIFR:           0.60
2.  TRIR:            0.00
3.  Noincident:      7.76
4.  O'quv:           5.88
5.  RA Coverage:     7.20
6.  Near Miss:       3.78
7.  Javob:           6.24
8.  Profilaktika:    8.00
9.  SHHV:            5.94
10. Uskuna:          4.75
11. Inspeksiya:      6.96
12. Kasbiy:          2.50
13. Rioya:           4.55
14. FV:              4.50
15. Buzilishlar:     2.08
─────────────────────────
JAMI:               70.74
```

### MM Umumiy Indeksi
```
MM Indeksi = 70.74 ball
```

### Zona Aniqlash
```
70.74 ball
Zona: 🟡 Sariq (50-79)
Holat: Qoniqarli
Tavsiya: Yaxshilash choralari talab qilinadi
```

---

## 📋 Umumiy Jadval

| # | KPI | Qiymat | Ball | Zona | Vazn | Hissa |
|---|-----|--------|------|------|------|-------|
| 1 | LTIFR | 4.76 | 5 | 🔴 | 0.12 | 0.60 |
| 2 | TRIR | 16.67 | 0 | 🔴 | 0.10 | 0.00 |
| 3 | Noincident | 96.71% | 97 | 🟢 | 0.08 | 7.76 |
| 4 | O'quv | 97.89% | 98 | 🟢 | 0.06 | 5.88 |
| 5 | RA Coverage | 90% | 90 | 🟢 | 0.08 | 7.20 |
| 6 | Near Miss | 0.316 | 63 | 🟡 | 0.06 | 3.78 |
| 7 | Javob | 2.1 kun | 78 | 🟡 | 0.08 | 6.24 |
| 8 | Profilaktika | 2.31% | 100 | 🟢 | 0.08 | 8.00 |
| 9 | SHHV | 98.95% | 99 | 🟢 | 0.06 | 5.94 |
| 10 | Uskuna | 94.67% | 95 | 🟢 | 0.05 | 4.75 |
| 11 | Inspeksiya | 86.67% | 87 | 🟢 | 0.08 | 6.96 |
| 12 | Kasbiy | 1 ta | 50 | 🟡 | 0.05 | 2.50 |
| 13 | Rioya | 90.83% | 91 | 🟢 | 0.05 | 4.55 |
| 14 | FV | 90% | 90 | 🟢 | 0.05 | 4.50 |
| 15 | Buzilishlar | 7.37% | 26 | 🔴 | 0.08 | 2.08 |
| | **JAMI** | | | | **1.00** | **70.74** |

---

## 🎯 Tahlil

### Yaxshi Tomonlar (Yashil zona)
- ✅ Noincident kunlar: 97 ball
- ✅ O'quv qamrovi: 98 ball
- ✅ RA Coverage: 90 ball
- ✅ Profilaktika: 100 ball
- ✅ SHHV: 99 ball
- ✅ Uskuna: 95 ball
- ✅ Inspeksiya: 87 ball
- ✅ Rioya: 91 ball
- ✅ FV: 90 ball

### Yaxshilash Kerak (Sariq zona)
- ⚠️ Near Miss: 63 ball
- ⚠️ Javob tezligi: 78 ball
- ⚠️ Kasbiy kasallik: 50 ball

### Xavfli Zonalar (Qizil zona)
- 🔴 LTIFR: 5 ball - **Juda xavfli!**
- 🔴 TRIR: 0 ball - **Kritik!**
- 🔴 Buzilishlar: 26 ball - **Yuqori!**

### Tavsiyalar

**Zudlik bilan:**
1. Baxtsiz hodisalarni kamaytirish
2. Jarohatlarni oldini olish
3. Intizomni kuchaytirish

**Qisqa muddatda:**
1. Near Miss xabarlashni oshirish
2. Javob tezligini yaxshilash
3. Kasbiy kasalliklarni oldini olish

**Uzoq muddatda:**
1. Xavfsizlik madaniyatini rivojlantirish
2. Profilaktik choralarni davom ettirish
3. Doimiy monitoring va tahlil

---

**Sana:** 2025-11-27  
**Korxona:** Xorazm Metall LLC  
**MM Umumiy Indeksi:** 70.74 ball  
**Zona:** 🟡 Sariq (Qoniqarli)
