"use client";
import { useState, useEffect } from "react";
import { FaShieldAlt, FaMobile, FaDesktop, FaGlobe, FaHistory, FaKey, FaEye, FaEyeSlash, FaQrcode, FaTrash, FaSignOutAlt, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
  // Force Vercel rebuild - Security settings page - VERSION 2.0
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [securityData, setSecurityData] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [twoFactorData, setTwoFactorData] = useState<any>(null);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  const translations = {
    en: {
      // Cleaned: No duplicate keys - forced Vercel rebuild
      title: "Security Settings",
      overview: "Overview",
      twoFactor: "Two-Factor Authentication",
      sessions: "Active Sessions",
      password: "Change Password",
      devices: "Trusted Devices",
      history: "Login History",
      events: "Security Events",
      securityStatus: "Security Status",
      twoFactorEnabled: "Two-Factor Authentication is enabled",
      twoFactorDisabled: "Two-Factor Authentication is disabled",
      activeSessions: "Active Sessions",
      trustedDevices: "Trusted Devices",
      riskLevel: "Risk Level",
      low: "Low",
      medium: "Medium",
      high: "High",
      suspiciousActivity: "Suspicious activity detected",
      failedLogins: "Failed login attempts",
      setup2FA: "Setup Two-Factor Authentication",
      disable2FA: "Disable Two-Factor Authentication",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      changePassword: "Change Password",
      revokeSession: "Revoke Session",
      revokeAllSessions: "Revoke All Sessions",
      removeDevice: "Remove Device",
      device: "Device",
      browser: "Browser",
      location: "Location",
      lastActivity: "Last Activity",
      ipAddress: "IP Address",
      timestamp: "Timestamp",
      success: "Success",
      failure: "Failure",
      reason: "Reason",
      type: "Type",
      riskScore: "Risk Score",
      details: "Details",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      back: "Back",
      loading: "Loading...",
      error: "Error",
      warning: "Warning",
      info: "Information",
      verify: "Verify"
    },
    fa: {
      // نسخه تمیز بدون کلید تکراری - برای حل مشکل Vercel
      title: "تنظیمات امنیتی",
      overview: "نمای کلی",
      twoFactor: "احراز هویت دو مرحله‌ای",
      sessions: "جلسات فعال",
      password: "تغییر رمز عبور",
      devices: "دستگاه‌های مورد اعتماد",
      history: "تاریخچه ورود",
      events: "رویدادهای امنیتی",
      securityStatus: "وضعیت امنیتی",
      twoFactorEnabled: "احراز هویت دو مرحله‌ای فعال است",
      twoFactorDisabled: "احراز هویت دو مرحله‌ای غیرفعال است",
      activeSessions: "جلسات فعال",
      trustedDevices: "دستگاه‌های مورد اعتماد",
      riskLevel: "سطح ریسک",
      low: "کم",
      medium: "متوسط",
      high: "زیاد",
      suspiciousActivity: "فعالیت مشکوک شناسایی شد",
      failedLogins: "تلاش‌های ناموفق ورود",
      setup2FA: "راه‌اندازی احراز هویت دو مرحله‌ای",
      disable2FA: "غیرفعال کردن احراز هویت دو مرحله‌ای",
      currentPassword: "رمز عبور فعلی",
      newPassword: "رمز عبور جدید",
      confirmPassword: "تایید رمز عبور جدید",
      changePassword: "تغییر رمز عبور",
      revokeSession: "لغو جلسه",
      revokeAllSessions: "لغو تمام جلسات",
      removeDevice: "حذف دستگاه",
      device: "دستگاه",
      browser: "مرورگر",
      location: "موقعیت",
      lastActivity: "آخرین فعالیت",
      ipAddress: "آدرس IP",
      timestamp: "زمان",
      success: "موفق",
      failure: "ناموفق",
      reason: "دلیل",
      type: "نوع",
      riskScore: "امتیاز ریسک",
      details: "جزئیات",
      save: "ذخیره",
      cancel: "لغو",
      confirm: "تایید",
      back: "بازگشت",
      loading: "در حال بارگذاری...",
      error: "خطا",
      warning: "هشدار",
      info: "اطلاعات",
      verify: "تایید"
    },
    ar: {
      title: "إعدادات الأمان",
      overview: "نظرة عامة",
      twoFactor: "المصادقة الثنائية",
      sessions: "الجلسات النشطة",
      password: "تغيير كلمة المرور",
      devices: "الأجهزة الموثوقة",
      history: "سجل تسجيل الدخول",
      events: "أحداث الأمان",
      securityStatus: "حالة الأمان",
      twoFactorEnabled: "المصادقة الثنائية مفعلة",
      twoFactorDisabled: "المصادقة الثنائية معطلة",
      activeSessions: "الجلسات النشطة",
      trustedDevices: "الأجهزة الموثوقة",
      riskLevel: "مستوى المخاطر",
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      suspiciousActivity: "تم اكتشاف نشاط مشبوه",
      failedLogins: "محاولات تسجيل دخول فاشلة",
      setup2FA: "إعداد المصادقة الثنائية",
      disable2FA: "تعطيل المصادقة الثنائية",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور الجديدة",
      changePassword: "تغيير كلمة المرور",
      revokeSession: "إلغاء الجلسة",
      revokeAllSessions: "إلغاء جميع الجلسات",
      removeDevice: "إزالة الجهاز",
      device: "الجهاز",
      browser: "المتصفح",
      location: "الموقع",
      lastActivity: "آخر نشاط",
      ipAddress: "عنوان IP",
      timestamp: "الطابع الزمني",
      success: "نجح",
      failure: "فشل",
      reason: "السبب",
      type: "النوع",
      riskScore: "درجة المخاطر",
      details: "التفاصيل",
      save: "حفظ",
      cancel: "إلغاء",
      confirm: "تأكيد",
      back: "رجوع",
      loading: "جاري التحميل...",
      error: "خطأ",
      warning: "تحذير",
      info: "معلومات",
      verify: "تحقق"
    },
    tr: {
      title: "Güvenlik Ayarları",
      overview: "Genel Bakış",
      twoFactor: "İki Faktörlü Kimlik Doğrulama",
      sessions: "Aktif Oturumlar",
      password: "Şifre Değiştir",
      devices: "Güvenilir Cihazlar",
      history: "Giriş Geçmişi",
      events: "Güvenlik Olayları",
      securityStatus: "Güvenlik Durumu",
      twoFactorEnabled: "İki Faktörlü Kimlik Doğrulama Etkin",
      twoFactorDisabled: "İki Faktörlü Kimlik Doğrulama Devre Dışı",
      activeSessions: "Aktif Oturumlar",
      trustedDevices: "Güvenilir Cihazlar",
      riskLevel: "Risk Seviyesi",
      low: "Düşük",
      medium: "Orta",
      high: "Yüksek",
      suspiciousActivity: "Şüpheli Aktivite Tespit Edildi",
      failedLogins: "Başarısız Giriş Denemeleri",
      setup2FA: "İki Faktörlü Kimlik Doğrulama Kurulumu",
      disable2FA: "İki Faktörlü Kimlik Doğrulamayı Devre Dışı Bırak",
      currentPassword: "Mevcut Şifre",
      newPassword: "Yeni Şifre",
      confirmPassword: "Yeni Şifreyi Onayla",
      changePassword: "Şifre Değiştir",
      revokeSession: "Oturumu İptal Et",
      revokeAllSessions: "Tüm Oturumları İptal Et",
      removeDevice: "Cihazı Kaldır",
      device: "Cihaz",
      browser: "Tarayıcı",
      location: "Konum",
      lastActivity: "Son Aktivite",
      ipAddress: "IP Adresi",
      timestamp: "Zaman Damgası",
      success: "Başarılı",
      failure: "Başarısız",
      reason: "Sebep",
      type: "Tür",
      riskScore: "Risk Puanı",
      details: "Detaylar",
      save: "Kaydet",
      cancel: "İptal",
      confirm: "Onayla",
      back: "Geri",
      loading: "Yükleniyor...",
      error: "Hata",
      warning: "Uyarı",
      info: "Bilgi",
      verify: "Doğrula"
    }
  };

  const t = translations[lang as keyof typeof translations];

  const tabs = [
    { key: "overview", label: t.overview, icon: <FaShieldAlt /> },
    { key: "twoFactor", label: t.twoFactor, icon: <FaMobile /> },
    { key: "sessions", label: t.sessions, icon: <FaDesktop /> },
    { key: "password", label: t.password, icon: <FaKey /> },
    { key: "devices", label: t.devices, icon: <FaGlobe /> },
    { key: "history", label: t.history, icon: <FaHistory /> },
    { key: "events", label: t.events, icon: <FaExclamationTriangle /> }
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    setLang(savedLang);
    loadSecurityData();
  }, [activeTab]);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      // const response = await fetch('/api/security/settings');
      // const data = await response.json();
      // setSecurityData(data.data);
      
      // Mock data for demonstration
      setTimeout(() => {
        setSecurityData({
          twoFactor: {
            enabled: false,
            lastVerified: null
          },
          securitySettings: {
            passwordPolicy: {
              minLength: 8,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSpecialChars: true
            },
            sessionPolicy: {
              maxSessions: 5,
              sessionTimeout: 3600,
              forceLogoutOnPasswordChange: true
            },
            loginPolicy: {
              maxLoginAttempts: 5,
              lockoutDuration: 900,
              requireCaptchaAfter: 3
            }
          },
          activeSessions: 2,
          trustedDevices: 1
        });
        
        setSessions([
          {
            sessionId: "session1",
            device: "Desktop",
            browser: "Chrome",
            ipAddress: "192.168.1.100",
            location: { country: "UK", city: "London" },
            lastActivity: new Date(),
            expiresAt: new Date(Date.now() + 3600000),
            isCurrent: true
          },
          {
            sessionId: "session2",
            device: "Mobile",
            browser: "Safari",
            ipAddress: "192.168.1.101",
            location: { country: "UK", city: "Manchester" },
            lastActivity: new Date(Date.now() - 3600000),
            expiresAt: new Date(Date.now() + 7200000),
            isCurrent: false
          }
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading security data:", error);
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    
    setLoading(true);
    try {
      // In real app, send to API
      // const response = await fetch('/api/security/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(passwordForm)
      // });
      
      setTimeout(() => {
        alert("Password changed successfully");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error changing password:", error);
      setLoading(false);
    }
  };

  const setupTwoFactor = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      // const response = await fetch('/api/security/2fa/setup', { method: 'POST' });
      // const data = await response.json();
      
      setTimeout(() => {
        setTwoFactorData({
          secret: "JBSWY3DPEHPK3PXP",
          qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          backupCodes: ["123456", "234567", "345678", "456789", "567890"]
        });
        setShowQRCode(true);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      setLoading(false);
    }
  };

  const verifyTwoFactor = async () => {
    if (!twoFactorToken) {
      alert("Please enter the verification code");
      return;
    }
    
    setLoading(true);
    try {
      // In real app, send to API
      // const response = await fetch('/api/security/2fa/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: twoFactorToken })
      // });
      
      setTimeout(() => {
        alert("Two-factor authentication enabled successfully");
        setShowQRCode(false);
        setTwoFactorToken("");
        loadSecurityData();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to revoke this session?")) return;
    
    setLoading(true);
    try {
      // In real app, send to API
      // await fetch(`/api/security/sessions/${sessionId}`, { method: 'DELETE' });
      
      setTimeout(() => {
        setSessions(sessions.filter(s => s.sessionId !== sessionId));
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error revoking session:", error);
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Security Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{t.securityStatus}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.twoFactor}</p>
                <p className="text-lg font-semibold">
                  {securityData?.twoFactor?.enabled ? t.twoFactorEnabled : t.twoFactorDisabled}
                </p>
              </div>
              <FaMobile className="text-blue-500 text-xl" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.activeSessions}</p>
                <p className="text-lg font-semibold">{securityData?.activeSessions || 0}</p>
              </div>
              <FaDesktop className="text-green-500 text-xl" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.trustedDevices}</p>
                <p className="text-lg font-semibold">{securityData?.trustedDevices || 0}</p>
              </div>
              <FaGlobe className="text-purple-500 text-xl" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.riskLevel}</p>
                <p className="text-lg font-semibold text-yellow-600">{t.low}</p>
              </div>
              <FaShieldAlt className="text-yellow-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Security Recommendations</h3>
        <div className="space-y-3">
          {!securityData?.twoFactor?.enabled && (
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <FaExclamationTriangle className="text-yellow-500 mr-3" />
              <div>
                <p className="font-medium">Enable Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <FaShieldAlt className="text-blue-500 mr-3" />
            <div>
              <p className="font-medium">Review Active Sessions</p>
              <p className="text-sm text-gray-600">Check for any unfamiliar devices or locations</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <FaKey className="text-green-500 mr-3" />
            <div>
              <p className="font-medium">Use Strong Passwords</p>
              <p className="text-sm text-gray-600">Consider changing your password regularly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTwoFactor = () => (
    <div className="space-y-6">
      {!securityData?.twoFactor?.enabled ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{t.setup2FA}</h3>
          
          {!showQRCode ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
              </p>
              <button
                onClick={setupTwoFactor}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? t.loading : t.setup2FA}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <img src={twoFactorData?.qrCode} alt="QR Code" className="mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={twoFactorToken}
                  onChange={(e) => setTwoFactorToken(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full max-w-xs"
                />
              </div>
              <div className="space-x-2">
                <button
                  onClick={verifyTwoFactor}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? t.loading : t.verify}
                </button>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{t.disable2FA}</h3>
          <p className="text-gray-600 mb-4">
            Two-factor authentication is currently enabled. You can disable it if needed.
          </p>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            {t.disable2FA}
          </button>
        </div>
      )}
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t.sessions}</h3>
          <button className="text-red-500 hover:text-red-700 text-sm">
            {t.revokeAllSessions}
          </button>
        </div>
        
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.sessionId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">{session.device}</span>
                    {session.isCurrent && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>{t.browser}:</strong> {session.browser}</p>
                    <p><strong>{t.ipAddress}:</strong> {session.ipAddress}</p>
                    <p><strong>{t.location}:</strong> {session.location?.city}, {session.location?.country}</p>
                    <p><strong>{t.lastActivity}:</strong> {session.lastActivity.toLocaleString()}</p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button
                    onClick={() => revokeSession(session.sessionId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPassword = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{t.changePassword}</h3>
      
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.currentPassword}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.newPassword}
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.confirmPassword}
          </label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? t.loading : t.changePassword}
        </button>
      </form>
    </div>
  );

  const renderDevices = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{t.devices}</h3>
      <p className="text-gray-600 mb-4">No trusted devices found.</p>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{t.history}</h3>
      <p className="text-gray-600 mb-4">No login history available.</p>
    </div>
  );

  const renderEvents = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{t.events}</h3>
      <p className="text-gray-600 mb-4">No security events found.</p>
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
            {activeTab === "twoFactor" && renderTwoFactor()}
            {activeTab === "sessions" && renderSessions()}
            {activeTab === "password" && renderPassword()}
            {activeTab === "devices" && renderDevices()}
            {activeTab === "history" && renderHistory()}
            {activeTab === "events" && renderEvents()}
          </div>
        )}
      </div>
    </div>
  );
} 