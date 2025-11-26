# 🛡️ Mehnat Muhofazasi Ko'p Korxonali Reyting Tizimi

## 📋 Loyiha Haqida

Bu tizim bir nechta korxonalarning mehnat muhofazasi (MM) samaradorligini baholash, avtomatik reyting bo'yicha tartiblash, taqqoslash va rang zonalari bilan vizualizatsiya qilish uchun mo'ljallangan.

## 📁 Fayllar

```
/home/ctrl/Documents/bak/
├── index.html       # Asosiy HTML fayl
├── styles.css       # Stillar va dizayn
├── app.js           # JavaScript logika
└── README.md        # Yo'riqnoma
```

## 🌐 Netlify Deploy Qilish

### 1. GitHub Repository Yaratish
```bash
cd /home/ctrl/Documents/bak
git init
git add .
git commit -m "Initial commit: MM Rating System"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Netlify Deploy
1. [Netlify](https://app.netlify.com) ga kiring
2. "Add new site" → "Import an existing project"
3. GitHub repository ni tanlang
4. Deploy tugmasini bosing

**Yoki Netlify CLI:**
```bash
npm install -g netlify-cli
cd /home/ctrl/Documents/bak
netlify deploy --prod
```

### 3. Drag & Drop Deploy
1. [Netlify Drop](https://app.netlify.com/drop) ga o'ting
2. `/home/ctrl/Documents/bak` papkasini drag & drop qiling
3. Tayyor!

## 💾 Ma'lumotlar Saqlash - MUHIM!

### LocalStorage Haqida

**Ma'lumotlar qayerda saqlanadi?**
- Brauzer **LocalStorage**'da saqlanadi
- Har bir domen uchun alohida
- Maksimal hajm: ~5-10 MB

**Reload qilganda o'chib ketadimi?**
❌ **YO'Q!** Ma'lumotlar saqlanadi:
- ✅ Sahifa yangilanganda (F5, Ctrl+R)
- ✅ Brauzer yopilganda
- ✅ Kompyuter o'chirilganda
- ✅ Netlify deploy qilinganda

**Ma'lumotlar qachon o'chadi?**
⚠️ Faqat quyidagi hollarda:
- Brauzer ma'lumotlarini tozalasangiz (Clear browsing data)
- LocalStorage'ni qo'lda tozalasangiz
- Boshqa brauzerda ochsangiz (har bir brauzer alohida)
- Boshqa kompyuterda ochsangiz

### Netlify Deploy va Ma'lumotlar

**Netlify'ga deploy qilganda:**
```
Sizning kompyuter:
  LocalStorage → Ma'lumotlar saqlanadi ✅

Netlify server:
  LocalStorage → Bo'sh (yangi foydalanuvchilar uchun) ✅

Boshqa foydalanuvchi:
  LocalStorage → O'z ma'lumotlari ✅
```

**Har bir foydalanuvchi:**
- O'z brauzerida o'z ma'lumotlarini saqlaydi
- Boshqa foydalanuvchilar ma'lumotlarini ko'rmaydi
- Bu **xavfsiz** va **shaxsiy**

### Ma'lumotlarni Backup Qilish

**1. Export funksiyasi (tavsiya etiladi):**
```
1. "💾 Eksport" tugmasini bosing
2. JSON fayl yuklab olinadi
3. Faylni xavfsiz joyda saqlang
```

**2. Import funksiyasi:**
```
1. "📥 Import" tugmasini bosing
2. Avval saqlangan JSON faylni tanlang
3. Ma'lumotlar tiklanadi
```

**3. Muntazam backup:**
```
- Har hafta eksport qiling
- Muhim ma'lumotlarni saqlang
- Bir nechta nusxada saqlang
```

### Ko'p Foydalanuvchi uchun

**Agar markazlashtirilgan ma'lumotlar kerak bo'lsa:**

Hozirgi tizim: Har bir foydalanuvchi o'z ma'lumotlarini ko'radi
Kerak bo'lsa: Backend server kerak (Node.js + MongoDB)

**Yechim 1: Export/Import (oddiy)**
```
1. Bitta kishi ma'lumotlarni kiritadi
2. Export qiladi
3. Boshqalarga JSON faylni yuboradi
4. Ular import qiladi
```

**Yechim 2: Backend (murakkab, kelajakda)**
```
- Node.js server
- MongoDB ma'lumotlar bazasi
- Barcha foydalanuvchilar bir xil ma'lumotni ko'radi
```

## 🚀 Ishga Tushirish

### Lokal (kompyuterda)
```bash
# Brauzerda ochish
xdg-open index.html

# Yoki
firefox index.html
google-chrome index.html
```

### Netlify'da
```
https://your-site-name.netlify.app
```

## ✨ Asosiy Funksiyalar

### 1. 📊 Reyting Jadvali
- Barcha korxonalar reytingi
- 🥇🥈🥉 Podium (top 3)
- Statistika kartochkalari
- Rang zonalari (🟢🟡🔴)

### 2. ➕ Korxona Qo'shish
- Korxona ma'lumotlarini kiritish
- 15 ta KPI ma'lumotlari
- Avtomatik hisoblash
- 📋 Namuna yuklash

### 3. ⚖️ Taqqoslash
- Bir nechta korxonani tanlash
- Taqqoslash jadvali
- Bar chart va Radar chart
- Eng yaxshi/yomon ko'rsatkichlar

### 4. 📈 Statistika
- MM Indeksi taqsimoti
- Zonalar bo'yicha taqsimot
- O'rtacha KPI ballari

## 🎯 Tezkor Boshlash

### 1-qadam: Birinchi korxonani qo'shing
1. "Korxona Qo'shish" tabini bosing
2. "📋 Namuna yuklash" tugmasini bosing
3. "💾 Saqlash" tugmasini bosing

### 2-qadam: Ma'lumotlarni backup qiling
1. "Reyting Jadvali" tabiga qayting
2. "💾 Eksport" tugmasini bosing
3. JSON faylni saqlang

### 3-qadam: Netlify'ga deploy qiling
1. GitHub'ga yuklang
2. Netlify'da import qiling
3. Deploy qiling

## 📊 15 ta KPI

1. **LTIFR** - Baxtsiz hodisalar (0.12)
2. **TRIR** - Jarohatlar (0.10)
3. **Noincident** - BH bo'lmagan kunlar (0.08)
4. **O'quv** - Trening (0.06)
5. **RA Coverage** - Xavf baholash (0.08)
6. **Near Miss** - Yaqin xato (0.06)
7. **Javob** - Murojaat javob (0.08)
8. **Profilaktika** - MM xarajatlari (0.08)
9. **SHHV** - Himoya vositalari (0.06)
10. **Uskuna** - Texnik tekshiruv (0.05)
11. **Inspeksiya** - Reja ijrosi (0.08)
12. **Kasbiy** - Kasalliklar (0.05)
13. **Rioya** - Talablarga rioya (0.05)
14. **FV** - Favqulodda vaziyat (0.05)
15. **Buzilish** - Buzilishlar (0.08)

## 🎨 Rang Zonalari

| Zona | Ball | Rang | Holat |
|------|------|------|-------|
| 🟢 Yashil | 80-100 | A'lo | Davom eting |
| 🟡 Sariq | 50-79 | Qoniqarli | Yaxshilang |
| 🔴 Qizil | 0-49 | Xavfli | Zudlik bilan chora |

## 🔧 Texnik Ma'lumotlar

### Texnologiyalar
- HTML5
- CSS3 (Dark Theme)
- JavaScript (ES6+)
- Chart.js 4.4.0
- LocalStorage API

### Brauzer Talablari
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Xususiyatlar
- ✅ Offline ishlash
- ✅ Responsiv dizayn
- ✅ Interaktiv grafiklar
- ✅ LocalStorage saqlash
- ✅ Export/Import

## ❓ Tez-tez So'raladigan Savollar

### Ma'lumotlar o'chib ketadimi?
**Yo'q!** LocalStorage'da doimiy saqlanadi. Faqat brauzer ma'lumotlarini tozalasangiz o'chadi.

### Netlify'da ma'lumotlar saqlanadimi?
**Ha!** Har bir foydalanuvchi o'z brauzerida o'z ma'lumotlarini saqlaydi.

### Boshqa kompyuterda ma'lumotlarim bormi?
**Yo'q.** Export/Import qiling yoki backend server qo'shing.

### Bir nechta kishi bir xil ma'lumotni ko'rishi kerakmi?
**Export/Import** yoki **Backend server** kerak.

### Grafiklar ko'rinmayapti?
Internet ulanishini tekshiring (Chart.js CDN kerak).

## 📝 Netlify Deploy Checklist

- [x] Fayllar to'g'ri nomlangan (index.html)
- [x] CSS va JS havolalar to'g'ri
- [x] Chart.js CDN mavjud
- [x] LocalStorage ishlaydi
- [x] Responsiv dizayn
- [x] README.md mavjud

## 🎓 Backup Strategiyasi

### Kundalik
- Yangi ma'lumot qo'shganda eksport qiling

### Haftalik
- Barcha ma'lumotlarni backup qiling
- Bir nechta joyda saqlang

### Oylik
- Tarixiy ma'lumotlarni arxivlang
- Eski backuplarni tekshiring

## 📞 Yordam

### Muammolar
1. Brauzer konsolini tekshiring (F12)
2. LocalStorage'ni tekshiring
3. Export qiling va qayta import qiling

### Qo'llab-quvvatlash
- GitHub Issues
- Email support
- Dokumentatsiya

---

**Versiya:** 2.0  
**Sana:** 2025-11-26  
**Holat:** ✅ Netlify uchun tayyor

**Deploy:** Netlify'ga yuklang! 🚀
# KPI_reyting
