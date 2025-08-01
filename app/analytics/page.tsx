"use client";
import { useState, useEffect } from "react";
import { FaChartLine, FaUsers, FaBriefcase, FaStore, FaWallet, FaStar, FaSearch, FaDownload, FaCalendar, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  const translations = {
    en: {
      title: "Analytics Dashboard",
      dashboard: "Dashboard",
      users: "Users",
      jobs: "Jobs",
      marketplace: "Marketplace",
      reports: "Reports",
      period: "Period",
      today: "Today",
      yesterday: "Yesterday",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days",
      last90Days: "Last 90 Days",
      totalUsers: "Total Users",
      activeUsers: "Active Users",
      newUsers: "New Users",
      totalJobs: "Total Jobs",
      activeJobs: "Active Jobs",
      completedJobs: "Completed Jobs",
      totalProducts: "Total Products",
      soldProducts: "Sold Products",
      totalRevenue: "Total Revenue",
      totalTransactions: "Total Transactions",
      averageRating: "Average Rating",
      totalReviews: "Total Reviews",
      pageViews: "Page Views",
      searches: "Searches",
      messages: "Messages",
      notifications: "Notifications",
      topUsers: "Top Users",
      topCategories: "Top Categories",
      recentActivity: "Recent Activity",
      generateReport: "Generate Report",
      downloadReport: "Download Report",
      userActivity: "User Activity",
      revenue: "Revenue",
      jobPerformance: "Job Performance",
      searchAnalytics: "Search Analytics",
      back: "Back"
    },
    fa: {
      title: "داشبورد آمار",
      dashboard: "داشبورد",
      users: "کاربران",
      jobs: "مشاغل",
      marketplace: "بازار",
      reports: "گزارش‌ها",
      period: "دوره",
      today: "امروز",
      yesterday: "دیروز",
      last7Days: "7 روز گذشته",
      last30Days: "30 روز گذشته",
      last90Days: "90 روز گذشته",
      totalUsers: "کل کاربران",
      activeUsers: "کاربران فعال",
      newUsers: "کاربران جدید",
      totalJobs: "کل مشاغل",
      activeJobs: "مشاغل فعال",
      completedJobs: "مشاغل تکمیل شده",
      totalProducts: "کل محصولات",
      soldProducts: "محصولات فروخته شده",
      totalRevenue: "کل درآمد",
      totalTransactions: "کل تراکنش‌ها",
      averageRating: "میانگین امتیاز",
      totalReviews: "کل نظرات",
      pageViews: "بازدید صفحات",
      searches: "جستجوها",
      messages: "پیام‌ها",
      notifications: "اعلان‌ها",
      topUsers: "کاربران برتر",
      topCategories: "دسته‌بندی‌های برتر",
      recentActivity: "فعالیت‌های اخیر",
      generateReport: "ایجاد گزارش",
      downloadReport: "دانلود گزارش",
      userActivity: "فعالیت کاربران",
      revenue: "درآمد",
      jobPerformance: "عملکرد مشاغل",
      searchAnalytics: "آمار جستجو",
      back: "بازگشت"
    },
    ar: {
      title: "لوحة تحكم الإحصائيات",
      dashboard: "لوحة التحكم",
      users: "المستخدمون",
      jobs: "الوظائف",
      marketplace: "السوق",
      reports: "التقارير",
      period: "الفترة",
      today: "اليوم",
      yesterday: "أمس",
      last7Days: "آخر 7 أيام",
      last30Days: "آخر 30 يوم",
      last90Days: "آخر 90 يوم",
      totalUsers: "إجمالي المستخدمين",
      activeUsers: "المستخدمون النشطون",
      newUsers: "المستخدمون الجدد",
      totalJobs: "إجمالي الوظائف",
      activeJobs: "الوظائف النشطة",
      completedJobs: "الوظائف المكتملة",
      totalProducts: "إجمالي المنتجات",
      soldProducts: "المنتجات المباعة",
      totalRevenue: "إجمالي الإيرادات",
      totalTransactions: "إجمالي المعاملات",
      averageRating: "متوسط التقييم",
      totalReviews: "إجمالي المراجعات",
      pageViews: "عرض الصفحات",
      searches: "البحث",
      messages: "الرسائل",
      notifications: "الإشعارات",
      topUsers: "أفضل المستخدمين",
      topCategories: "أفضل الفئات",
      recentActivity: "النشاط الأخير",
      generateReport: "إنشاء تقرير",
      downloadReport: "تحميل التقرير",
      userActivity: "نشاط المستخدم",
      revenue: "الإيرادات",
      jobPerformance: "أداء الوظائف",
      searchAnalytics: "إحصائيات البحث",
      back: "رجوع"
    },
    tr: {
      title: "Analitik Paneli",
      dashboard: "Panel",
      users: "Kullanıcılar",
      jobs: "İşler",
      marketplace: "Pazar",
      reports: "Raporlar",
      period: "Dönem",
      today: "Bugün",
      yesterday: "Dün",
      last7Days: "Son 7 Gün",
      last30Days: "Son 30 Gün",
      last90Days: "Son 90 Gün",
      totalUsers: "Toplam Kullanıcı",
      activeUsers: "Aktif Kullanıcı",
      newUsers: "Yeni Kullanıcı",
      totalJobs: "Toplam İş",
      activeJobs: "Aktif İş",
      completedJobs: "Tamamlanan İş",
      totalProducts: "Toplam Ürün",
      soldProducts: "Satılan Ürün",
      totalRevenue: "Toplam Gelir",
      totalTransactions: "Toplam İşlem",
      averageRating: "Ortalama Puan",
      totalReviews: "Toplam Değerlendirme",
      pageViews: "Sayfa Görüntüleme",
      searches: "Aramalar",
      messages: "Mesajlar",
      notifications: "Bildirimler",
      topUsers: "En İyi Kullanıcılar",
      topCategories: "En İyi Kategoriler",
      recentActivity: "Son Aktiviteler",
      generateReport: "Rapor Oluştur",
      downloadReport: "Rapor İndir",
      userActivity: "Kullanıcı Aktivitesi",
      revenue: "Gelir",
      jobPerformance: "İş Performansı",
      searchAnalytics: "Arama Analitikleri",
      back: "Geri"
    }
  };

  const t = translations[lang as keyof typeof translations];

  // Mock data for demonstration
  const mockStats = {
    summary: {
      totalUsers: 1250,
      totalJobs: 340,
      totalProducts: 890,
      totalRevenue: 45600
    },
    todayEvents: [
      { _id: "page_view", count: 1250 },
      { _id: "user_login", count: 340 },
      { _id: "search_performed", count: 890 },
      { _id: "job_post", count: 45 }
    ],
    topCategories: [
      { _id: "construction", totalSearches: 1250, uniqueQueries: 340 },
      { _id: "cleaning", totalSearches: 890, uniqueQueries: 234 },
      { _id: "gardening", totalSearches: 567, uniqueQueries: 123 },
      { _id: "delivery", totalSearches: 345, uniqueQueries: 89 }
    ],
    recentActivity: [
      { eventType: "user_register", timestamp: new Date(), userId: { name: "John Doe" } },
      { eventType: "job_post", timestamp: new Date(), userId: { name: "Jane Smith" } },
      { eventType: "product_purchase", timestamp: new Date(), userId: { name: "Mike Johnson" } }
    ]
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    setLang(savedLang);
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      // const response = await fetch(`/api/analytics/dashboard?period=${period}`);
      // const data = await response.json();
      // setStats(data.data);
      
      // Using mock data for now
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading stats:", error);
      setLoading(false);
    }
  };

  const tabs = [
    { key: "dashboard", label: t.dashboard, icon: <FaChartLine /> },
    { key: "users", label: t.users, icon: <FaUsers /> },
    { key: "jobs", label: t.jobs, icon: <FaBriefcase /> },
    { key: "marketplace", label: t.marketplace, icon: <FaStore /> },
    { key: "reports", label: t.reports, icon: <FaDownload /> }
  ];

  const periods = [
    { value: "1d", label: t.today },
    { value: "7d", label: t.last7Days },
    { value: "30d", label: t.last30Days },
    { value: "90d", label: t.last90Days }
  ];

  const StatCard = ({ title, value, icon, color, change }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 min-h-[120px] flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="text-gray-600 text-sm font-medium">
          {title}
        </div>
        <div className={`text-2xl p-2 rounded-lg bg-opacity-20`} style={{ color, backgroundColor: color + '20' }}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-800">
        {value}
      </div>
      {change && (
        <div className={`text-xs flex items-center gap-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? "↗" : "↘"} {Math.abs(change)}%
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div>
      {/* Period Selector */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <FaCalendar className="text-gray-600" />
          <span className="text-gray-600 font-medium">{t.period}:</span>
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                period === p.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard 
          title={t.totalUsers} 
          value={stats?.summary?.totalUsers || 0} 
          icon={<FaUsers />} 
          color="#3b82f6"
          change={12}
        />
        <StatCard 
          title={t.totalJobs} 
          value={stats?.summary?.totalJobs || 0} 
          icon={<FaBriefcase />} 
          color="#10b981"
          change={8}
        />
        <StatCard 
          title={t.totalProducts} 
          value={stats?.summary?.totalProducts || 0} 
          icon={<FaStore />} 
          color="#f59e0b"
          change={-3}
        />
        <StatCard 
          title={t.totalRevenue} 
          value={`£${(stats?.summary?.totalRevenue || 0).toLocaleString()}`} 
          icon={<FaWallet />} 
          color="#8b5cf6"
          change={15}
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            {t.recentActivity}
          </h3>
          <div className="h-80 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
            📊 Chart Component (Chart.js/Recharts)
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            {t.topCategories}
          </h3>
          <div className="space-y-3">
            {stats?.topCategories?.map((category: any, index: number) => (
              <div key={category._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800 capitalize">
                    {category._id}
                  </div>
                  <div className="text-xs text-gray-600">
                    {category.uniqueQueries} queries
                  </div>
                </div>
                <div className="font-bold text-blue-600">
                  {category.totalSearches}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">
          {t.recentActivity}
        </h3>
        <div className="space-y-3">
          {stats?.recentActivity?.map((activity: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                  {activity.userId?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    {activity.userId?.name || "Unknown User"}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {activity.eventType.replace("_", " ")}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">{t.users}</h3>
      <div className="text-gray-500 text-center py-10">
        📊 User Analytics Charts and Tables
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">{t.jobs}</h3>
      <div className="text-gray-500 text-center py-10">
        📊 Job Performance Analytics
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">{t.marketplace}</h3>
      <div className="text-gray-500 text-center py-10">
        📊 Marketplace Analytics and Sales Data
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">{t.reports}</h3>
      <div className="text-gray-500 text-center py-10">
        📊 Custom Report Generator
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${lang === "fa" ? "font-vazir" : ""}`}>
      {/* Header */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/profile")}
                className="text-2xl text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ←
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {t.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs */}
        <div className="bg-white rounded-xl p-2 mb-6 shadow-md overflow-x-auto">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.key 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-96 text-gray-600">
            Loading analytics...
          </div>
        ) : (
          <div>
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "jobs" && renderJobs()}
            {activeTab === "marketplace" && renderMarketplace()}
            {activeTab === "reports" && renderReports()}
          </div>
        )}
      </div>
    </div>
  );
} 