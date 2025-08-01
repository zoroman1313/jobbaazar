"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaUser, FaLanguage, FaBell, FaShieldAlt, FaSignOutAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    settings: "Settings",
    profile: "Profile",
    language: "Language",
    notifications: "Notifications",
    privacy: "Privacy & Security",
    logout: "Logout",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    name: "Name",
    email: "Email",
    phone: "Phone",
    location: "Location",
    jobType: "Job Type",
    experience: "Experience",
    bio: "Bio",
    pushNotifications: "Push Notifications",
    emailNotifications: "Email Notifications",
    smsNotifications: "SMS Notifications",
    showProfile: "Show Profile to Others",
    showLocation: "Show Location",
    showContact: "Show Contact Info",
    changePassword: "Change Password",
    deleteAccount: "Delete Account",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updateProfile: "Update Profile",
    profileUpdated: "Profile updated successfully!",
    passwordChanged: "Password changed successfully!",
  },
  fa: {
    back: "بازگشت",
    settings: "تنظیمات",
    profile: "پروفایل",
    language: "زبان",
    notifications: "اعلان‌ها",
    privacy: "حریم خصوصی و امنیت",
    logout: "خروج",
    save: "ذخیره",
    cancel: "لغو",
    edit: "ویرایش",
    name: "نام",
    email: "ایمیل",
    phone: "تلفن",
    location: "موقعیت",
    jobType: "نوع کار",
    experience: "تجربه",
    bio: "بیوگرافی",
    pushNotifications: "اعلان‌های فوری",
    emailNotifications: "اعلان‌های ایمیل",
    smsNotifications: "اعلان‌های پیامک",
    showProfile: "نمایش پروفایل به دیگران",
    showLocation: "نمایش موقعیت",
    showContact: "نمایش اطلاعات تماس",
    changePassword: "تغییر رمز عبور",
    deleteAccount: "حذف حساب",
    currentPassword: "رمز عبور فعلی",
    newPassword: "رمز عبور جدید",
    confirmPassword: "تایید رمز عبور",
    updateProfile: "بروزرسانی پروفایل",
    profileUpdated: "پروفایل با موفقیت بروزرسانی شد!",
    passwordChanged: "رمز عبور با موفقیت تغییر یافت!",
  },
  ar: {
    back: "رجوع",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    language: "اللغة",
    notifications: "الإشعارات",
    privacy: "الخصوصية والأمان",
    logout: "تسجيل الخروج",
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    location: "الموقع",
    jobType: "نوع الوظيفة",
    experience: "الخبرة",
    bio: "السيرة الذاتية",
    pushNotifications: "الإشعارات الفورية",
    emailNotifications: "إشعارات البريد الإلكتروني",
    smsNotifications: "إشعارات الرسائل النصية",
    showProfile: "إظهار الملف الشخصي للآخرين",
    showLocation: "إظهار الموقع",
    showContact: "إظهار معلومات الاتصال",
    changePassword: "تغيير كلمة المرور",
    deleteAccount: "حذف الحساب",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    updateProfile: "تحديث الملف الشخصي",
    profileUpdated: "تم تحديث الملف الشخصي بنجاح!",
    passwordChanged: "تم تغيير كلمة المرور بنجاح!",
  },
  tr: {
    back: "Geri",
    settings: "Ayarlar",
    profile: "Profil",
    language: "Dil",
    notifications: "Bildirimler",
    privacy: "Gizlilik ve Güvenlik",
    logout: "Çıkış",
    save: "Kaydet",
    cancel: "İptal",
    edit: "Düzenle",
    name: "Ad",
    email: "E-posta",
    phone: "Telefon",
    location: "Konum",
    jobType: "İş Türü",
    experience: "Deneyim",
    bio: "Biyografi",
    pushNotifications: "Anlık Bildirimler",
    emailNotifications: "E-posta Bildirimleri",
    smsNotifications: "SMS Bildirimleri",
    showProfile: "Profili Diğerlerine Göster",
    showLocation: "Konumu Göster",
    showContact: "İletişim Bilgilerini Göster",
    changePassword: "Şifre Değiştir",
    deleteAccount: "Hesabı Sil",
    currentPassword: "Mevcut Şifre",
    newPassword: "Yeni Şifre",
    confirmPassword: "Şifre Onayı",
    updateProfile: "Profili Güncelle",
    profileUpdated: "Profil başarıyla güncellendi!",
    passwordChanged: "Şifre başarıyla değiştirildi!",
  },
};

const languages = [
  { code: "fa", name: "فارسی", flag: "🇮🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
];

const jobTypes = [
  { id: "cleaner", name: { en: "Cleaner", fa: "نظافتچی", ar: "منظف", tr: "Temizlikçi" } },
  { id: "builder", name: { en: "Builder", fa: "سازنده", ar: "بناء", tr: "İnşaatçı" } },
  { id: "delivery", name: { en: "Delivery", fa: "تحویل", ar: "توصيل", tr: "Teslimat" } },
  { id: "painter", name: { en: "Painter", fa: "نقاش", ar: "رسام", tr: "Boya" } },
  { id: "gardener", name: { en: "Gardener", fa: "باغبان", ar: "بستاني", tr: "Bahçıvan" } },
  { id: "driver", name: { en: "Driver", fa: "راننده", ar: "سائق", tr: "Şoför" } },
];

export default function SettingsPage() {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "احمد محمدی",
    email: "ahmad@example.com",
    phone: "+44 123 456 7890",
    location: "London, UK",
    jobType: "cleaner",
    experience: "5 years",
    bio: "Experienced cleaner with 5 years of professional experience in residential and commercial cleaning.",
  });
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
  });
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showLocation: true,
    showContact: false,
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  const handleBack = () => {
    router.push("/profile");
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update logic
    console.log("Updating profile:", profileData);
    setIsEditing(false);
    // Show success message
    alert(tooltips[lang].profileUpdated);
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("Passwords don't match!");
      return;
    }
    // TODO: Implement password change logic
    console.log("Changing password:", passwordData);
    setShowPasswordModal(false);
    setPasswordData({ current: "", new: "", confirm: "" });
    // Show success message
    alert(tooltips[lang].passwordChanged);
  };

  const handleLanguageChange = (languageCode: string) => {
    setLang(languageCode);
    localStorage.setItem("lang", languageCode);
  };

  const renderProfileTab = () => (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ 
          margin: 0, 
          color: "#333",
          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
        }}>
          {tooltips[lang].profile}
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: "#0070f3",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          >
            <FaEdit size={14} />
            {tooltips[lang].edit}
          </button>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleSaveProfile}
              style={{
                background: "#28a745",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              <FaSave size={14} />
              {tooltips[lang].save}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                background: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              <FaTimes size={14} />
              {tooltips[lang].cancel}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#000",
            fontWeight: "bold",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].name}
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e1e5e9",
              borderRadius: "8px",
              fontSize: "16px",
              color: "#000",
              boxSizing: "border-box",
              background: isEditing ? "#fff" : "#f8f9fa",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#000",
            fontWeight: "bold",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].email}
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e1e5e9",
              borderRadius: "8px",
              fontSize: "16px",
              color: "#000",
              boxSizing: "border-box",
              background: isEditing ? "#fff" : "#f8f9fa",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#000",
            fontWeight: "bold",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].phone}
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e1e5e9",
              borderRadius: "8px",
              fontSize: "16px",
              color: "#000",
              boxSizing: "border-box",
              background: isEditing ? "#fff" : "#f8f9fa",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#000",
            fontWeight: "bold",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].location}
          </label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e1e5e9",
              borderRadius: "8px",
              fontSize: "16px",
              color: "#000",
              boxSizing: "border-box",
              background: isEditing ? "#fff" : "#f8f9fa",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#000",
            fontWeight: "bold",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].jobType}
          </label>
          <select
            value={profileData.jobType}
            onChange={(e) => setProfileData(prev => ({ ...prev, jobType: e.target.value }))}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e1e5e9",
              borderRadius: "8px",
              fontSize: "16px",
              color: "#000",
              boxSizing: "border-box",
              background: isEditing ? "#fff" : "#f8f9fa",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          >
            {jobTypes.map(job => (
              <option key={job.id} value={job.id}>
                {job.name[lang as keyof typeof job.name]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#000",
            fontWeight: "bold",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].bio}
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            disabled={!isEditing}
            rows={3}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e1e5e9",
              borderRadius: "8px",
              fontSize: "16px",
              color: "#000",
              boxSizing: "border-box",
              background: isEditing ? "#fff" : "#f8f9fa",
              resize: "vertical",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderLanguageTab = () => (
    <div style={{ padding: "20px" }}>
      <h3 style={{ 
        margin: "0 0 20px 0", 
        color: "#333",
        fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
      }}>
        {tooltips[lang].language}
      </h3>
      
      <div style={{ display: "grid", gap: "12px" }}>
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px",
              border: lang === language.code ? "2px solid #0070f3" : "2px solid #e1e5e9",
              borderRadius: "12px",
              background: lang === language.code ? "#e6f0ff" : "#fff",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "all 0.3s ease",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
            onMouseEnter={(e) => {
              if (lang !== language.code) {
                e.currentTarget.style.borderColor = "#0070f3";
                e.currentTarget.style.background = "#f8f9fa";
              }
            }}
            onMouseLeave={(e) => {
              if (lang !== language.code) {
                e.currentTarget.style.borderColor = "#e1e5e9";
                e.currentTarget.style.background = "#fff";
              }
            }}
          >
            <span style={{ fontSize: "24px" }}>{language.flag}</span>
            <span style={{ 
              fontSize: "16px", 
              color: "#333",
              fontFamily: language.code === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {language.name}
            </span>
            {lang === language.code && (
              <div style={{ marginLeft: "auto", color: "#0070f3" }}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div style={{ padding: "20px" }}>
      <h3 style={{ 
        margin: "0 0 20px 0", 
        color: "#333",
        fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
      }}>
        {tooltips[lang].notifications}
      </h3>
      
      <div style={{ display: "grid", gap: "16px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "16px",
          border: "2px solid #e1e5e9",
          borderRadius: "12px",
          background: "#fff"
        }}>
          <span style={{ 
            fontSize: "16px",
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].pushNotifications}
          </span>
          <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: notifications.push ? "#0070f3" : "#ccc",
              borderRadius: "24px",
              transition: "0.3s",
            }}>
              <span style={{
                position: "absolute",
                content: "",
                height: "18px",
                width: "18px",
                left: "3px",
                bottom: "3px",
                background: "#fff",
                borderRadius: "50%",
                transition: "0.3s",
                transform: notifications.push ? "translateX(26px)" : "translateX(0)",
              }} />
            </span>
          </label>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "16px",
          border: "2px solid #e1e5e9",
          borderRadius: "12px",
          background: "#fff"
        }}>
          <span style={{ 
            fontSize: "16px",
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].emailNotifications}
          </span>
          <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: notifications.email ? "#0070f3" : "#ccc",
              borderRadius: "24px",
              transition: "0.3s",
            }}>
              <span style={{
                position: "absolute",
                content: "",
                height: "18px",
                width: "18px",
                left: "3px",
                bottom: "3px",
                background: "#fff",
                borderRadius: "50%",
                transition: "0.3s",
                transform: notifications.email ? "translateX(26px)" : "translateX(0)",
              }} />
            </span>
          </label>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "16px",
          border: "2px solid #e1e5e9",
          borderRadius: "12px",
          background: "#fff"
        }}>
          <span style={{ 
            fontSize: "16px",
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].smsNotifications}
          </span>
          <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: notifications.sms ? "#0070f3" : "#ccc",
              borderRadius: "24px",
              transition: "0.3s",
            }}>
              <span style={{
                position: "absolute",
                content: "",
                height: "18px",
                width: "18px",
                left: "3px",
                bottom: "3px",
                background: "#fff",
                borderRadius: "50%",
                transition: "0.3s",
                transform: notifications.sms ? "translateX(26px)" : "translateX(0)",
              }} />
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div style={{ padding: "20px" }}>
      <h3 style={{ 
        margin: "0 0 20px 0", 
        color: "#333",
        fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
      }}>
        {tooltips[lang].privacy}
      </h3>
      
      <div style={{ display: "grid", gap: "16px", marginBottom: "32px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "16px",
          border: "2px solid #e1e5e9",
          borderRadius: "12px",
          background: "#fff"
        }}>
          <span style={{ 
            fontSize: "16px",
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].showProfile}
          </span>
          <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
            <input
              type="checkbox"
              checked={privacy.showProfile}
              onChange={(e) => setPrivacy(prev => ({ ...prev, showProfile: e.target.checked }))}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: privacy.showProfile ? "#0070f3" : "#ccc",
              borderRadius: "24px",
              transition: "0.3s",
            }}>
              <span style={{
                position: "absolute",
                content: "",
                height: "18px",
                width: "18px",
                left: "3px",
                bottom: "3px",
                background: "#fff",
                borderRadius: "50%",
                transition: "0.3s",
                transform: privacy.showProfile ? "translateX(26px)" : "translateX(0)",
              }} />
            </span>
          </label>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "16px",
          border: "2px solid #e1e5e9",
          borderRadius: "12px",
          background: "#fff"
        }}>
          <span style={{ 
            fontSize: "16px",
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].showLocation}
          </span>
          <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
            <input
              type="checkbox"
              checked={privacy.showLocation}
              onChange={(e) => setPrivacy(prev => ({ ...prev, showLocation: e.target.checked }))}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: privacy.showLocation ? "#0070f3" : "#ccc",
              borderRadius: "24px",
              transition: "0.3s",
            }}>
              <span style={{
                position: "absolute",
                content: "",
                height: "18px",
                width: "18px",
                left: "3px",
                bottom: "3px",
                background: "#fff",
                borderRadius: "50%",
                transition: "0.3s",
                transform: privacy.showLocation ? "translateX(26px)" : "translateX(0)",
              }} />
            </span>
          </label>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "16px",
          border: "2px solid #e1e5e9",
          borderRadius: "12px",
          background: "#fff"
        }}>
          <span style={{ 
            fontSize: "16px",
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].showContact}
          </span>
          <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
            <input
              type="checkbox"
              checked={privacy.showContact}
              onChange={(e) => setPrivacy(prev => ({ ...prev, showContact: e.target.checked }))}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: privacy.showContact ? "#0070f3" : "#ccc",
              borderRadius: "24px",
              transition: "0.3s",
            }}>
              <span style={{
                position: "absolute",
                content: "",
                height: "18px",
                width: "18px",
                left: "3px",
                bottom: "3px",
                background: "#fff",
                borderRadius: "50%",
                transition: "0.3s",
                transform: privacy.showContact ? "translateX(26px)" : "translateX(0)",
              }} />
            </span>
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        <button
          onClick={() => setShowPasswordModal(true)}
          style={{
            padding: "12px 16px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}
        >
          {tooltips[lang].changePassword}
        </button>
        
        <button
          onClick={handleLogout}
          style={{
            padding: "12px 16px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}
        >
          <FaSignOutAlt size={16} />
          {tooltips[lang].logout}
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderBottom: "1px solid #e1e5e9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={handleBack}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#0070f3",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaArrowLeft />
          </button>
          <h1 style={{ 
            margin: 0, 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].settings}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e1e5e9",
        }}
      >
        <div style={{ display: "flex" }}>
          {[
            { id: "profile", icon: <FaUser />, label: tooltips[lang].profile },
            { id: "language", icon: <FaLanguage />, label: tooltips[lang].language },
            { id: "notifications", icon: <FaBell />, label: tooltips[lang].notifications },
            { id: "privacy", icon: <FaShieldAlt />, label: tooltips[lang].privacy },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "16px",
                background: activeTab === tab.id ? "#0070f3" : "none",
                color: activeTab === tab.id ? "#fff" : "#666",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              {tab.icon}
              <span style={{ fontSize: "14px" }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ background: "#fff", minHeight: "calc(100vh - 140px)" }}>
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "language" && renderLanguageTab()}
        {activeTab === "notifications" && renderNotificationsTab()}
        {activeTab === "privacy" && renderPrivacyTab()}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "32px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ 
              margin: "0 0 24px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].changePassword}
            </h3>
            
            <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#000",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang].currentPassword}
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#000",
                    boxSizing: "border-box",
                    fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#000",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang].newPassword}
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#000",
                    boxSizing: "border-box",
                    fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#000",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang].confirmPassword}
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#000",
                    boxSizing: "border-box",
                    fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleChangePassword}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                {tooltips[lang].save}
              </button>
              
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                {tooltips[lang].cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 