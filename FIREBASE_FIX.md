# Firebase Muammolarini Hal Qilish Qo'llanmasi

## ✅ Amalga oshirilgan tuzatishlar:

### 1. **Duplicate `loadCompanies()` funksiyasi muammosi hal qilindi**
   - Ikki xil `loadCompanies()` funksiyasi mavjud edi
   - LocalStorage versiyasi o'chirildi
   - Hybrid Firebase + LocalStorage versiyasi qoldirildi

### 2. **`renderRankingTable()` ikki jadval uchun ishlaydi**
   - Dashboard tab'dagi `ranking-tbody`
   - Rankings tab'dagi `ranking-table-body`
   - Ikkala jadval ham bir vaqtda yangilanadi

### 3. **Firebase ma'lumotlarini yuklash yaxshilandi**
   - Batafsil console logging qo'shildi
   - Xato xabarlari aniqroq qilindi
   - LocalStorage backup qo'shildi

### 4. **UI yangilanish jarayoni tuzatildi**
   - `refreshUI()` funksiyasi to'g'ri chaqiriladi
   - `renderDashboard()` barcha kerakli render funksiyalarini chaqiradi

## 🔍 Firebase Firestore Security Rules Tekshirish

Firebase Console'da quyidagi sozlamalarni tekshiring:

### 1. Firebase Console'ga kiring:
   - https://console.firebase.google.com/
   - `nbt-kpi` proyektini tanlang

### 2. Firestore Database → Rules bo'limiga o'ting

### 3. Quyidagi qoidalarni qo'llang (Development uchun):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (FAQAT DEVELOPMENT UCHUN!)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**MUHIM:** Production uchun xavfsizroq qoidalar kerak!

### 4. Production uchun xavfsiz qoidalar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /companies/{companyId} {
      // Hamma o'qiy oladi
      allow read: if true;
      
      // Faqat autentifikatsiya qilingan foydalanuvchilar yoza oladi
      allow write: if request.auth != null;
    }
  }
}
```

## 🧪 Testlash Qadamlari:

### 1. Firebase Test Sahifasini oching:
```bash
cd /home/ctrl/Documents/bak
python3 -m http.server 8000
```

Keyin brauzerda: http://localhost:8000/firebase-test.html

### 2. Asosiy ilovani oching:
http://localhost:8000/index.html

### 3. Browser Console'ni oching (F12) va quyidagilarni tekshiring:
   - ✅ "Firebase (NBT-KPI) muvaffaqiyatli ulandi!"
   - ✅ "Firebase real-time listener o'rnatilmoqda..."
   - ✅ "Firebase dan yangilandi: X ta korxona"
   - ✅ Korxonalar ro'yxati

### 4. Agar xato bo'lsa:
   - ❌ "permission-denied" → Security Rules'ni tekshiring
   - ❌ "not-found" → Collection nomi to'g'ri ekanligini tekshiring
   - ❌ "network-request-failed" → Internet ulanishini tekshiring

## 📊 Ma'lumotlar Strukturasi

Firebase Firestore'da `companies` collection quyidagi strukturaga ega bo'lishi kerak:

```javascript
{
  id: "comp_1764478311147_kexui",
  name: "Korxona nomi",
  profile: "factory",
  employees: 694,
  totalHours: 1262360,
  kpis: {
    ltifr: { value: 0, score: 100 },
    trir: { value: 0, score: 100 },
    // ... boshqa KPI'lar
  },
  overallIndex: 70.5,
  zone: "yellow",
  dateAdded: "2025-11-30T06:30:00.000Z",
  rawData: { /* form ma'lumotlari */ }
}
```

## 🔧 Muammolarni Hal Qilish:

### Muammo 1: Ma'lumotlar ko'rinmayapti
**Yechim:**
1. Browser Console'ni oching (F12)
2. "Firebase dan yangilandi" xabarini qidiring
3. Agar "0 ta korxona" ko'rsatilsa:
   - Firebase Console'da ma'lumotlar borligini tekshiring
   - Security Rules'ni tekshiring

### Muammo 2: "permission-denied" xatosi
**Yechim:**
1. Firebase Console → Firestore Database → Rules
2. Yuqoridagi development qoidalarini qo'llang
3. "Publish" tugmasini bosing

### Muammo 3: Ma'lumotlar saqlanmayapti
**Yechim:**
1. Console'da "Firebase: Muvaffaqiyatli saqlandi!" xabarini qidiring
2. Agar xato bo'lsa, Security Rules'ni tekshiring
3. Internet ulanishini tekshiring

## 📝 Keyingi Qadamlar:

1. ✅ Firebase Security Rules'ni to'g'rilash
2. ✅ Ma'lumotlar to'g'ri yuklanayotganini tekshirish
3. ✅ Yangi korxona qo'shish va saqlashni test qilish
4. ✅ Tahrirlash va o'chirish funksiyalarini test qilish

## 🎯 Natija:

Barcha tuzatishlar amalga oshirildi. Endi:
- Firebase real-time ma'lumotlar sinxronizatsiyasi ishlaydi
- LocalStorage backup mavjud
- Ikki jadval ham to'g'ri yangilanadi
- Batafsil console logging mavjud

**Keyingi qadam:** Firebase Console'da Security Rules'ni tekshiring va kerak bo'lsa yangilang.
