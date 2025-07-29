"use client";
import { useState, useEffect } from "react";
import { FaUser, FaSignOutAlt, FaCog, FaSearch, FaPlus, FaHistory, FaStore, FaWallet, FaStar, FaBell, FaComments, FaChartLine, FaShieldAlt, FaHammer } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    profile: "Profile",
    logout: "Logout",
    settings: "Settings",
    searchJobs: "Search Jobs",
    postJob: "Post Job",
    marketplace: "Marketplace",
    wallet: "Wallet",
    reviews: "Reviews",
    notifications: "Notifications",
    messages: "Messages",
    analytics: "Analytics",
    myJobs: "My Jobs",
    createProject: "Create Project",
    welcome: "Welcome",
  },
  fa: {
    profile: "پروفایل",
    logout: "خروج",
    settings: "تنظیمات",
    searchJobs: "جستجوی کار",
    postJob: "ثبت کار",
    marketplace: "بازار",
    wallet: "کیف پول",
    reviews: "نظرات",
    notifications: "اعلان‌ها",
    messages: "پیام‌ها",
    myJobs: "کارهای من",
    admin: "ادمین",
    welcome: "خوش آمدید",
    createProject: "ایجاد پروژه",
  },
  ar: {
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    settings: "الإعدادات",
    searchJobs: "البحث عن وظائف",
    postJob: "نشر وظيفة",
    marketplace: "السوق",
    wallet: "المحفظة",
    reviews: "المراجعات",
    notifications: "الإشعارات",
    messages: "الرسائل",
    myJobs: "وظائفي",
    admin: "الإدارة",
    welcome: "مرحباً",
    createProject: "إنشاء مشروع",
  },
  tr: {
    profile: "Profil",
    logout: "Çıkış",
    settings: "Ayarlar",
    searchJobs: "İş Ara",
    postJob: "İş İlanı Ver",
    marketplace: "Pazar Yeri",
    wallet: "Cüzdan",
    reviews: "Değerlendirmeler",
    notifications: "Bildirimler",
    messages: "Mesajlar",
    myJobs: "İşlerim",
    admin: "Yönetici",
    welcome: "Hoş Geldiniz",
    createProject: "Proje Oluştur",
  },
};

const actions = [
  {
    key: "searchJobs",
    icon: <FaSearch size={32} color="#0070f3" />,
    route: "/search",
    bg: "#e6f0ff",
  },
  {
    key: "postJob",
    icon: <FaPlus size={32} color="#28a745" />,
    route: "/post-job",
    bg: "#e6ffe6",
  },
  {
    key: "marketplace",
    icon: <FaStore size={32} color="#ff6b35" />,
    route: "/marketplace",
    bg: "#fff2e6",
  },
  {
    key: "wallet",
    icon: <FaWallet size={32} color="#28a745" />,
    route: "/wallet",
    bg: "#e6ffe6",
  },
  {
    key: "reviews",
    icon: <FaStar size={32} color="#ffc107" />,
    route: "/reviews",
    bg: "#fff8e1",
  },
  {
    key: "notifications",
    icon: <FaBell size={32} color="#dc3545" />,
    route: "/notifications",
    bg: "#ffe6e6",
  },
  {
    key: "messages",
    icon: <FaComments size={32} color="#17a2b8" />,
    route: "/messages",
    bg: "#e6f7ff",
  },
  {
    key: "analytics",
    icon: <FaChartLine size={32} color="#6c757d" />,
    route: "/analytics",
    bg: "#f8f9fa",
  },
  {
    key: "myJobs",
    icon: <FaHistory size={32} color="#6f42c1" />,
    route: "/my-jobs",
    bg: "#f3e8ff",
  },
  {
    key: "settings",
    icon: <FaCog size={32} color="#495057" />,
    route: "/settings",
    bg: "#f8f9fa",
  },
  {
    key: "admin",
    icon: <FaShieldAlt size={32} color="#dc3545" />,
    route: "/admin",
    bg: "#ffe6e6",
  },
  {
    key: "createProject",
    icon: <FaHammer size={32} color="#ff6b35" />,
    route: "/contractor/create-project",
    bg: "#fff2e6",
  },
];

export default function ProfilePage() {
  const [lang, setLang] = useState("en");
  const [hovered, setHovered] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
      
      // Get user info
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    // TODO: Implement logout logic
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(145deg, #0070f3, #0056b3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "24px",
            }}
          >
            <FaUser />
          </div>
          <div>
            <h2 style={{ 
              margin: 0, 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].welcome}
            </h2>
            <p style={{ 
              margin: "4px 0 0 0", 
              color: "#666",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {user?.username || "User Name"}
              {user?.type === "contractor" && (
                <span style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  color: "#ff6b35",
                  fontWeight: "bold",
                  marginTop: "4px"
                }}>
                  {lang === "fa" ? "پیمانکار" : 
                   lang === "ar" ? "مقاول" : 
                   lang === "tr" ? "Müteahhit" : "Contractor"}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "2px solid #dc3545",
            color: "#dc3545",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#dc3545";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#dc3545";
          }}
        >
          <FaSignOutAlt size={16} />
          {tooltips[lang].logout}
        </button>
      </div>

      {/* Services Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {actions
          .filter(action => {
            // Show "Create Project" only for contractors
            if (action.key === "createProject") {
              return user?.type === "contractor";
            }
            return true;
          })
          .map((action) => (
          <div key={action.key} style={{ position: "relative" }}>
            <button
              aria-label={tooltips[lang][action.key]}
              style={{
                width: "100%",
                padding: "24px",
                borderRadius: "16px",
                border: "2px solid #e1e5e9",
                background: action.bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                boxShadow: hovered === action.key 
                  ? "0 8px 25px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)"
                  : "0 4px 12px rgba(0,0,0,0.05)",
                outline: "none",
                transition: "all 0.3s ease",
                transform: hovered === action.key ? "translateY(-4px)" : "translateY(0)",
              }}
              onMouseEnter={() => setHovered(action.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(action.key)}
              onBlur={() => setHovered(null)}
              onClick={() => router.push(action.route)}
            >
              {action.icon}
              <span style={{ 
                fontSize: "16px", 
                fontWeight: "bold",
                color: "#333",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang][action.key]}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ 
          margin: "0 0 16px 0", 
          color: "#333",
          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
        }}>
          Recent Activity
        </h3>
        <div style={{ 
          color: "#666",
          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
        }}>
          No recent activity to show.
        </div>
      </div>
    </div>
  );
} 