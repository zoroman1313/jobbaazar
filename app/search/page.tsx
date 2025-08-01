"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaSearch, FaMap, FaList, FaFilter, FaStar, FaMapMarkerAlt, FaClock, FaPoundSign } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    searchJobs: "Search Jobs",
    jobType: "Job Type",
    language: "Language",
    location: "Location",
    search: "Search",
    map: "Map View",
    list: "List View",
    filters: "Filters",
    availableWorkers: "Available Workers",
    rating: "Rating",
    distance: "Distance",
    availability: "Availability",
    rate: "Rate",
    contact: "Contact",
    noResults: "No workers found",
  },
  fa: {
    back: "بازگشت",
    searchJobs: "جستجوی کار",
    jobType: "نوع کار",
    language: "زبان",
    location: "موقعیت",
    search: "جستجو",
    map: "نمایش نقشه",
    list: "نمایش لیست",
    filters: "فیلترها",
    availableWorkers: "کارگران موجود",
    rating: "امتیاز",
    distance: "فاصله",
    availability: "دسترسی",
    rate: "دستمزد",
    contact: "تماس",
    noResults: "کارگری یافت نشد",
  },
  ar: {
    back: "رجوع",
    searchJobs: "البحث عن وظائف",
    jobType: "نوع الوظيفة",
    language: "اللغة",
    location: "الموقع",
    search: "بحث",
    map: "عرض الخريطة",
    list: "عرض القائمة",
    filters: "المرشحات",
    availableWorkers: "العمال المتاحون",
    rating: "التقييم",
    distance: "المسافة",
    availability: "التوفر",
    rate: "المعدل",
    contact: "اتصال",
    noResults: "لم يتم العثور على عمال",
  },
  tr: {
    back: "Geri",
    searchJobs: "İş Ara",
    jobType: "İş Türü",
    language: "Dil",
    location: "Konum",
    search: "Ara",
    map: "Harita Görünümü",
    list: "Liste Görünümü",
    filters: "Filtreler",
    availableWorkers: "Mevcut İşçiler",
    rating: "Değerlendirme",
    distance: "Mesafe",
    availability: "Müsaitlik",
    rate: "Ücret",
    contact: "İletişim",
    noResults: "İşçi bulunamadı",
  },
};

const jobTypes = [
  { id: "cleaner", name: { en: "Cleaner", fa: "نظافتچی", ar: "منظف", tr: "Temizlikçi" } },
  { id: "builder", name: { en: "Builder", fa: "سازنده", ar: "بناء", tr: "İnşaatçı" } },
  { id: "delivery", name: { en: "Delivery", fa: "تحویل", ar: "توصيل", tr: "Teslimat" } },
  { id: "painter", name: { en: "Painter", fa: "نقاش", ar: "رسام", tr: "Boya" } },
  { id: "gardener", name: { en: "Gardener", fa: "باغبان", ar: "بستاني", tr: "Bahçıvan" } },
  { id: "driver", name: { en: "Driver", fa: "راننده", ar: "سائق", tr: "Şoför" } },
];

const languages = [
  { id: "fa", name: { en: "Persian", fa: "فارسی", ar: "الفارسية", tr: "Farsça" } },
  { id: "en", name: { en: "English", fa: "انگلیسی", ar: "الإنجليزية", tr: "İngilizce" } },
  { id: "ar", name: { en: "Arabic", fa: "عربی", ar: "العربية", tr: "Arapça" } },
  { id: "tr", name: { en: "Turkish", fa: "ترکی", ar: "التركية", tr: "Türkçe" } },
];

// Mock workers data
const mockWorkers = [
  {
    id: 1,
    name: "احمد محمدی",
    jobType: "cleaner",
    language: "fa",
    rating: 4.8,
    distance: "2.3 km",
    availability: "Mon-Fri",
    rate: "£15/hour",
    location: "London, SW1A",
    image: "👨‍💼"
  },
  {
    id: 2,
    name: "John Smith",
    jobType: "builder",
    language: "en",
    rating: 4.6,
    distance: "1.8 km",
    availability: "Mon-Sat",
    rate: "£25/hour",
    location: "Manchester, M1",
    image: "👷‍♂️"
  },
  {
    id: 3,
    name: "علی رضایی",
    jobType: "painter",
    language: "fa",
    rating: 4.9,
    distance: "3.1 km",
    availability: "Weekends",
    rate: "£20/hour",
    location: "Birmingham, B1",
    image: "🎨"
  },
  {
    id: 4,
    name: "Mehmet Yılmaz",
    jobType: "delivery",
    language: "tr",
    rating: 4.5,
    distance: "4.2 km",
    availability: "Daily",
    rate: "£12/hour",
    location: "Liverpool, L1",
    image: "🚚"
  },
];

export default function SearchPage() {
  const [lang, setLang] = useState("en");
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: "",
    language: "",
    location: "",
  });
  const [workers, setWorkers] = useState(mockWorkers);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  const handleBack = () => {
    router.push("/profile");
  };

  const handleSearch = () => {
    // Filter workers based on selected filters
    let filtered = mockWorkers;
    
    if (filters.jobType) {
      filtered = filtered.filter(worker => worker.jobType === filters.jobType);
    }
    
    if (filters.language) {
      filtered = filtered.filter(worker => worker.language === filters.language);
    }
    
    if (filters.location) {
      filtered = filtered.filter(worker => 
        worker.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    setWorkers(filtered);
  };

  const handleContact = (workerId: number) => {
    // TODO: Implement chat functionality
    console.log("Contact worker:", workerId);
    router.push(`/chat/${workerId}`);
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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
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
              gap: 8,
            }}
          >
            <FaArrowLeft />
            <span style={{ fontSize: 16 }}>{tooltips[lang].back}</span>
          </button>
          <h1 style={{ 
            margin: 0, 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].searchJobs}
          </h1>
        </div>

        {/* Search Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder={tooltips[lang].location}
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "2px solid #e1e5e9",
              borderRadius: "8px",
              fontSize: "16px",
              color: "#000",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "12px 20px",
              background: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaSearch size={16} />
            {tooltips[lang].search}
          </button>
        </div>

        {/* View Toggle and Filters */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 16px",
                background: viewMode === "list" ? "#0070f3" : "#e1e5e9",
                color: viewMode === "list" ? "#fff" : "#333",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FaList size={14} />
              {tooltips[lang].list}
            </button>
            <button
              onClick={() => setViewMode("map")}
              style={{
                padding: "8px 16px",
                background: viewMode === "map" ? "#0070f3" : "#e1e5e9",
                color: viewMode === "map" ? "#fff" : "#333",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FaMap size={14} />
              {tooltips[lang].map}
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: "8px 16px",
              background: showFilters ? "#0070f3" : "#e1e5e9",
              color: showFilters ? "#fff" : "#333",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaFilter size={14} />
            {tooltips[lang].filters}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "12px",
              border: "2px solid #e1e5e9",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                  value={filters.jobType}
                  onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#000",
                  }}
                >
                  <option value="">{tooltips[lang].jobType}</option>
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
                  {tooltips[lang].language}
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#000",
                  }}
                >
                  <option value="">{tooltips[lang].language}</option>
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name[lang.id as keyof typeof lang.name]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid #e1e5e9" }}>
          <h2 style={{ 
            margin: 0, 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].availableWorkers} ({workers.length})
          </h2>
        </div>

        {viewMode === "list" ? (
          <div style={{ padding: "20px" }}>
            {workers.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "40px",
                color: "#666",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].noResults}
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {workers.map((worker) => (
                  <div
                    key={worker.id}
                    style={{
                      padding: "20px",
                      border: "2px solid #e1e5e9",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#0070f3";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e1e5e9";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "48px" }}>{worker.image}</div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: "0 0 8px 0", 
                        color: "#333",
                        fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                      }}>
                        {worker.name}
                      </h3>
                      
                      <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
                        <span style={{ 
                          color: "#666",
                          fontSize: "14px",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}>
                          <FaMapMarkerAlt size={12} style={{ marginRight: "4px" }} />
                          {worker.location}
                        </span>
                        <span style={{ 
                          color: "#666",
                          fontSize: "14px",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}>
                          <FaClock size={12} style={{ marginRight: "4px" }} />
                          {worker.availability}
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaStar size={14} color="#ffc107" />
                        <span style={{ 
                          color: "#666",
                          fontSize: "14px",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}>
                          {worker.rating}
                        </span>
                        <span style={{ 
                          color: "#666",
                          fontSize: "14px",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}>
                          • {worker.distance}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                      <div style={{ 
                        color: "#28a745",
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginBottom: "8px",
                        fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                      }}>
                        {worker.rate}
                      </div>
                      <button
                        onClick={() => handleContact(worker.id)}
                        style={{
                          padding: "8px 16px",
                          background: "#0070f3",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}
                      >
                        {tooltips[lang].contact}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            padding: "40px", 
            textAlign: "center",
            color: "#666",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            <FaMap size={64} color="#e1e5e9" style={{ marginBottom: "16px" }} />
            <p>Map view will be implemented with Leaflet.js or Mapbox</p>
            <p>نمايش نقشه با Leaflet.js يا Mapbox پياده‌سازي خواهد شد</p>
          </div>
        )}
      </div>
    </div>
  );
} 