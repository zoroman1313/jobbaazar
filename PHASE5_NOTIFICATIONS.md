# فاز 5: سیستم اعلان‌ها و پیام‌رسانی (Phase 5: Notifications and Messaging System)

## 📋 خلاصه فاز 5

فاز 5 شامل پیاده‌سازی سیستم جامع اعلان‌ها و پیام‌رسانی برای اپلیکیشن Jobbaazar است. این فاز امکانات ارتباطی پیشرفته‌ای را برای کاربران فراهم می‌کند.

### 🎯 ویژگی‌های اصلی

#### 🔔 سیستم اعلان‌ها
- **اعلان‌های فوری (Push Notifications)**
- **اعلان‌های درون‌برنامه‌ای**
- **اعلان‌های ایمیل و SMS**
- **مدیریت اولویت‌ها و کانال‌ها**
- **تنظیمات شخصی‌سازی**

#### 💬 سیستم پیام‌رسانی
- **چت خصوصی بین کاربران**
- **چت گروهی برای پروژه‌ها**
- **چت‌های کاری**
- **ارسال فایل و عکس**
- **واکنش‌ها و نقل قول**

## 🏗️ ساختار فایل‌ها

### Backend Models
```
backend/models/
├── Notification.js     # مدل اعلان‌ها
├── Message.js          # مدل پیام‌ها
└── Chat.js             # مدل چت‌ها
```

### Backend Routes
```
backend/routes/
├── notification.js     # API اعلان‌ها
└── message.js          # API پیام‌رسانی
```

### Frontend Pages
```
frontend/app/
├── notifications/      # صفحه اعلان‌ها
│   └── page.tsx
└── messages/           # صفحه پیام‌رسانی
    └── page.tsx
```

## 🎨 طراحی UI/UX

### صفحه اعلان‌ها
- **لیست اعلان‌ها با فیلترهای مختلف**
- **علامت‌گذاری خوانده شده/نشده**
- **تنظیمات اعلان‌ها**
- **آمار و گزارش‌گیری**

### صفحه پیام‌رسانی
- **لیست چت‌ها با جستجو**
- **نمایش پیام‌ها به صورت real-time**
- **ارسال پیام با فایل‌های پیوست**
- **وضعیت آنلاین کاربران**

## 🔧 API Endpoints

### اعلان‌ها (Notifications)

#### دریافت اعلان‌ها
```http
GET /api/notification
GET /api/notification?status=unread&type=job_offer&page=1&limit=20
```

#### تعداد اعلان‌های خوانده نشده
```http
GET /api/notification/unread-count
```

#### ایجاد اعلان جدید
```http
POST /api/notification
Content-Type: application/json

{
  "type": "job_offer",
  "title": "New Job Offer",
  "content": "You have received a new job offer",
  "priority": "high",
  "channels": {
    "inApp": true,
    "push": true,
    "email": false
  }
}
```

#### علامت‌گذاری به عنوان خوانده شده
```http
PUT /api/notification/:id/read
PUT /api/notification/read-all
```

#### آرشیو و حذف
```http
PUT /api/notification/:id/archive
DELETE /api/notification/:id
```

#### تنظیمات اعلان‌ها
```http
PUT /api/notification/settings
Content-Type: application/json

{
  "inApp": true,
  "push": true,
  "email": false,
  "sms": false,
  "sound": true,
  "vibration": true
}
```

### پیام‌رسانی (Messaging)

#### دریافت چت‌ها
```http
GET /api/message/chats?page=1&limit=20
```

#### دریافت پیام‌های چت
```http
GET /api/message/chat/:chatId?page=1&limit=50
```

#### ارسال پیام جدید
```http
POST /api/message/chat/:chatId
Content-Type: application/json

{
  "messageType": "text",
  "content": {
    "text": "Hello, how are you?"
  }
}
```

#### ایجاد چت جدید
```http
POST /api/message/chat
Content-Type: application/json

{
  "type": "private",
  "participants": ["user1", "user2"]
}
```

#### علامت‌گذاری پیام‌ها
```http
PUT /api/message/:messageId/read
PUT /api/message/chat/:chatId/read-all
```

#### واکنش‌ها
```http
POST /api/message/:messageId/reaction
Content-Type: application/json

{
  "emoji": "👍"
}
```

## 📊 مدل داده

### Notification Schema
```javascript
{
  user: ObjectId,           // کاربر
  type: String,             // نوع اعلان
  title: String,            // عنوان
  content: String,          // محتوا
  data: Object,             // داده‌های اضافی
  priority: String,         // اولویت
  status: String,           // وضعیت
  channels: Object,         // کانال‌های ارسال
  delivery: Object,         // وضعیت تحویل
  settings: Object,         // تنظیمات
  scheduledAt: Date,        // زمان‌بندی
  expiresAt: Date,          // انقضا
  metadata: Object,         // متادیتا
  stats: Object,            // آمار
  createdAt: Date,
  updatedAt: Date
}
```

### Message Schema
```javascript
{
  chatType: String,         // نوع چت
  chatId: ObjectId,         // شناسه چت
  sender: ObjectId,         // فرستنده
  recipients: Array,        // گیرندگان
  messageType: String,      // نوع پیام
  content: Object,          // محتوا
  status: String,           // وضعیت
  replyTo: ObjectId,        // پاسخ به
  quote: Object,            // نقل قول
  settings: Object,         // تنظیمات
  metadata: Object,         // متادیتا
  stats: Object,            // آمار
  reactions: Array,         // واکنش‌ها
  tags: Array,              // برچسب‌ها
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Schema
```javascript
{
  type: String,             // نوع چت
  name: String,             // نام
  description: String,      // توضیحات
  avatar: Object,           // عکس
  participants: Array,      // اعضا
  jobInfo: Object,          // اطلاعات کار
  projectInfo: Object,      // اطلاعات پروژه
  lastMessage: Object,      // آخرین پیام
  stats: Object,            // آمار
  settings: Object,         // تنظیمات
  metadata: Object,         // متادیتا
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 نحوه استفاده

### 1. راه‌اندازی Backend
```bash
cd backend
npm install
npm start
```

### 2. راه‌اندازی Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. تست API
```bash
# تست اعلان‌ها
curl -X GET "http://localhost:5000/api/notification"

# تست پیام‌رسانی
curl -X GET "http://localhost:5000/api/message/chats"
```

### 4. دسترسی به صفحات
- **اعلان‌ها**: `http://localhost:3004/notifications`
- **پیام‌رسانی**: `http://localhost:3004/messages`

## 🎯 ویژگی‌های پیشرفته

### سیستم اعلان‌ها
- **انواع اعلان**: پیشنهاد کار، پرداخت، نظر، پیام، هشدار سیستم
- **اولویت‌ها**: کم، عادی، زیاد، فوری
- **کانال‌ها**: درون برنامه، push، ایمیل، SMS
- **زمان‌بندی**: ارسال در زمان مشخص
- **انقضا**: حذف خودکار پس از مدت معین

### سیستم پیام‌رسانی
- **انواع چت**: خصوصی، گروهی، کاری، پروژه
- **انواع پیام**: متن، عکس، ویدیو، صوت، فایل، موقعیت
- **واکنش‌ها**: emoji reactions
- **نقل قول**: پاسخ به پیام خاص
- **وضعیت**: ارسال شده، تحویل شده، خوانده شده

## 🔒 امنیت و حریم خصوصی

### احراز هویت
- بررسی عضویت کاربر در چت
- تأیید مالکیت اعلان‌ها
- کنترل دسترسی بر اساس نقش

### رمزگذاری
- رمزگذاری پیام‌های حساس
- حفاظت از داده‌های شخصی
- امنیت انتقال داده‌ها

## 📈 عملکرد و بهینه‌سازی

### ایندکس‌ها
- ایندکس بر اساس کاربر و زمان
- ایندکس برای جستجوی سریع
- ایندکس برای فیلترها

### Pagination
- بارگذاری تدریجی پیام‌ها
- محدودیت تعداد نتایج
- بهینه‌سازی حافظه

## 🔮 ویژگی‌های آینده

### اعلان‌ها
- **اعلان‌های هوشمند**: بر اساس رفتار کاربر
- **گروه‌بندی**: دسته‌بندی اعلان‌ها
- **فیلترهای پیشرفته**: بر اساس نوع و زمان
- **آمار دقیق**: تحلیل رفتار کاربران

### پیام‌رسانی
- **تماس صوتی و تصویری**: درون برنامه
- **پیام‌های صوتی**: ضبط و ارسال
- **استیکر و GIF**: محتوای سرگرم‌کننده
- **جستجوی پیشرفته**: در پیام‌ها و فایل‌ها
- **آرشیو هوشمند**: مدیریت خودکار چت‌ها

## 🛠️ تکنولوژی‌های استفاده شده

### Backend
- **Node.js/Express**: سرور API
- **MongoDB/Mongoose**: دیتابیس
- **WebSocket**: ارتباط real-time
- **JWT**: احراز هویت

### Frontend
- **Next.js**: فریم‌ورک React
- **TypeScript**: زبان برنامه‌نویسی
- **React Icons**: آیکون‌ها
- **CSS-in-JS**: استایل‌دهی

### DevOps
- **Docker**: کانتینرسازی
- **MongoDB Atlas**: دیتابیس ابری
- **Redis**: کش و session
- **Nginx**: reverse proxy

## 📝 نکات مهم

### عملکرد
- استفاده از ایندکس‌های مناسب
- بهینه‌سازی کوئری‌ها
- کش کردن داده‌های پرتکرار

### مقیاس‌پذیری
- طراحی برای تعداد زیاد کاربر
- توزیع بار مناسب
- مدیریت حافظه

### قابلیت نگهداری
- کد تمیز و مستند
- تست‌های جامع
- لاگ‌گیری مناسب

---

## ✅ نتیجه‌گیری

فاز 5 با موفقیت پیاده‌سازی شد و شامل:

- ✅ **سیستم اعلان‌های جامع**
- ✅ **سیستم پیام‌رسانی پیشرفته**
- ✅ **UI/UX مدرن و کاربرپسند**
- ✅ **API های کامل و مستند**
- ✅ **امنیت و حریم خصوصی**
- ✅ **عملکرد بهینه**

این فاز پایه‌ای قوی برای ارتباطات کاربران در اپلیکیشن Jobbaazar فراهم می‌کند. 