"use client";
import { useState, useEffect } from "react";
import { FaShieldAlt, FaEye, FaDownload, FaTrash, FaCog, FaHistory, FaExclamationTriangle, FaCheck, FaTimes, FaUserSecret, FaCookieBite, FaGavel } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [privacyData, setPrivacyData] = useState<any>(null);
  const [consentData, setConsentData] = useState({
    personalData: false,
    marketingData: false,
    analyticsData: false,
    thirdPartyData: false
  });
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    searchVisibility: "public",
    contactVisibility: "public",
    allowAnalytics: true,
    allowMarketing: false
  });
  const router = useRouter();

  const translations = {
    en: {
      title: "Privacy Settings",
      overview: "Overview",
      consent: "Data Consent",
      cookies: "Cookie Preferences",
      settings: "Privacy Settings",
      rights: "Data Rights",
      exports: "Data Exports",
      breaches: "Data Breaches",
      compliance: "Compliance",
      privacyStatus: "Privacy Status",
      dataConsent: "Data Consent",
      cookieConsent: "Cookie Consent",
      privacySettings: "Privacy Settings",
      dataRights: "Data Rights",
      pendingRequests: "Pending Requests",
      dataExports: "Data Exports",
      dataBreaches: "Data Breaches",
      personalData: "Personal Data",
      marketingData: "Marketing Data",
      analyticsData: "Analytics Data",
      thirdPartyData: "Third Party Data",
      necessary: "Necessary",
      functional: "Functional",
      analytics: "Analytics",
      marketing: "Marketing",
      profileVisibility: "Profile Visibility",
      searchVisibility: "Search Visibility",
      contactVisibility: "Contact Visibility",
      allowAnalytics: "Allow Analytics",
      allowMarketing: "Allow Marketing",
      public: "Public",
      contacts: "Contacts Only",
      private: "Private",
      rightToAccess: "Right to Access",
      rightToRectification: "Right to Rectification",
      rightToErasure: "Right to Erasure",
      rightToPortability: "Right to Portability",
      requestData: "Request Data",
      requestDeletion: "Request Deletion",
      requestExport: "Request Export",
      downloadData: "Download Data",
      viewBreaches: "View Breaches",
      complianceLog: "Compliance Log",
      acceptTerms: "Accept Terms",
      acceptPolicy: "Accept Privacy Policy",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      back: "Back",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
      description: "Description",
      verificationMethod: "Verification Method",
      email: "Email",
      phone: "Phone",
      format: "Format",
      json: "JSON",
      csv: "CSV",
      xml: "XML",
      pdf: "PDF",
      status: "Status",
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      rejected: "Rejected",
      severity: "Severity",
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
      actionRequired: "Action Required",
      read: "Mark as Read",
      timestamp: "Timestamp",
      action: "Action",
      details: "Details"
    },
    fa: {
      title: "تنظیمات حریم خصوصی",
      overview: "نمای کلی",
      consent: "رضایت داده",
      cookies: "تنظیمات کوکی",
      settings: "تنظیمات حریم خصوصی",
      rights: "حقوق داده",
      exports: "خروجی داده",
      breaches: "نشت داده",
      compliance: "انطباق",
      privacyStatus: "وضعیت حریم خصوصی",
      dataConsent: "رضایت داده",
      cookieConsent: "رضایت کوکی",
      privacySettings: "تنظیمات حریم خصوصی",
      dataRights: "حقوق داده",
      pendingRequests: "درخواست‌های در انتظار",
      dataExports: "خروجی داده",
      dataBreaches: "نشت داده",
      personalData: "داده شخصی",
      marketingData: "داده بازاریابی",
      analyticsData: "داده تحلیلی",
      thirdPartyData: "داده شخص ثالث",
      necessary: "ضروری",
      functional: "عملکردی",
      analytics: "تحلیلی",
      marketing: "بازاریابی",
      profileVisibility: "نمایش پروفایل",
      searchVisibility: "نمایش در جستجو",
      contactVisibility: "نمایش اطلاعات تماس",
      allowAnalytics: "اجازه تحلیل",
      allowMarketing: "اجازه بازاریابی",
      public: "عمومی",
      contacts: "فقط مخاطبین",
      private: "خصوصی",
      rightToAccess: "حق دسترسی",
      rightToRectification: "حق تصحیح",
      rightToErasure: "حق حذف",
      rightToPortability: "حق انتقال",
      requestData: "درخواست داده",
      requestDeletion: "درخواست حذف",
      requestExport: "درخواست خروجی",
      downloadData: "دانلود داده",
      viewBreaches: "مشاهده نشت‌ها",
      complianceLog: "لاگ انطباق",
      acceptTerms: "پذیرش شرایط",
      acceptPolicy: "پذیرش سیاست حریم خصوصی",
      save: "ذخیره",
      cancel: "لغو",
      confirm: "تایید",
      back: "بازگشت",
      loading: "در حال بارگذاری...",
      error: "خطا",
      success: "موفق",
      warning: "هشدار",
      info: "اطلاعات",
      description: "توضیحات",
      verificationMethod: "روش تایید",
      email: "ایمیل",
      phone: "تلفن",
      format: "فرمت",
      json: "JSON",
      csv: "CSV",
      xml: "XML",
      pdf: "PDF",
      status: "وضعیت",
      pending: "در انتظار",
      processing: "در حال پردازش",
      completed: "تکمیل شده",
      rejected: "رد شده",
      severity: "شدت",
      low: "کم",
      medium: "متوسط",
      high: "زیاد",
      critical: "بحرانی",
      actionRequired: "نیاز به اقدام",
      read: "علامت‌گذاری به عنوان خوانده شده",
      timestamp: "زمان",
      action: "عملیات",
      details: "جزئیات"
    },
    ar: {
      title: "إعدادات الخصوصية",
      overview: "نظرة عامة",
      consent: "موافقة البيانات",
      cookies: "تفضيلات ملفات تعريف الارتباط",
      settings: "إعدادات الخصوصية",
      rights: "حقوق البيانات",
      exports: "تصدير البيانات",
      breaches: "خرق البيانات",
      compliance: "الامتثال",
      privacyStatus: "حالة الخصوصية",
      dataConsent: "موافقة البيانات",
      cookieConsent: "موافقة ملفات تعريف الارتباط",
      privacySettings: "إعدادات الخصوصية",
      dataRights: "حقوق البيانات",
      pendingRequests: "الطلبات المعلقة",
      dataExports: "تصدير البيانات",
      dataBreaches: "خرق البيانات",
      personalData: "البيانات الشخصية",
      marketingData: "بيانات التسويق",
      analyticsData: "بيانات التحليلات",
      thirdPartyData: "بيانات الطرف الثالث",
      necessary: "ضروري",
      functional: "وظيفي",
      analytics: "تحليلي",
      marketing: "تسويقي",
      profileVisibility: "رؤية الملف الشخصي",
      searchVisibility: "رؤية البحث",
      contactVisibility: "رؤية الاتصال",
      allowAnalytics: "السماح بالتحليلات",
      allowMarketing: "السماح بالتسويق",
      public: "عام",
      contacts: "جهات الاتصال فقط",
      private: "خاص",
      rightToAccess: "الحق في الوصول",
      rightToRectification: "الحق في التصحيح",
      rightToErasure: "الحق في المحو",
      rightToPortability: "الحق في التنقل",
      requestData: "طلب البيانات",
      requestDeletion: "طلب الحذف",
      requestExport: "طلب التصدير",
      downloadData: "تحميل البيانات",
      viewBreaches: "عرض الخروقات",
      complianceLog: "سجل الامتثال",
      acceptTerms: "قبول الشروط",
      acceptPolicy: "قبول سياسة الخصوصية",
      save: "حفظ",
      cancel: "إلغاء",
      confirm: "تأكيد",
      back: "رجوع",
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
      warning: "تحذير",
      info: "معلومات",
      description: "الوصف",
      verificationMethod: "طريقة التحقق",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      format: "التنسيق",
      json: "JSON",
      csv: "CSV",
      xml: "XML",
      pdf: "PDF",
      status: "الحالة",
      pending: "معلق",
      processing: "قيد المعالجة",
      completed: "مكتمل",
      rejected: "مرفوض",
      severity: "الشدة",
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      critical: "حرج",
      actionRequired: "إجراء مطلوب",
      read: "تحديد كمقروء",
      timestamp: "الطابع الزمني",
      action: "الإجراء",
      details: "التفاصيل"
    },
    tr: {
      title: "Gizlilik Ayarları",
      overview: "Genel Bakış",
      consent: "Veri Onayı",
      cookies: "Çerez Tercihleri",
      settings: "Gizlilik Ayarları",
      rights: "Veri Hakları",
      exports: "Veri Dışa Aktarma",
      breaches: "Veri İhlalleri",
      compliance: "Uyumluluk",
      privacyStatus: "Gizlilik Durumu",
      dataConsent: "Veri Onayı",
      cookieConsent: "Çerez Onayı",
      privacySettings: "Gizlilik Ayarları",
      dataRights: "Veri Hakları",
      pendingRequests: "Bekleyen İstekler",
      dataExports: "Veri Dışa Aktarma",
      dataBreaches: "Veri İhlalleri",
      personalData: "Kişisel Veri",
      marketingData: "Pazarlama Verisi",
      analyticsData: "Analitik Veri",
      thirdPartyData: "Üçüncü Taraf Verisi",
      necessary: "Gerekli",
      functional: "İşlevsel",
      analytics: "Analitik",
      marketing: "Pazarlama",
      profileVisibility: "Profil Görünürlüğü",
      searchVisibility: "Arama Görünürlüğü",
      contactVisibility: "İletişim Görünürlüğü",
      allowAnalytics: "Analitiğe İzin Ver",
      allowMarketing: "Pazarlamaya İzin Ver",
      public: "Genel",
      contacts: "Sadece Kişiler",
      private: "Özel",
      rightToAccess: "Erişim Hakkı",
      rightToRectification: "Düzeltme Hakkı",
      rightToErasure: "Silme Hakkı",
      rightToPortability: "Taşınabilirlik Hakkı",
      requestData: "Veri İste",
      requestDeletion: "Silme İste",
      requestExport: "Dışa Aktarma İste",
      downloadData: "Veriyi İndir",
      viewBreaches: "İhlalleri Görüntüle",
      complianceLog: "Uyumluluk Günlüğü",
      acceptTerms: "Şartları Kabul Et",
      acceptPolicy: "Gizlilik Politikasını Kabul Et",
      save: "Kaydet",
      cancel: "İptal",
      confirm: "Onayla",
      back: "Geri",
      loading: "Yükleniyor...",
      error: "Hata",
      success: "Başarılı",
      warning: "Uyarı",
      info: "Bilgi",
      description: "Açıklama",
      verificationMethod: "Doğrulama Yöntemi",
      email: "E-posta",
      phone: "Telefon",
      format: "Format",
      json: "JSON",
      csv: "CSV",
      xml: "XML",
      pdf: "PDF",
      status: "Durum",
      pending: "Beklemede",
      processing: "İşleniyor",
      completed: "Tamamlandı",
      rejected: "Reddedildi",
      severity: "Önem",
      low: "Düşük",
      medium: "Orta",
      high: "Yüksek",
      critical: "Kritik",
      actionRequired: "Eylem Gerekli",
      read: "Okundu Olarak İşaretle",
      timestamp: "Zaman Damgası",
      action: "Eylem",
      details: "Detaylar"
    }
  };

  const t = translations[lang as keyof typeof translations];

  const tabs = [
    { key: "overview", label: t.overview, icon: <FaShieldAlt /> },
    { key: "consent", label: t.consent, icon: <FaCheck /> },
    { key: "cookies", label: t.cookies, icon: <FaCookieBite /> },
    { key: "settings", label: t.settings, icon: <FaCog /> },
    { key: "rights", label: t.rights, icon: <FaGavel /> },
    { key: "exports", label: t.exports, icon: <FaDownload /> },
    { key: "breaches", label: t.breaches, icon: <FaExclamationTriangle /> },
    { key: "compliance", label: t.compliance, icon: <FaHistory /> }
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    setLang(savedLang);
    loadPrivacyData();
  }, [activeTab]);

  const loadPrivacyData = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      // const response = await fetch('/api/privacy/settings');
      // const data = await response.json();
      // setPrivacyData(data.data);
      
      // Mock data for demonstration
      setTimeout(() => {
        setPrivacyData({
          privacySettings: {
            profileVisibility: "public",
            searchVisibility: "public",
            contactVisibility: "public",
            allowAnalytics: true,
            allowMarketing: false
          },
          cookiePreferences: {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
          },
          dataConsent: {
            personalData: true,
            marketingData: false,
            analyticsData: true,
            thirdPartyData: false
          },
          dataRights: {
            hasActiveConsent: true,
            pendingRequests: 0
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading privacy data:", error);
      setLoading(false);
    }
  };

  const handleConsentChange = async (consentType: string, value: boolean) => {
    setLoading(true);
    try {
      // In real app, send to API
      // const response = await fetch('/api/privacy/consent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ consentType, version: '1.0' })
      // });
      
      setTimeout(() => {
        setConsentData({ ...consentData, [consentType]: value });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating consent:", error);
      setLoading(false);
    }
  };

  const handleCookieChange = async () => {
    setLoading(true);
    try {
      // In real app, send to API
      // const response = await fetch('/api/privacy/cookies', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(cookiePreferences)
      // });
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating cookie preferences:", error);
      setLoading(false);
    }
  };

  const handlePrivacySettingsChange = async () => {
    setLoading(true);
    try {
      // In real app, send to API
      // const response = await fetch('/api/privacy/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(privacySettings)
      // });
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      setLoading(false);
    }
  };

  const requestDataAccess = async () => {
    const description = prompt("Please describe what data you would like to access:");
    if (!description) return;
    
    setLoading(true);
    try {
      // In real app, send to API
      // const response = await fetch('/api/privacy/request/access', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ description, verificationMethod: 'email' })
      // });
      
      setTimeout(() => {
        alert("Data access request submitted successfully");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error requesting data access:", error);
      setLoading(false);
    }
  };

  const requestDataDeletion = async () => {
    const description = prompt("Please describe why you want to delete your data:");
    if (!description) return;
    
    if (!confirm("Are you sure you want to request data deletion? This action cannot be undone.")) {
      return;
    }
    
    setLoading(true);
    try {
      // In real app, send to API
      // const response = await fetch('/api/privacy/request/deletion', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ description, verificationMethod: 'email' })
      // });
      
      setTimeout(() => {
        alert("Data deletion request submitted successfully");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error requesting data deletion:", error);
      setLoading(false);
    }
  };

  const requestDataExport = async () => {
    const format = prompt("Enter export format (json, csv, xml, pdf):", "json");
    if (!format) return;
    
    setLoading(true);
    try {
      // In real app, send to API
      // const response = await fetch('/api/privacy/request/export', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ format, dataCategories: ['personal_identifiers', 'contact_information'] })
      // });
      
      setTimeout(() => {
        alert("Data export request submitted successfully");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error requesting data export:", error);
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Privacy Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{t.privacyStatus}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.dataConsent}</p>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>
              <FaCheck className="text-green-500 text-xl" />
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.cookieConsent}</p>
                <p className="text-lg font-semibold text-blue-600">Configured</p>
              </div>
              <FaCookieBite className="text-blue-500 text-xl" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.dataRights}</p>
                <p className="text-lg font-semibold text-purple-600">Available</p>
              </div>
              <FaGavel className="text-purple-500 text-xl" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.pendingRequests}</p>
                <p className="text-lg font-semibold text-yellow-600">0</p>
              </div>
              <FaHistory className="text-yellow-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Privacy Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <FaShieldAlt className="text-blue-500 mr-3" />
            <div>
              <p className="font-medium">Review Your Data Consent</p>
              <p className="text-sm text-gray-600">Make sure your consent settings match your preferences</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <FaCookieBite className="text-green-500 mr-3" />
            <div>
              <p className="font-medium">Manage Cookie Preferences</p>
              <p className="text-sm text-gray-600">Control which cookies are used on your account</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <FaGavel className="text-purple-500 mr-3" />
            <div>
              <p className="font-medium">Exercise Your Data Rights</p>
              <p className="text-sm text-gray-600">You can request access, deletion, or export of your data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{t.dataConsent}</h3>
        <p className="text-gray-600 mb-6">
          Control how your data is used and shared. You can change these settings at any time.
        </p>
        
        <div className="space-y-4">
          {Object.entries(consentData).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{t[key as keyof typeof t]}</p>
                <p className="text-sm text-gray-600">
                  {key === 'personalData' && 'Basic account and profile information'}
                  {key === 'marketingData' && 'Marketing communications and promotions'}
                  {key === 'analyticsData' && 'Usage analytics and performance data'}
                  {key === 'thirdPartyData' && 'Data sharing with third-party services'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleConsentChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCookies = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{t.cookies}</h3>
        <p className="text-gray-600 mb-6">
          Manage your cookie preferences. Some cookies are necessary for the website to function properly.
        </p>
        
        <div className="space-y-4">
          {Object.entries(cookiePreferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{t[key as keyof typeof t]}</p>
                <p className="text-sm text-gray-600">
                  {key === 'necessary' && 'Required for basic website functionality'}
                  {key === 'functional' && 'Enhance user experience and preferences'}
                  {key === 'analytics' && 'Help us understand how the website is used'}
                  {key === 'marketing' && 'Used for advertising and marketing purposes'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setCookiePreferences({...cookiePreferences, [key]: e.target.checked})}
                  disabled={key === 'necessary'}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${key === 'necessary' ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
              </label>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleCookieChange}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? t.loading : t.save}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{t.privacySettings}</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.profileVisibility}
            </label>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="public">{t.public}</option>
              <option value="contacts">{t.contacts}</option>
              <option value="private">{t.private}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.searchVisibility}
            </label>
            <select
              value={privacySettings.searchVisibility}
              onChange={(e) => setPrivacySettings({...privacySettings, searchVisibility: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="public">{t.public}</option>
              <option value="contacts">{t.contacts}</option>
              <option value="private">{t.private}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.contactVisibility}
            </label>
            <select
              value={privacySettings.contactVisibility}
              onChange={(e) => setPrivacySettings({...privacySettings, contactVisibility: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="public">{t.public}</option>
              <option value="contacts">{t.contacts}</option>
              <option value="private">{t.private}</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.allowAnalytics}</p>
              <p className="text-sm text-gray-600">Allow us to collect usage analytics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.allowAnalytics}
                onChange={(e) => setPrivacySettings({...privacySettings, allowAnalytics: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.allowMarketing}</p>
              <p className="text-sm text-gray-600">Receive marketing communications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.allowMarketing}
                onChange={(e) => setPrivacySettings({...privacySettings, allowMarketing: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handlePrivacySettingsChange}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? t.loading : t.save}
          </button>
        </div>
      </div>
    </div>
  );

  const renderRights = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{t.dataRights}</h3>
        <p className="text-gray-600 mb-6">
          You have the right to access, correct, delete, and export your personal data.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">{t.rightToAccess}</h4>
            <p className="text-sm text-gray-600 mb-3">Request a copy of your personal data</p>
            <button
              onClick={requestDataAccess}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              {t.requestData}
            </button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">{t.rightToErasure}</h4>
            <p className="text-sm text-gray-600 mb-3">Request deletion of your personal data</p>
            <button
              onClick={requestDataDeletion}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
            >
              {t.requestDeletion}
            </button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">{t.rightToPortability}</h4>
            <p className="text-sm text-gray-600 mb-3">Export your data in a portable format</p>
            <button
              onClick={requestDataExport}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
            >
              {t.requestExport}
            </button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">{t.rightToRectification}</h4>
            <p className="text-sm text-gray-600 mb-3">Correct inaccurate personal data</p>
            <button
              onClick={() => router.push("/profile")}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 text-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExports = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{t.dataExports}</h3>
      <p className="text-gray-600 mb-4">No data exports available.</p>
    </div>
  );

  const renderBreaches = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{t.dataBreaches}</h3>
      <p className="text-gray-600 mb-4">No data breaches reported.</p>
    </div>
  );

  const renderCompliance = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{t.compliance}</h3>
      <p className="text-gray-600 mb-4">No compliance logs available.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/profile")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← {t.back}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">{t.loading}</div>
          </div>
        ) : (
          <div>
            {activeTab === "overview" && renderOverview()}
            {activeTab === "consent" && renderConsent()}
            {activeTab === "cookies" && renderCookies()}
            {activeTab === "settings" && renderSettings()}
            {activeTab === "rights" && renderRights()}
            {activeTab === "exports" && renderExports()}
            {activeTab === "breaches" && renderBreaches()}
            {activeTab === "compliance" && renderCompliance()}
          </div>
        )}
      </div>
    </div>
  );
} 