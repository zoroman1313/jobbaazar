"use client";
import { useState, useEffect } from "react";
import { FaUsers, FaShieldAlt, FaCog, FaChartBar, FaFlag, FaCheck, FaTimes, FaBan, FaUnlock, FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaDownload, FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingContent, setPendingContent] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);
  const router = useRouter();

  const translations = {
    en: {
      title: "Admin Panel",
      dashboard: "Dashboard",
      users: "Users",
      moderation: "Moderation",
      settings: "Settings",
      analytics: "Analytics",
      totalUsers: "Total Users",
      totalProducts: "Total Products",
      pendingModeration: "Pending Moderation",
      flaggedContent: "Flagged Content",
      newUsers: "New Users",
      newProducts: "New Products",
      approved: "Approved",
      rejected: "Rejected",
      pending: "Pending",
      banned: "Banned",
      active: "Active",
      search: "Search",
      filter: "Filter",
      actions: "Actions",
      approve: "Approve",
      reject: "Reject",
      ban: "Ban",
      unban: "Unban",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      back: "Back",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      reason: "Reason",
      details: "Details",
      status: "Status",
      role: "Role",
      email: "Email",
      phone: "Phone",
      createdAt: "Created At",
      lastLogin: "Last Login",
      noData: "No data available",
      loading: "Loading...",
      logout: "Logout"
    },
    fa: {
      title: "پنل ادمین",
      dashboard: "داشبورد",
      users: "کاربران",
      moderation: "نظارت",
      settings: "تنظیمات",
      analytics: "آمار",
      totalUsers: "کل کاربران",
      totalProducts: "کل محصولات",
      pendingModeration: "در انتظار نظارت",
      flaggedContent: "محتوای علامت‌گذاری شده",
      newUsers: "کاربران جدید",
      newProducts: "محصولات جدید",
      approved: "تایید شده",
      rejected: "رد شده",
      pending: "در انتظار",
      banned: "مسدود شده",
      active: "فعال",
      search: "جستجو",
      filter: "فیلتر",
      actions: "عملیات",
      approve: "تایید",
      reject: "رد",
      ban: "مسدود",
      unban: "رفع مسدودیت",
      view: "مشاهده",
      edit: "ویرایش",
      delete: "حذف",
      back: "بازگشت",
      save: "ذخیره",
      cancel: "لغو",
      confirm: "تایید",
      reason: "دلیل",
      details: "جزئیات",
      status: "وضعیت",
      role: "نقش",
      email: "ایمیل",
      phone: "تلفن",
      createdAt: "تاریخ ایجاد",
      lastLogin: "آخرین ورود",
      noData: "داده‌ای موجود نیست",
      loading: "در حال بارگذاری...",
      logout: "خروج"
    },
    ar: {
      title: "لوحة الإدارة",
      dashboard: "لوحة التحكم",
      users: "المستخدمون",
      moderation: "الإشراف",
      settings: "الإعدادات",
      analytics: "الإحصائيات",
      totalUsers: "إجمالي المستخدمين",
      totalProducts: "إجمالي المنتجات",
      pendingModeration: "في انتظار المراجعة",
      flaggedContent: "المحتوى المبلغ عنه",
      newUsers: "مستخدمون جدد",
      newProducts: "منتجات جديدة",
      approved: "موافق عليه",
      rejected: "مرفوض",
      pending: "في الانتظار",
      banned: "محظور",
      active: "نشط",
      search: "بحث",
      filter: "تصفية",
      actions: "إجراءات",
      approve: "موافقة",
      reject: "رفض",
      ban: "حظر",
      unban: "إلغاء الحظر",
      view: "عرض",
      edit: "تعديل",
      delete: "حذف",
      back: "رجوع",
      save: "حفظ",
      cancel: "إلغاء",
      confirm: "تأكيد",
      reason: "سبب",
      details: "تفاصيل",
      status: "الحالة",
      role: "الدور",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      createdAt: "تاريخ الإنشاء",
      lastLogin: "آخر تسجيل دخول",
      noData: "لا توجد بيانات",
      loading: "جاري التحميل...",
      logout: "تسجيل الخروج"
    },
    tr: {
      title: "Yönetici Paneli",
      dashboard: "Panel",
      users: "Kullanıcılar",
      moderation: "Denetim",
      settings: "Ayarlar",
      analytics: "Analitik",
      totalUsers: "Toplam Kullanıcı",
      totalProducts: "Toplam Ürün",
      pendingModeration: "Bekleyen Denetim",
      flaggedContent: "İşaretlenmiş İçerik",
      newUsers: "Yeni Kullanıcılar",
      newProducts: "Yeni Ürünler",
      approved: "Onaylandı",
      rejected: "Reddedildi",
      pending: "Beklemede",
      banned: "Yasaklandı",
      active: "Aktif",
      search: "Ara",
      filter: "Filtre",
      actions: "İşlemler",
      approve: "Onayla",
      reject: "Reddet",
      ban: "Yasakla",
      unban: "Yasağı Kaldır",
      view: "Görüntüle",
      edit: "Düzenle",
      delete: "Sil",
      back: "Geri",
      save: "Kaydet",
      cancel: "İptal",
      confirm: "Onayla",
      reason: "Sebep",
      details: "Detaylar",
      status: "Durum",
      role: "Rol",
      email: "E-posta",
      phone: "Telefon",
      createdAt: "Oluşturulma Tarihi",
      lastLogin: "Son Giriş",
      noData: "Veri yok",
      loading: "Yükleniyor...",
      logout: "Çıkış"
    }
  };

  const t = translations[lang as keyof typeof translations];

  // Mock data for demonstration
  const mockStats = {
    overview: {
      totalUsers: 1250,
      totalProducts: 890,
      pendingModeration: 45,
      flaggedContent: 23
    },
    today: {
      newUsers: 12,
      newProducts: 8
    },
    moderation: [
      { _id: "approved", count: 156 },
      { _id: "rejected", count: 23 },
      { _id: "pending", count: 45 }
    ]
  };

  const mockUsers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "worker",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-26"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "employer",
      status: "active",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-25"
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "worker",
      status: "banned",
      createdAt: "2024-01-05",
      lastLogin: "2024-01-20"
    }
  ];

  const mockPendingContent = [
    {
      id: "1",
      contentType: "job",
      title: "Construction Worker Needed",
      submittedBy: "John Doe",
      submittedAt: "2024-01-26",
      priority: "medium"
    },
    {
      id: "2",
      contentType: "product",
      title: "Used Cement Mixer",
      submittedBy: "Jane Smith",
      submittedAt: "2024-01-26",
      priority: "low"
    },
    {
      id: "3",
      contentType: "review",
      title: "Review for Construction Service",
      submittedBy: "Mike Johnson",
      submittedAt: "2024-01-25",
      priority: "high"
    }
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    setLang(savedLang);
    
    // Check authentication
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      router.push("/admin/login");
      return;
    }
    
    try {
      const admin = JSON.parse(adminData);
      setAdmin(admin);
    } catch (error) {
      console.error("Error parsing admin data:", error);
      router.push("/admin/login");
      return;
    }
    
    loadData();
  }, [activeTab, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      // const response = await fetch(`/api/admin/${activeTab}`);
      // const data = await response.json();
      // setStats(data.data);
      
      // Using mock data for now
      setTimeout(() => {
        if (activeTab === "dashboard") {
          setStats(mockStats);
        } else if (activeTab === "users") {
          setUsers(mockUsers);
        } else if (activeTab === "moderation") {
          setPendingContent(mockPendingContent);
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const tabs = [
    { key: "dashboard", label: t.dashboard, icon: <FaChartBar /> },
    { key: "users", label: t.users, icon: <FaUsers /> },
    { key: "moderation", label: t.moderation, icon: <FaFlag /> },
    { key: "settings", label: t.settings, icon: <FaCog /> },
    { key: "analytics", label: t.analytics, icon: <FaChartBar /> }
  ];

  const StatCard = ({ title, value, icon, color, change }: any) => (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e0e0e0",
      minHeight: "120px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#666", fontSize: "14px", fontWeight: "500" }}>
          {title}
        </div>
        <div style={{ 
          color: color, 
          fontSize: "24px",
          background: color + "20",
          borderRadius: "8px",
          padding: "8px"
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
        {value}
      </div>
      {change && (
        <div style={{ 
          fontSize: "12px", 
          color: change > 0 ? "#10b981" : "#ef4444",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}>
          {change > 0 ? "↗" : "↘"} {Math.abs(change)}%
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div>
      {/* Overview Stats */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px",
        marginBottom: "32px"
      }}>
        <StatCard 
          title={t.totalUsers} 
          value={stats?.overview?.totalUsers || 0} 
          icon={<FaUsers />} 
          color="#3b82f6"
          change={12}
        />
        <StatCard 
          title={t.totalProducts} 
          value={stats?.overview?.totalProducts || 0} 
          icon={<FaShieldAlt />} 
          color="#10b981"
          change={8}
        />
        <StatCard 
          title={t.pendingModeration} 
          value={stats?.overview?.pendingModeration || 0} 
          icon={<FaFlag />} 
          color="#f59e0b"
          change={-3}
        />
        <StatCard 
          title={t.flaggedContent} 
          value={stats?.overview?.flaggedContent || 0} 
          icon={<FaTimes />} 
          color="#ef4444"
          change={15}
        />
      </div>

      {/* Today's Stats */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "20px",
        marginBottom: "32px"
      }}>
        <StatCard 
          title={t.newUsers} 
          value={stats?.today?.newUsers || 0} 
          icon={<FaUsers />} 
          color="#8b5cf6"
        />
        <StatCard 
          title={t.newProducts} 
          value={stats?.today?.newProducts || 0} 
          icon={<FaShieldAlt />} 
          color="#06b6d4"
        />
      </div>

      {/* Moderation Stats */}
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e0e0e0"
      }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "18px" }}>
          Moderation Overview
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
          {stats?.moderation?.map((stat: any) => (
            <div key={stat._id} style={{
              textAlign: "center",
              padding: "16px",
              background: "#f9fafb",
              borderRadius: "8px"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
                {stat.count}
              </div>
              <div style={{ fontSize: "14px", color: "#666", textTransform: "capitalize" }}>
                {stat._id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e0e0e0"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ margin: 0, color: "#333", fontSize: "18px" }}>
          {t.users}
        </h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
            <input
              type="text"
              placeholder={t.search}
              style={{
                padding: "8px 12px 8px 36px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                width: "200px"
              }}
            />
          </div>
          <button style={{
            padding: "8px 16px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}>
            <FaFilter style={{ marginRight: "6px" }} />
            {t.filter}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>{t.status}</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>{t.email}</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>{t.role}</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>{t.createdAt}</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                    background: user.status === "active" ? "#dcfce7" : "#fef2f2",
                    color: user.status === "active" ? "#166534" : "#dc2626"
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{user.name}</td>
                <td style={{ padding: "12px" }}>{user.email}</td>
                <td style={{ padding: "12px" }}>{user.role}</td>
                <td style={{ padding: "12px" }}>{user.createdAt}</td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{
                      padding: "4px 8px",
                      background: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}>
                      <FaEye />
                    </button>
                    <button style={{
                      padding: "4px 8px",
                      background: user.status === "banned" ? "#10b981" : "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}>
                      {user.status === "banned" ? <FaUnlock /> : <FaBan />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderModeration = () => (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e0e0e0"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ margin: 0, color: "#333", fontSize: "18px" }}>
          {t.moderation}
        </h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{
            padding: "8px 16px",
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}>
            <FaCheck style={{ marginRight: "6px" }} />
            {t.approve} All
          </button>
          <button style={{
            padding: "8px 16px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}>
            <FaTimes style={{ marginRight: "6px" }} />
            {t.reject} All
          </button>
        </div>
      </div>

      {/* Content List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {pendingContent.map((content) => (
          <div key={content.id} style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            background: "#f9fafb"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "500", color: "#333" }}>
                  {content.title}
                </div>
                <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
                  {content.contentType} • {content.submittedBy} • {content.submittedAt}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  Priority: {content.priority}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{
                  padding: "6px 12px",
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  <FaCheck style={{ marginRight: "4px" }} />
                  {t.approve}
                </button>
                <button style={{
                  padding: "6px 12px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  <FaTimes style={{ marginRight: "4px" }} />
                  {t.reject}
                </button>
                <button style={{
                  padding: "6px 12px",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  <FaEye style={{ marginRight: "4px" }} />
                  {t.view}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e0e0e0"
    }}>
      <h3 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "18px" }}>
        {t.settings}
      </h3>
      <div style={{ color: "#666", textAlign: "center", padding: "40px" }}>
        ⚙️ System Settings Configuration
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e0e0e0"
    }}>
      <h3 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "18px" }}>
        {t.analytics}
      </h3>
      <div style={{ color: "#666", textAlign: "center", padding: "40px" }}>
        📊 Advanced Analytics Dashboard
      </div>
    </div>
  );

  // Show loading if not authenticated
  if (!admin) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ color: "#666" }}>{t.loading}</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
    }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "24px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => router.push("/profile")}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
                padding: "8px",
                borderRadius: "8px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              ←
            </button>
            <h1 style={{ margin: 0, color: "#333", fontSize: "24px", fontWeight: "bold" }}>
              {t.title}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#666", fontSize: "14px" }}>
              {admin.firstName} {admin.lastName}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              {t.logout}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Tabs */}
        <div style={{
          display: "flex",
          background: "#fff",
          borderRadius: "12px",
          padding: "8px",
          marginBottom: "24px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          overflowX: "auto"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                border: "none",
                background: activeTab === tab.key ? "#3b82f6" : "transparent",
                color: activeTab === tab.key ? "#fff" : "#666",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                transition: "all 0.2s"
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "400px",
            color: "#666"
          }}>
            {t.loading}
          </div>
        ) : (
          <div>
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "moderation" && renderModeration()}
            {activeTab === "settings" && renderSettings()}
            {activeTab === "analytics" && renderAnalytics()}
          </div>
        )}
      </div>
    </div>
  );
} 