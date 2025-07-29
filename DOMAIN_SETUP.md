# 🌐 راهنمای خرید و راه‌اندازی دامنه Jobbaazar

## 🚀 **روش اول: خرید دامنه (Domain)**

### **سایت‌های معتبر خرید دامنه:**

#### **1. Namecheap (پیشنهاد می‌شود):**
- **آدرس**: https://namecheap.com
- **قیمت**: از $10 در سال
- **مزایا**: ارزان، امن، پشتیبانی خوب
- **دامنه‌های پیشنهادی**:
  - `jobbaazar.com` - $12/year
  - `jobbaazar.co.uk` - $15/year
  - `jobbaazar.net` - $10/year
  - `jobbaazar.org` - $12/year

#### **2. GoDaddy:**
- **آدرس**: https://godaddy.com
- **قیمت**: از $12 در سال
- **مزایا**: معروف، پشتیبانی فارسی

#### **3. Google Domains:**
- **آدرس**: https://domains.google
- **قیمت**: از $12 در سال
- **مزایا**: امن، یکپارچه با Google

#### **4. Cloudflare:**
- **آدرس**: https://cloudflare.com
- **قیمت**: از $8 در سال
- **مزایا**: امنیت بالا، CDN رایگان

---

## 🛒 **مراحل خرید دامنه:**

### **1. انتخاب دامنه:**
```
پیشنهادات:
- jobbaazar.com (بهترین)
- jobbaazar.co.uk (برای UK)
- jobbaazar.net (جایگزین)
- jobbaazar.org (سازمانی)
```

### **2. ثبت‌نام و خرید:**
1. **حساب کاربری ایجاد کنید**
2. **دامنه مورد نظر را جستجو کنید**
3. **قیمت را بررسی کنید**
4. **پرداخت کنید**
5. **DNS را تنظیم کنید**

### **3. تنظیم DNS:**
```
A Record: @ → [IP-SERVER]
CNAME: www → jobbaazar.com
```

---

## ☁️ **روش دوم: Hosting رایگان**

### **1. Vercel (پیشنهاد می‌شود):**

#### **مراحل:**
1. **حساب Vercel ایجاد کنید**: https://vercel.com
2. **پروژه را push کنید**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
3. **Vercel را به GitHub متصل کنید**
4. **اتوماتیک deploy می‌شود**
5. **دامنه رایگان دریافت می‌کنید**: `jobbaazar.vercel.app`

#### **مزایا:**
- ✅ رایگان
- ✅ SSL رایگان
- ✅ CDN رایگان
- ✅ اتوماتیک deploy
- ✅ عملکرد عالی

### **2. Netlify:**

#### **مراحل:**
1. **حساب Netlify ایجاد کنید**: https://netlify.com
2. **پروژه را drag & drop کنید**
3. **دامنه رایگان**: `jobbaazar.netlify.app`

### **3. GitHub Pages:**

#### **مراحل:**
1. **Repository را public کنید**
2. **Settings → Pages**
3. **دامنه رایگان**: `username.github.io/jobbaazar`

---

## 🔧 **روش سوم: VPS + دامنه**

### **1. خرید VPS:**
- **DigitalOcean**: از $5/ماه
- **Linode**: از $5/ماه
- **Vultr**: از $2.50/ماه
- **AWS**: از $3/ماه

### **2. راه‌اندازی سرور:**
```bash
# نصب Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# نصب PM2
npm install -g pm2

# راه‌اندازی اپلیکیشن
pm2 start backend/index.js --name "jobbaazar-backend"
pm2 start frontend/package.json --name "jobbaazar-frontend"
```

### **3. تنظیم Nginx:**
```nginx
server {
    listen 80;
    server_name jobbaazar.com www.jobbaazar.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:5050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📱 **روش چهارم: Mobile App Stores**

### **1. App Store (iOS):**
- **هزینه**: $99/سال
- **مراحل**: 
  1. Apple Developer Account
  2. React Native یا Flutter
  3. Build و Submit

### **2. Google Play Store:**
- **هزینه**: $25 (یکبار)
- **مراحل**:
  1. Google Developer Account
  2. React Native یا Flutter
  3. Build و Submit

---

## 💰 **مقایسه هزینه‌ها:**

| روش | هزینه سالانه | سختی | کیفیت |
|-----|-------------|------|-------|
| دامنه + Vercel | $12 | آسان | عالی |
| دامنه + VPS | $60+ | متوسط | عالی |
| فقط Vercel | رایگان | آسان | خوب |
| App Store | $99+ | سخت | عالی |

---

## 🚀 **پیشنهاد بهترین روش:**

### **برای شروع (مقاوم):**
1. **دامنه بخرید**: `jobbaazar.com` ($12/سال)
2. **Vercel استفاده کنید** (رایگان)
3. **دامنه را به Vercel متصل کنید**

### **مراحل:**
1. **دامنه بخرید از Namecheap**
2. **پروژه را در Vercel deploy کنید**
3. **DNS را تنظیم کنید**
4. **SSL فعال کنید**

---

## 🔧 **تنظیمات فنی:**

### **1. Environment Variables:**
```env
# .env
NEXT_PUBLIC_API_URL=https://api.jobbaazar.com
NEXT_PUBLIC_SITE_URL=https://jobbaazar.com
```

### **2. CORS Settings:**
```javascript
// backend/index.js
app.use(cors({
  origin: ['https://jobbaazar.com', 'https://www.jobbaazar.com'],
  credentials: true
}));
```

### **3. PWA Settings:**
```json
// manifest.json
{
  "start_url": "https://jobbaazar.com",
  "scope": "https://jobbaazar.com"
}
```

---

## 📞 **پشتیبانی:**

### **برای کمک:**
- **Namecheap Support**: 24/7
- **Vercel Support**: Community + Email
- **DNS Help**: https://dnschecker.org

### **اطلاعات تماس:**
- **Email**: support@jobbaazar.com
- **Telegram**: @jobbaazar_support

---

## 🎯 **نکات مهم:**

### **امنیت:**
1. **SSL فعال کنید** (HTTPS)
2. **DNS Security فعال کنید**
3. **Backup منظم تهیه کنید**
4. **Monitoring فعال کنید**

### **SEO:**
1. **Meta tags درست تنظیم کنید**
2. **Sitemap ایجاد کنید**
3. **Google Analytics اضافه کنید**
4. **Mobile-friendly باشید**

---

## 🚀 **شروع سریع:**

### **برای تست فوری:**
1. **Vercel حساب ایجاد کنید**
2. **پروژه را push کنید**
3. **دامنه رایگان دریافت کنید**
4. **تست کنید**

### **برای تولید:**
1. **دامنه بخرید**
2. **Vercel deploy کنید**
3. **DNS تنظیم کنید**
4. **SSL فعال کنید**

**Jobbaazar آماده برای دنیای اینترنت! 🌐✨** 