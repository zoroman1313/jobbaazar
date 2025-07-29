"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaBell, 
  FaCheck, 
  FaArchive, 
  FaTrash, 
  FaFilter, 
  FaCog,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaExclamationTriangle,
  FaInfoCircle,
  FaClock,
  FaEnvelope,
  FaMobile,
  FaDesktop
} from 'react-icons/fa';

interface TranslationType {
  title: string;
  all: string;
  unread: string;
  read: string;
  archived: string;
  markAllRead: string;
  settings: string;
  filters: string;
  noNotifications: string;
  jobOffer: string;
  paymentReceived: string;
  reviewReceived: string;
  messageReceived: string;
  systemAlert: string;
  promotion: string;
  reminder: string;
  low: string;
  normal: string;
  high: string;
  urgent: string;
  inApp: string;
  push: string;
  email: string;
  sms: string;
  sound: string;
  vibration: string;
  save: string;
  cancel: string;
  back: string;
}

interface TranslationsType {
  en: TranslationType;
  fa: TranslationType;
  ar: TranslationType;
  tr: TranslationType;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  createdAt: Date;
  data: any;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'fa' | 'ar' | 'tr'>('en');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ترجمه‌ها
  const translations: TranslationsType = {
    en: {
      title: "Notifications",
      all: "All",
      unread: "Unread",
      read: "Read",
      archived: "Archived",
      markAllRead: "Mark All as Read",
      settings: "Settings",
      filters: "Filters",
      noNotifications: "No notifications",
      jobOffer: "Job Offer",
      paymentReceived: "Payment Received",
      reviewReceived: "Review Received",
      messageReceived: "Message Received",
      systemAlert: "System Alert",
      promotion: "Promotion",
      reminder: "Reminder",
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
      inApp: "In-App",
      push: "Push",
      email: "Email",
      sms: "SMS",
      sound: "Sound",
      vibration: "Vibration",
      save: "Save",
      cancel: "Cancel",
      back: "Back"
    },
    fa: {
      title: "اعلان‌ها",
      all: "همه",
      unread: "خوانده نشده",
      read: "خوانده شده",
      archived: "آرشیو شده",
      markAllRead: "علامت‌گذاری همه به عنوان خوانده شده",
      settings: "تنظیمات",
      filters: "فیلترها",
      noNotifications: "اعلانی وجود ندارد",
      jobOffer: "پیشنهاد کار",
      paymentReceived: "دریافت پرداخت",
      reviewReceived: "دریافت نظر",
      messageReceived: "دریافت پیام",
      systemAlert: "هشدار سیستم",
      promotion: "تبلیغات",
      reminder: "یادآوری",
      low: "کم",
      normal: "عادی",
      high: "زیاد",
      urgent: "فوری",
      inApp: "درون برنامه",
      push: "فشاری",
      email: "ایمیل",
      sms: "پیامک",
      sound: "صدا",
      vibration: "لرزش",
      save: "ذخیره",
      cancel: "لغو",
      back: "بازگشت"
    },
    ar: {
      title: "الإشعارات",
      all: "الكل",
      unread: "غير مقروء",
      read: "مقروء",
      archived: "مؤرشف",
      markAllRead: "تحديد الكل كمقروء",
      settings: "الإعدادات",
      filters: "المرشحات",
      noNotifications: "لا توجد إشعارات",
      jobOffer: "عرض عمل",
      paymentReceived: "تم استلام الدفع",
      reviewReceived: "تم استلام تقييم",
      messageReceived: "تم استلام رسالة",
      systemAlert: "تنبيه النظام",
      promotion: "ترويج",
      reminder: "تذكير",
      low: "منخفض",
      normal: "عادي",
      high: "عالي",
      urgent: "عاجل",
      inApp: "في التطبيق",
      push: "دفع",
      email: "البريد الإلكتروني",
      sms: "رسالة نصية",
      sound: "صوت",
      vibration: "اهتزاز",
      save: "حفظ",
      cancel: "إلغاء",
      back: "رجوع"
    },
    tr: {
      title: "Bildirimler",
      all: "Tümü",
      unread: "Okunmamış",
      read: "Okunmuş",
      archived: "Arşivlenmiş",
      markAllRead: "Tümünü Okundu Olarak İşaretle",
      settings: "Ayarlar",
      filters: "Filtreler",
      noNotifications: "Bildirim yok",
      jobOffer: "İş Teklifi",
      paymentReceived: "Ödeme Alındı",
      reviewReceived: "Değerlendirme Alındı",
      messageReceived: "Mesaj Alındı",
      systemAlert: "Sistem Uyarısı",
      promotion: "Promosyon",
      reminder: "Hatırlatma",
      low: "Düşük",
      normal: "Normal",
      high: "Yüksek",
      urgent: "Acil",
      inApp: "Uygulama İçi",
      push: "Push",
      email: "E-posta",
      sms: "SMS",
      sound: "Ses",
      vibration: "Titreşim",
      save: "Kaydet",
      cancel: "İptal",
      back: "Geri"
    }
  };

  const t = translations[lang];

  // داده‌های نمونه اعلان‌ها
  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: 'job_offer',
      title: 'New Job Offer',
      content: 'You have received a new job offer for construction work in London.',
      status: 'unread',
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      data: { jobId: '123', amount: 150, currency: 'GBP' }
    },
    {
      id: 2,
      type: 'payment_received',
      title: 'Payment Received',
      content: 'You have received £200 for the completed construction project.',
      status: 'read',
      priority: 'normal',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      data: { amount: 200, currency: 'GBP' }
    },
    {
      id: 3,
      type: 'review_received',
      title: 'New Review',
      content: 'Ahmed has left you a 5-star review for your work.',
      status: 'unread',
      priority: 'normal',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      data: { rating: 5, reviewId: '456' }
    },
    {
      id: 4,
      type: 'message_received',
      title: 'New Message',
      content: 'You have a new message from your employer.',
      status: 'read',
      priority: 'low',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      data: { messageId: '789' }
    },
    {
      id: 5,
      type: 'system_alert',
      title: 'System Maintenance',
      content: 'The system will be under maintenance tonight from 2-4 AM.',
      status: 'read',
      priority: 'normal',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      data: {}
    }
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLang(savedLang as 'en' | 'fa' | 'ar' | 'tr');
    
    // شبیه‌سازی بارگذاری داده‌ها
    setTimeout(() => {
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => n.status === 'unread').length);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job_offer': return <FaStar style={{ color: '#ffc107' }} />;
      case 'payment_received': return <FaEnvelope style={{ color: '#28a745' }} />;
      case 'review_received': return <FaStar style={{ color: '#ffc107' }} />;
      case 'message_received': return <FaEnvelope style={{ color: '#007bff' }} />;
      case 'system_alert': return <FaExclamationTriangle style={{ color: '#dc3545' }} />;
      case 'promotion': return <FaInfoCircle style={{ color: '#17a2b8' }} />;
      case 'reminder': return <FaClock style={{ color: '#6c757d' }} />;
      default: return <FaBell style={{ color: '#6c757d' }} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'normal': return '#28a745';
      case 'low': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return t.back;
    return `${days}d`;
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, status: 'read' } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, status: 'read' }))
    );
    setUnreadCount(0);
  };

  const archiveNotification = (id: number) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== id)
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== id)
    );
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return n.status !== 'deleted';
    return n.status === filter;
  });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: lang === 'fa' ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>
          {lang === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}
        </div>
      </div>
    );
  }

  type FilterType = 'all' | 'unread' | 'read' | 'archived';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: lang === 'fa' ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px'
            }}
          >
            <FaArrowLeft />
          </button>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            {t.title}
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px'
            }}
          >
            <FaCog />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {(['all', 'unread', 'read', 'archived'] as FilterType[]).map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              background: filter === filterType ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: filter === filterType ? 'bold' : 'normal'
            }}
          >
            {t[filterType]}
          </button>
        ))}
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: 'auto'
            }}
          >
            {t.markAllRead}
          </button>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
            {t.settings}
          </h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                {t.inApp}
              </h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <FaDesktop style={{ color: '#007bff' }} />
                  {t.inApp}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <FaMobile style={{ color: '#28a745' }} />
                  {t.push}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" />
                  <FaEnvelope style={{ color: '#ffc107' }} />
                  {t.email}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" />
                  <FaBell style={{ color: '#dc3545' }} />
                  {t.sms}
                </label>
              </div>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                {t.sound}
              </h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  {t.sound}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  {t.vibration}
                </label>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: '#28a745',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {t.save}
            </button>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: '#6c757d',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: '#666',
            backdropFilter: 'blur(10px)'
          }}>
            <FaBell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <div>{t.noNotifications}</div>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '16px',
                backdropFilter: 'blur(10px)',
                border: notification.status === 'unread' ? '2px solid #007bff' : '2px solid transparent',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ marginTop: '4px' }}>
                  {getTypeIcon(notification.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      color: notification.status === 'unread' ? '#007bff' : '#333'
                    }}>
                      {notification.title}
                    </h3>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getPriorityColor(notification.priority)
                    }} />
                  </div>
                  
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    color: '#666', 
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {notification.content}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    <span>{formatTime(notification.createdAt)}</span>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {notification.status === 'unread' && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#007bff',
                            fontSize: '12px'
                          }}
                        >
                          <FaCheck />
                        </button>
                      )}
                      
                      <button
                        onClick={() => archiveNotification(notification.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#6c757d',
                          fontSize: '12px'
                        }}
                      >
                        <FaArchive />
                      </button>
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#dc3545',
                          fontSize: '12px'
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 