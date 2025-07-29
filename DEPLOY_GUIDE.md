# 🚀 راهنمای Deploy Jobbaazar روی دامنه شما

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
5. **"Deploy" کلیک کنید**

#### **تنظیمات Vercel:**
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

---

### **3️⃣ دامنه را متصل کنید:**

#### **مراحل:**
1. **Vercel Dashboard → Settings → Domains**
2. **دامنه خود را اضافه کنید**
3. **DNS را تنظیم کنید**

#### **DNS Records:**
```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

### **4️⃣ Backend Deploy:**

#### **گزینه A: Vercel Functions (رایگان)**
```javascript
// api/worker.js
export default function handler(req, res) {
  // Backend logic here
}
```

#### **گزینه B: Railway (پیشنهاد می‌شود)**
1. **Railway.app بروید**
2. **GitHub repository را متصل کنید**
3. **Backend folder را انتخاب کنید**
4. **Environment variables تنظیم کنید**

#### **گزینه C: Render**
1. **Render.com بروید**
2. **Web Service ایجاد کنید**
3. **GitHub repository متصل کنید**
4. **Backend folder انتخاب کنید**

---

## 🔧 **تنظیمات Environment Variables:**

### **Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.jobbaazar.com
NEXT_PUBLIC_SITE_URL=https://jobbaazar.com
```

### **Backend (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobbaazar
JWT_SECRET=your-secret-key
PORT=5050
```

---

## 🌐 **دامنه‌های پیشنهادی:**

### **اگر دامنه ندارید:**
- `jobbaazar.com` - $12/year
- `jobbaazar.co.uk` - $15/year
- `jobbaazar.net` - $10/year
- `jobbaazar.org` - $12/year

### **سایت‌های خرید دامنه:**
- **Namecheap**: https://namecheap.com
- **GoDaddy**: https://godaddy.com
- **Google Domains**: https://domains.google
- **Cloudflare**: https://cloudflare.com

---

## 📱 **ویژگی‌های نهایی:**

### **وب اپلیکیشن کامل:**
- ✅ **Responsive Design**
- ✅ **PWA Support**
- ✅ **Offline Mode**
- ✅ **Push Notifications**
- ✅ **Mobile App-like Experience**

### **ویژگی‌های فنی:**
- ✅ **HTTPS/SSL**
- ✅ **CDN**
- ✅ **Auto-scaling**
- ✅ **Global CDN**
- ✅ **99.9% Uptime**

---

## 🎯 **نتیجه نهایی:**

### **آدرس‌های نهایی:**
- **Frontend**: `https://jobbaazar.com`
- **Backend API**: `https://api.jobbaazar.com`
- **Admin Panel**: `https://jobbaazar.com/admin`

### **ویژگی‌های کاربری:**
- 📱 **PWA نصب روی موبایل**
- 🌐 **وب اپلیکیشن کامل**
- 🔒 **امنیت بالا**
- ⚡ **عملکرد سریع**

---

## 🚀 **شروع سریع:**

### **برای تست فوری:**
1. **Vercel deploy کنید**
2. **دامنه رایگان دریافت کنید**
3. **تست کنید**

### **برای تولید:**
1. **دامنه بخرید**
2. **Vercel deploy کنید**
3. **دامنه را متصل کنید**
4. **SSL فعال کنید**

---

## 📞 **پشتیبانی:**

### **اگر مشکل داشتید:**
- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: https://github.com/[USERNAME]/jobbaazar/issues
- **Email**: support@jobbaazar.com

**Jobbaazar آماده برای دنیای اینترنت! 🌐✨** 