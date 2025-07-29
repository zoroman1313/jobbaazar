# 🚀 راهنمای Deploy Jobbaazar روی jobbaazar.co.uk (Krystal.io)

## 📋 **مراحل کامل Deploy:**

### **1️⃣ GitHub Repository ایجاد کنید:**

#### **مراحل:**
1. **GitHub.com بروید**
2. **حساب کاربری ایجاد کنید** (اگر ندارید)
3. **"New Repository" کلیک کنید**
4. **نام**: `jobbaazar`
5. **Public انتخاب کنید**
6. **"Create Repository" کلیک کنید**

#### **کدهای Terminal:**
```bash
# پروژه را به GitHub متصل کنید
git remote add origin https://github.com/[USERNAME]/jobbaazar.git
git branch -M main
git push -u origin main
```

---

### **2️⃣ Vercel Deploy:**

#### **مراحل:**
1. **Vercel.com بروید**
2. **حساب کاربری ایجاد کنید**
3. **"New Project" کلیک کنید**
4. **GitHub repository را انتخاب کنید**
5. **تنظیمات زیر را اعمال کنید:**

#### **تنظیمات Vercel:**
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

---

### **3️⃣ دامنه jobbaazar.co.uk را متصل کنید:**

#### **مراحل:**
1. **Vercel Dashboard → Settings → Domains**
2. **دامنه اضافه کنید**: `jobbaazar.co.uk`
3. **DNS را در Krystal.io تنظیم کنید**

#### **DNS Records در Krystal.io:**
```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

---

### **4️⃣ Backend Deploy روی Railway:**

#### **مراحل:**
1. **Railway.app بروید**
2. **GitHub repository را متصل کنید**
3. **Backend folder را انتخاب کنید**
4. **Environment variables تنظیم کنید**

#### **Environment Variables در Railway:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobbaazar
JWT_SECRET=your-super-secret-jwt-key-2024
PORT=5050
NODE_ENV=production
```

---

### **5️⃣ تنظیمات Krystal.io:**

#### **DNS Management:**
1. **Krystal.io Dashboard بروید**
2. **دامنه jobbaazar.co.uk را انتخاب کنید**
3. **DNS Records را اضافه کنید**

#### **SSL Certificate:**
1. **SSL/TLS → Let's Encrypt**
2. **Certificate را فعال کنید**
3. **HTTPS redirect فعال کنید**

---

## 🔧 **تنظیمات Environment Variables:**

### **Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.jobbaazar.co.uk
NEXT_PUBLIC_SITE_URL=https://jobbaazar.co.uk
NEXT_PUBLIC_APP_NAME=Jobbaazar
```

### **Backend (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobbaazar
JWT_SECRET=your-super-secret-jwt-key-2024
PORT=5050
NODE_ENV=production
CORS_ORIGIN=https://jobbaazar.co.uk
```

---

## 🌐 **آدرس‌های نهایی:**

### **پس از Deploy:**
- **Frontend**: `https://jobbaazar.co.uk`
- **Backend API**: `https://api.jobbaazar.co.uk`
- **Admin Panel**: `https://jobbaazar.co.uk/admin`
- **PWA**: `https://jobbaazar.co.uk` (نصب روی موبایل)

---

## 📱 **ویژگی‌های نهایی:**

### **وب اپلیکیشن کامل:**
- ✅ **Responsive Design**
- ✅ **PWA Support**
- ✅ **Offline Mode**
- ✅ **Push Notifications**
- ✅ **Mobile App-like Experience**

### **ویژگی‌های فنی:**
- ✅ **HTTPS/SSL** (Krystal.io)
- ✅ **CDN** (Vercel)
- ✅ **Auto-scaling**
- ✅ **Global CDN**
- ✅ **99.9% Uptime**

---

## 🚀 **شروع سریع:**

### **مراحل فوری:**
1. **GitHub repository ایجاد کنید**
2. **پروژه را push کنید**
3. **Vercel deploy کنید**
4. **دامنه را متصل کنید**
5. **Backend را روی Railway deploy کنید**

---

## 📞 **پشتیبانی:**

### **اگر مشکل داشتید:**
- **Krystal.io Support**: https://krystal.io/support
- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/support

**Jobbaazar آماده برای jobbaazar.co.uk! 🌐✨** 