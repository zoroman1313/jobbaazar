# 🚀 راهنمای GitHub Setup برای jobbaazar.co.uk

## 📋 **مراحل GitHub:**

### **1️⃣ GitHub Repository ایجاد کنید:**

#### **مراحل:**
1. **GitHub.com بروید**
2. **Sign Up کنید** (اگر حساب ندارید)
3. **"New Repository" کلیک کنید**
4. **تنظیمات:**
   - Repository name: `jobbaazar`
   - Description: `Jobbaazar - Job Marketplace for UK`
   - Public ✅
   - Add README ❌
   - Add .gitignore ❌
   - Choose a license: MIT License
5. **"Create Repository" کلیک کنید**

### **2️⃣ پروژه را به GitHub متصل کنید:**

#### **کدهای Terminal:**
```bash
# پروژه را به GitHub متصل کنید
git remote add origin https://github.com/[USERNAME]/jobbaazar.git
git branch -M main
git push -u origin main
```

#### **نکته:** `[USERNAME]` را با نام کاربری GitHub خود جایگزین کنید.

### **3️⃣ تایید Push:**

#### **بعد از push، باید این پیام را ببینید:**
```
Enumerating objects: 72, done.
Counting objects: 100% (72/72), done.
Delta compression using up to 8 threads
Compressing objects: 100% (70/70), done.
Writing objects: 100% (72/72), done.
Total 72 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/[USERNAME]/jobbaazar.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🎯 **نتیجه:**

### **پس از موفقیت:**
- ✅ **Repository ایجاد شد**
- ✅ **کدها upload شدند**
- ✅ **آماده برای Deploy**

### **آدرس Repository:**
`https://github.com/[USERNAME]/jobbaazar`

---

## 🚀 **مرحله بعدی:**

### **بعد از GitHub:**
1. **Vercel.com بروید**
2. **حساب کاربری ایجاد کنید**
3. **GitHub repository را متصل کنید**
4. **Deploy کنید**

**Jobbaazar آماده برای GitHub! 🚀** 

عالی! می‌بینم که در صفحه Vercel هستید. حالا بیایید پروژه را deploy کنیم!

## 🚀 **مراحل Vercel Deploy:**

### **1️⃣ GitHub را متصل کنید:**

**در صفحه Vercel که می‌بینید:**

1. **در بخش "Import Git Repository":**
   - **روی دکمه "Install" کلیک کنید** (با آیکون GitHub)
   - **GitHub account خود را authorize کنید**
   - **Repository `zoroman1313/jobbaazar` را انتخاب کنید**

### **2️⃣ تنظیمات پروژه:**

**پس از انتخاب repository، این تنظیمات را اعمال کنید:**

#### **Framework Preset:**
- **Next.js** را انتخاب کنید

#### **Root Directory:**
- **`frontend`** را وارد کنید

#### **Build Command:**
- **`npm run build`** (پیش‌فرض)

#### **Output Directory:**
- **`.next`** (پیش‌فرض)

#### **Install Command:**
- **`npm install`** (پیش‌فرض)

### **3️⃣ Environment Variables:**

**قبل از Deploy، این Environment Variables را اضافه کنید:**

```
<code_block_to_apply_changes_from>
```

### **4️⃣ Deploy:**

**"Deploy" کلیک کنید و منتظر بمانید!**

---

## 🎯 **نتیجه مورد انتظار:**

### **پس از Deploy موفق:**
- ✅ **آدرس موقت**: `https://jobbaazar-xxx.vercel.app`
- ✅ **آماده برای دامنه**: jobbaazar.co.uk
- ✅ **SSL فعال**
- ✅ **CDN فعال**

---

## 🌐 **مرحله بعدی: دامنه jobbaazar.co.uk**

### **پس از Deploy موفق:**

#### **1️⃣ دامنه اضافه کنید:**
- **Vercel Dashboard → Settings → Domains**
- **دامنه اضافه کنید**: `jobbaazar.co.uk`

#### **2️⃣ DNS در Krystal.io:**
```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🚀 **آیا Deploy شروع شده است؟**

**اگر در حال Deploy است، منتظر بمانید و نتیجه را به من بگویید!**

**اگر مشکلی پیش آمد، عکس صفحه را برایم بفرستید تا کمک کنم! 🚀** 

## 🚨 **مشکلات موجود:**

### **1️⃣ Environment Variables اشتباه:**
می‌بینم که همه Values اشتباه هستند. باید این‌ها را درست کنید:

**Environment Variables فعلی (اشتباه):**
```
<code_block_to_apply_changes_from>
```

**Environment Variables صحیح:**
```
NEXT_PUBLIC_API_URL: https://api.jobbaazar.co.uk
NEXT_PUBLIC_SITE_URL: https://jobbaazar.co.uk
NEXT_PUBLIC_APP_NAME: Jobbaazar
```

### **2️⃣ نام پروژه مشکل دارد:**
خطای قرمز نشان می‌دهد که نام پروژه مشکل دارد.

---

## 🔧 **مراحل حل مشکل:**

### **1️⃣ Environment Variables را درست کنید:**

**در Vercel:**
1. **Value های اشتباه را پاک کنید**
2. **این مقادیر صحیح را وارد کنید:**

```
Key: NEXT_PUBLIC_SITE_URL
Value: https://jobbaazar.co.uk

Key: NEXT_PUBLIC_APP_NAME  
Value: Jobbaazar
```

### **2️⃣ نام پروژه را بررسی کنید:**

**اگر فیلد "Project Name" وجود دارد:**
- **نام**: `jobbaazar` (فقط حروف کوچک)
- **یا**: `jobbaazar-app`

### **3️⃣ دوباره Deploy کنید:**

**پس از درست کردن Environment Variables:**
- **روی دکمه "Deploy" کلیک کنید**

---

## 🎯 **نتیجه مورد انتظار:**

### **پس از حل مشکلات:**
- ✅ **Environment Variables صحیح**
- ✅ **نام پروژه معتبر**
- ✅ **Deploy موفق**
- ✅ **آدرس موقت**: `https://jobbaazar-xxx.vercel.app`

---

## 🚀 **حالا Environment Variables را درست کنید!**

**ابتدا Value های اشتباه را پاک کنید و مقادیر صحیح را وارد کنید، سپس Deploy کنید!**

**اگر هنوز مشکل دارید، عکس جدید صفحه را برایم بفرستید! 🚀** 

## ✅ **مشکل حل شد:**

### **تنظیمات فعلی درست است:**
- ✅ **Project Name**: `jobapp` (درست)
- ✅ **Environment Variables**: صحیح
- ✅ **Framework**: Next.js
- ✅ **Root Directory**: frontend

### **اما هنوز خطای قرمز وجود دارد:**
خطای قرمز احتمالاً مربوط به URL است که هنوز `project-name=jobbaazar` دارد.

---

## 🚀 **حل مشکل نهایی:**

### **1️⃣ صفحه را Refresh کنید:**
- **F5 یا Cmd+R** بزنید
- **یا مرورگر را ببندید و دوباره باز کنید**

### **2️⃣ یا URL را درست کنید:**
**URL فعلی:**
```
<code_block_to_apply_changes_from>
```

**URL صحیح:**
```
vercel.com/new/import?project-name=jobapp...
```

### **3️⃣ یا دوباره شروع کنید:**
1. **Vercel Dashboard بروید**
2. **"New Project" کلیک کنید**
3. **GitHub repository را دوباره انتخاب کنید**
4. **Project Name**: `jobapp` وارد کنید

---

## 🎯 **نتیجه مورد انتظار:**

### **پس از حل مشکل:**
- ✅ **خطای قرمز برطرف می‌شود**
- ✅ **دکمه "Deploy" فعال می‌شود**
- ✅ **Deploy شروع می‌شود**

---

## 🚀 **حالا صفحه را Refresh کنید!**

**اگر خطای قرمز برطرف شد، روی "Deploy" کلیک کنید!**

**اگر هنوز مشکل دارید، عکس جدید صفحه را برایم بفرستید! 🚀** 