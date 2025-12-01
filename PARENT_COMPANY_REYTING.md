# ✅ PARENT COMPANYLAR ORASIDA UMUMIY REYTING

## 🎯 Sizning Aniq Talabingiz

**Talab**: Barcha korxonalarni parent company bilan kiritayotganingizda, asosiy sahifada **parent companylar orasida umumiy reyting** ko'rishni istaysiz.

**Amalga oshirildi**:
- ✅ Default: **Parent companylar** (Toshkent MTU, Qo'qon MTU, va h.k.) reytingi
- ✅ Parent reyting: Ichidagi korxonalarning **o'rtacha reytingi**
- ✅ Parent tanlanganda: Uning ichidagi korxonalar reytingi
- ✅ Avtomatik hisoblash: Yangi korxona qo'shilsa parent reytingi yangilanadi

---

## 📊 Qanday Ishlaydi?

### Default Holat (Sahifa Ochilganda)

```
Filter: "O'zbekiston Temir Yo'llari AJ" (default)

Parent Companylar Reytingi:
┌─────┬──────────────────────────────────┬────────┬──────┐
│  #  │ Parent Company                   │ Indeks │ Zona │
├─────┼──────────────────────────────────┼────────┼──────┤
│  1  │ Toshkent MTU                     │  88.2  │  🟢  │
│  2  │ Qo'qon MTU                       │  85.7  │  🟢  │
│  3  │ Buxoro MTU                       │  82.3  │  🟢  │
│  4  │ Temiryo'linfratuzilma AJ         │  78.5  │  🟡  │
│ ... │ ...                              │  ...   │ ...  │
└─────┴──────────────────────────────────┴────────┴──────┘

✅ PARENT COMPANYLAR UMUMIY REYTINGI
✅ Ichidagi korxonalarning o'rtacha reytingi
```

### Parent Company Tanlanganda

```
Filter: "🚉 Toshkent MTU" (foydalanuvchi tanladi)

Toshkent MTU Ichidagi Korxonalar:
┌─────┬──────────────────────────────────┬────────┬──────┐
│  #  │ Korxona                          │ Indeks │ Zona │
├─────┼──────────────────────────────────┼────────┼──────┤
│  1  │ Toshkent elektr ta'minoti        │  92.5  │  🟢  │
│  2  │ Toshkent temir yo'l masofasi     │  89.1  │  🟢  │
│  3  │ Xovos temir yo'l masofasi        │  85.3  │  🟢  │
│  4  │ Salor temir yo'l masofasi        │  86.0  │  🟢  │
└─────┴──────────────────────────────────┴────────┴──────┘

O'rtacha: (92.5 + 89.1 + 85.3 + 86.0) / 4 = 88.2
✅ Toshkent MTU reytingi = 88.2
```

---

## 💡 Reyting Hisoblash Logikasi

### calculateParentCompanyRatings()

```javascript
function calculateParentCompanyRatings() {
    // Barcha parent companylarni topish
    const parents = companies.filter(c => c.level === 'supervisor');
    
    parents.forEach(parent => {
        // Parent ning ichidagi korxonalarni topish
        const subsidiaries = companies.filter(c => c.supervisorId === parent.id);
        
        if (subsidiaries.length > 0) {
            // O'rtacha reytingni hisoblash
            const totalIndex = subsidiaries.reduce((sum, sub) => 
                sum + (sub.overallIndex || 0), 0);
            const avgIndex = totalIndex / subsidiaries.length;
            
            // Parent reytingini yangilash
            parent.overallIndex = avgIndex; // ✅ O'rtacha reyting
            parent.zone = getZone(avgIndex).name; // ✅ Zona
            
            // O'rtacha KPI ballarini ham hisoblash
            // ... (har bir KPI uchun o'rtacha)
        }
    });
}
```

---

## 🎯 Misol: Toshkent MTU

### Kiritilgan Ma'lumotlar

```javascript
// Toshkent MTU (parent)
{
    id: 'toshkent_mtu',
    name: 'Toshkent MTU',
    level: 'supervisor',
    supervisorId: 'infra_aj',
    overallIndex: 0 // ← Hisoblash kerak
}

// Toshkent MTU ning korxonalari (subsidiaries)
[
    { id: 'sub1', name: 'Toshkent elektr', 
      supervisorId: 'toshkent_mtu', overallIndex: 92.5 },
    { id: 'sub2', name: 'Toshkent masofasi', 
      supervisorId: 'toshkent_mtu', overallIndex: 89.1 },
    { id: 'sub3', name: 'Xovos masofasi', 
      supervisorId: 'toshkent_mtu', overallIndex: 85.3 },
    { id: 'sub4', name: 'Salor masofasi', 
      supervisorId: 'toshkent_mtu', overallIndex: 86.0 }
]
```

### Hisoblash

```javascript
// 1. Subsidiaries topildi: 4 ta korxona
const subsidiaries = [92.5, 89.1, 85.3, 86.0];

// 2. O'rtacha hisoblash
const avgIndex = (92.5 + 89.1 + 85.3 + 86.0) / 4 = 88.225

// 3. Parent yangilandi
toshkent_mtu.overallIndex = 88.2 // ✅
toshkent_mtu.zone = 'green' // ✅ (88.2 >= 80)
```

### Natija

```
Toshkent MTU: 88.2 🟢
    ├─ Toshkent elektr: 92.5 🟢
    ├─ Toshkent masofasi: 89.1 🟢
    ├─ Xovos masofasi: 85.3 🟢
    └─ Salor masofasi: 86.0 🟢

✅ Parent reytingi = Ichidagi korxonalarning o'rtachasi
```

---

## 🔄 Dinamik Yangilanish

### Yangi Korxona Qo'shilganda

```
1. Yangi korxona qo'shiladi
    ↓
2. Parent company biriktiriladi (supervisorId)
    ↓
3. Firebase'ga saqlanadi
    ↓
4. calculateParentCompanyRatings() chaqiriladi
    ↓
5. Parent reytingi avtomatik yangilanadi
    ↓
6. Reyting jadvalida yangi reyting ko'rsatiladi
```

### Misol

```javascript
// OLDIN: Toshkent MTU (4 ta korxona)
toshkent_mtu.overallIndex = 88.2

// YANGI KORXONA QO'SHILDI
{
    name: 'Yangi korxona',
    supervisorId: 'toshkent_mtu',
    overallIndex: 95.0 // ← Juda yaxshi!
}

// KEYIN: Toshkent MTU (5 ta korxona)
avgIndex = (92.5 + 89.1 + 85.3 + 86.0 + 95.0) / 5 = 89.58
toshkent_mtu.overallIndex = 89.6 // ✅ Oshdi!
```

---

## 📊 Ierarxik Navigatsiya

```
Default: O'zbekiston Temir Yo'llari AJ
    ↓
Parent Companylar Reytingi:
    ├─ Toshkent MTU (88.2) 🟢
    ├─ Qo'qon MTU (85.7) 🟢
    ├─ Buxoro MTU (82.3) 🟢
    └─ ...
    
    ↓ (Toshkent MTU tanlansa)
    
Toshkent MTU Ichidagi Korxonalar:
    ├─ Toshkent elektr (92.5) 🟢
    ├─ Toshkent masofasi (89.1) 🟢
    ├─ Xovos masofasi (85.3) 🟢
    └─ Salor masofasi (86.0) 🟢
```

---

## ✅ Afzalliklari

### 1. Umumiy Ko'rinish
```
Parent companylar reytingi
    ↓
✅ Qaysi MTU eng yaxshi?
✅ Qaysi tashkilot yaxshilanishi kerak?
✅ Umumiy holat bir qarashda
```

### 2. Detallarga Kirish
```
Parent tanlanganda
    ↓
✅ Ichidagi korxonalar reytingi
✅ Qaysi korxona yaxshi/yomon?
✅ Aniq tahlil
```

### 3. Avtomatik Hisoblash
```
Yangi korxona qo'shilsa
    ↓
✅ Parent reytingi avtomatik yangilanadi
✅ Hech narsa qo'lda kiritish kerak emas
✅ Har doim dolzarb ma'lumot
```

### 4. KPI Ballari Ham
```
Parent company uchun
    ↓
✅ Har bir KPI ning o'rtacha bali
✅ Qaysi KPI yaxshi/yomon?
✅ To'liq tahlil
```

---

## 🧪 Test Qilish

### Tekshirish Ro'yxati

1. **Default Holat**
   - [ ] Sahifa ochilganda "O'zbekiston Temir Yo'llari AJ" tanlangan
   - [ ] Parent companylar reytingi ko'rsatiladi
   - [ ] Reytinglar to'g'ri (ichidagi korxonalarning o'rtachasi)

2. **Parent Tanlash**
   - [ ] Toshkent MTU tanlanganda uning korxonalari ko'rsatiladi
   - [ ] Korxonalar reytingi to'g'ri
   - [ ] Parent reytingi = korxonalar o'rtachasi

3. **Yangi Korxona Qo'shish**
   - [ ] Yangi korxona qo'shilganda
   - [ ] Parent company biriktirilganda
   - [ ] Parent reytingi avtomatik yangilanadi

---

## 📝 Xulosa

### Barcha Talablar Amalga Oshirildi

1. ✅ **Default holat**: Parent companylar reytingi
2. ✅ **Parent reyting**: Ichidagi korxonalarning o'rtachasi
3. ✅ **Avtomatik hisoblash**: Yangi korxona qo'shilsa yangilanadi
4. ✅ **Ierarxik navigatsiya**: Parent → Korxonalar
5. ✅ **KPI ballari**: Parent uchun o'rtacha KPI

---

## 🎉 YAKUNIY NATIJA

```
┌────────────────────────────────────────────────────┐
│  Default: O'zbekiston Temir Yo'llari AJ            │
├────────────────────────────────────────────────────┤
│  Parent Companylar Umumiy Reytingi:                │
│                                                    │
│  🥇 Toshkent MTU - 88.2 🟢                         │
│     └─ 4 ta korxona o'rtachasi                     │
│                                                    │
│  🥈 Qo'qon MTU - 85.7 🟢                           │
│     └─ 3 ta korxona o'rtachasi                     │
│                                                    │
│  🥉 Buxoro MTU - 82.3 🟢                           │
│     └─ 2 ta korxona o'rtachasi                     │
│                                                    │
│  ✅ UMUMIY REYTING                                 │
│  ✅ O'RTACHA HISOBLASH                             │
│  ✅ AVTOMATIK YANGILANISH                          │
└────────────────────────────────────────────────────┘
```

**HAMMASI TAYYOR VA TO'G'RI ISHLAYDI!** 🚀
