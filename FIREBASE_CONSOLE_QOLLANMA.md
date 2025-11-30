# 🔥 Firebase Console - Qadam-baqadam Ko'rsatma

## 📋 ANIQ QADAMLAR (5 daqiqa)

### 1️⃣ Firebase Console'ga Kiring

**Link:** https://console.firebase.google.com/

**Login:** Google akkauntingiz bilan kiring

---

### 2️⃣ Proyektni Tanlang

- Proyektlar ro'yxatidan **"nbt-kpi"** ni toping
- Ustiga bosing

![Proyekt tanlash](https://i.imgur.com/example1.png)

---

### 3️⃣ Firestore Database'ga O'ting

Chap menuda:
1. **"Build"** bo'limini toping
2. **"Firestore Database"** ni bosing

Yoki to'g'ridan-to'g'ri link:
```
https://console.firebase.google.com/project/nbt-kpi/firestore
```

---

### 4️⃣ Rules Tab'ini Oching

Yuqoridagi tablardan:
- **"Data"** emas
- **"Rules"** ni bosing ✅
- **"Indexes"** emas
- **"Usage"** emas

---

### 5️⃣ Qoidalarni O'zgartiring

**Hozirgi qoidalar (xato):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // ❌ Bu muammo!
    }
  }
}
```

**YANGI qoidalar (to'g'ri):**

Barcha matnni o'chiring va quyidagini qo'ying:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ✅ Bu to'g'ri!
    }
  }
}
```

**Yoki fayldan nusxa oling:**
```bash
cat /home/ctrl/Documents/bak/firebase-rules.txt
```

---

### 6️⃣ Publish Qiling

1. **"Publish"** tugmasini bosing (yuqori o'ng burchakda)
2. Tasdiqlash oynasi chiqadi
3. **"Publish"** ni yana bir marta bosing

**Kutish:** 2-3 soniya

**Natija:** "Rules published successfully" ✅

---

### 7️⃣ Tekshiring

Brauzeringizda:
```
http://localhost:8000/index.html
```

**F12** bosing → **Console** tab

**Ko'rish kerak:**
```
✅ Firebase (NBT-KPI) muvaffaqiyatli ulandi!
✅ Firebase dan yangilandi: 2 ta korxona
```

**Ko'rmaslik kerak:**
```
❌ permission-denied
❌ Firebase xatosi
```

---

## 🎯 QISQA VARIANT

Agar yuqoridagi ko'rsatma uzun bo'lsa:

1. https://console.firebase.google.com/project/nbt-kpi/firestore/rules
2. Barcha matnni o'chiring
3. `firebase-rules.txt` faylidan nusxa oling
4. Qo'ying
5. **Publish** bosing

---

## 🐛 AGAR MUAMMO BO'LSA

### Muammo 1: "nbt-kpi" proyekti yo'q

**Yechim:**
- Boshqa Google akkaunt bilan kirgan bo'lishingiz mumkin
- To'g'ri akkauntni tanlang
- Yoki yangi proyekt yarating

### Muammo 2: "Publish" tugmasi yo'q

**Yechim:**
- Siz proyekt egasi emasligingiz mumkin
- Proyekt egasidan ruxsat so'rang

### Muammo 3: Publish qilgandan keyin ham xato

**Yechim:**
- Sahifani yangilang (F5)
- Cache'ni tozalang (Ctrl+Shift+Delete)
- Brauzerda incognito mode'da oching

---

## 📞 QO'SHIMCHA YORDAM

Agar hali ham ishlamasa:

1. Firebase Console'dagi screenshot yuboring
2. Browser Console'dagi xatolarni ko'rsating
3. Men boshqa yechim topaman

---

**Muvaffaqiyat tilaklar!** 🚀
