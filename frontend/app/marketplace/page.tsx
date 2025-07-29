"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaSearch, FaFilter, FaPlus, FaStar, FaMapMarkerAlt, FaPoundSign, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    marketplace: "Construction Materials",
    search: "Search",
    filters: "Filters",
    sell: "Sell Item",
    categories: "Categories",
    all: "All",
    cement: "Cement",
    bricks: "Bricks",
    pipes: "Pipes",
    tools: "Tools",
    electrical: "Electrical",
    plumbing: "Plumbing",
    paint: "Paint",
    wood: "Wood",
    metal: "Metal",
    other: "Other",
    price: "Price",
    location: "Location",
    condition: "Condition",
    new: "New",
    used: "Used",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    sortBy: "Sort by",
    priceLow: "Price: Low to High",
    priceHigh: "Price: High to Low",
    dateNew: "Date: Newest",
    dateOld: "Date: Oldest",
    viewDetails: "View Details",
    noResults: "No items found",
  },
  fa: {
    back: "بازگشت",
    marketplace: "مواد ساختمانی",
    search: "جستجو",
    filters: "فیلترها",
    sell: "فروش کالا",
    categories: "دسته‌بندی‌ها",
    all: "همه",
    cement: "سیمان",
    bricks: "آجر",
    pipes: "لوله",
    tools: "ابزار",
    electrical: "برقی",
    plumbing: "لوله‌کشی",
    paint: "رنگ",
    wood: "چوب",
    metal: "فلز",
    other: "سایر",
    price: "قیمت",
    location: "موقعیت",
    condition: "وضعیت",
    new: "نو",
    used: "دست دوم",
    excellent: "عالی",
    good: "خوب",
    fair: "متوسط",
    sortBy: "مرتب‌سازی بر اساس",
    priceLow: "قیمت: کم به زیاد",
    priceHigh: "قیمت: زیاد به کم",
    dateNew: "تاریخ: جدیدترین",
    dateOld: "تاریخ: قدیمی‌ترین",
    viewDetails: "مشاهده جزئیات",
    noResults: "کالایی یافت نشد",
  },
  ar: {
    back: "رجوع",
    marketplace: "مواد البناء",
    search: "بحث",
    filters: "المرشحات",
    sell: "بيع منتج",
    categories: "الفئات",
    all: "الكل",
    cement: "الأسمنت",
    bricks: "الطوب",
    pipes: "الأنابيب",
    tools: "الأدوات",
    electrical: "الكهربائية",
    plumbing: "السباكة",
    paint: "الطلاء",
    wood: "الخشب",
    metal: "المعادن",
    other: "أخرى",
    price: "السعر",
    location: "الموقع",
    condition: "الحالة",
    new: "جديد",
    used: "مستعمل",
    excellent: "ممتاز",
    good: "جيد",
    fair: "مقبول",
    sortBy: "ترتيب حسب",
    priceLow: "السعر: من الأقل إلى الأعلى",
    priceHigh: "السعر: من الأعلى إلى الأقل",
    dateNew: "التاريخ: الأحدث",
    dateOld: "التاريخ: الأقدم",
    viewDetails: "عرض التفاصيل",
    noResults: "لم يتم العثور على منتجات",
  },
  tr: {
    back: "Geri",
    marketplace: "İnşaat Malzemeleri",
    search: "Ara",
    filters: "Filtreler",
    sell: "Ürün Sat",
    categories: "Kategoriler",
    all: "Tümü",
    cement: "Çimento",
    bricks: "Tuğla",
    pipes: "Boru",
    tools: "Aletler",
    electrical: "Elektrik",
    plumbing: "Su Tesisatı",
    paint: "Boya",
    wood: "Ahşap",
    metal: "Metal",
    other: "Diğer",
    price: "Fiyat",
    location: "Konum",
    condition: "Durum",
    new: "Yeni",
    used: "Kullanılmış",
    excellent: "Mükemmel",
    good: "İyi",
    fair: "Orta",
    sortBy: "Sırala",
    priceLow: "Fiyat: Düşükten Yükseğe",
    priceHigh: "Fiyat: Yüksekten Düşüğe",
    dateNew: "Tarih: En Yeni",
    dateOld: "Tarih: En Eski",
    viewDetails: "Detayları Gör",
    noResults: "Ürün bulunamadı",
  },
};

const categories = [
  { id: "all", name: { en: "All", fa: "همه", ar: "الكل", tr: "Tümü" }, icon: "🏗️" },
  { id: "cement", name: { en: "Cement", fa: "سیمان", ar: "الأسمنت", tr: "Çimento" }, icon: "🧱" },
  { id: "bricks", name: { en: "Bricks", fa: "آجر", ar: "الطوب", tr: "Tuğla" }, icon: "🧱" },
  { id: "pipes", name: { en: "Pipes", fa: "لوله", ar: "الأنابيب", tr: "Boru" }, icon: "🔧" },
  { id: "tools", name: { en: "Tools", fa: "ابزار", ar: "الأدوات", tr: "Aletler" }, icon: "🔨" },
  { id: "electrical", name: { en: "Electrical", fa: "برقی", ar: "الكهربائية", tr: "Elektrik" }, icon: "⚡" },
  { id: "plumbing", name: { en: "Plumbing", fa: "لوله‌کشی", ar: "السباكة", tr: "Su Tesisatı" }, icon: "🚰" },
  { id: "paint", name: { en: "Paint", fa: "رنگ", ar: "الطلاء", tr: "Boya" }, icon: "🎨" },
  { id: "wood", name: { en: "Wood", fa: "چوب", ar: "الخشب", tr: "Ahşap" }, icon: "🪵" },
  { id: "metal", name: { en: "Metal", fa: "فلز", ar: "المعادن", tr: "Metal" }, icon: "🔩" },
  { id: "other", name: { en: "Other", fa: "سایر", ar: "أخرى", tr: "Diğer" }, icon: "📦" },
];

const conditions = [
  { id: "new", name: { en: "New", fa: "نو", ar: "جديد", tr: "Yeni" } },
  { id: "used", name: { en: "Used", fa: "دست دوم", ar: "مستعمل", tr: "Kullanılmış" } },
  { id: "excellent", name: { en: "Excellent", fa: "عالی", ar: "ممتاز", tr: "Mükemmel" } },
  { id: "good", name: { en: "Good", fa: "خوب", ar: "جيد", tr: "İyi" } },
  { id: "fair", name: { en: "Fair", fa: "متوسط", ar: "مقبول", tr: "Orta" } },
];

const sortOptions = [
  { id: "dateNew", name: { en: "Date: Newest", fa: "تاریخ: جدیدترین", ar: "التاريخ: الأحدث", tr: "Tarih: En Yeni" } },
  { id: "dateOld", name: { en: "Date: Oldest", fa: "تاریخ: قدیمی‌ترین", ar: "التاريخ: الأقدم", tr: "Tarih: En Eski" } },
  { id: "priceLow", name: { en: "Price: Low to High", fa: "قیمت: کم به زیاد", ar: "السعر: من الأقل إلى الأعلى", tr: "Fiyat: Düşükten Yükseğe" } },
  { id: "priceHigh", name: { en: "Price: High to Low", fa: "قیمت: زیاد به کم", ar: "السعر: من الأعلى إلى الأقل", tr: "Fiyat: Yüksekten Düşüğe" } },
];

// Mock products data
const mockProducts = [
  {
    id: 1,
    title: "Portland Cement - 25kg Bags",
    category: "cement",
    price: 8.50,
    originalPrice: 12.00,
    condition: "new",
    location: "London, SW1A",
    seller: "احمد محمدی",
    rating: 4.8,
    reviews: 24,
    image: "🧱",
    description: "High-quality Portland cement, perfect for construction projects. 25kg bags, 20 bags available.",
    datePosted: "2 hours ago"
  },
  {
    id: 2,
    title: "Red Bricks - 1000 pieces",
    category: "bricks",
    price: 450.00,
    originalPrice: 600.00,
    condition: "excellent",
    location: "Manchester, M1",
    seller: "John Smith",
    rating: 4.6,
    reviews: 18,
    image: "🧱",
    description: "Premium red bricks, excellent condition. Perfect for garden walls or small projects.",
    datePosted: "1 day ago"
  },
  {
    id: 3,
    title: "PVC Pipes - 2 inch diameter",
    category: "pipes",
    price: 15.00,
    originalPrice: 25.00,
    condition: "good",
    location: "Birmingham, B1",
    seller: "علی رضایی",
    rating: 4.4,
    reviews: 12,
    image: "🔧",
    description: "PVC pipes, 2 inch diameter, 3 meters each. 10 pieces available.",
    datePosted: "3 days ago"
  },
  {
    id: 4,
    title: "Professional Drill Set",
    category: "tools",
    price: 85.00,
    originalPrice: 120.00,
    condition: "used",
    location: "Liverpool, L1",
    seller: "Mehmet Yılmaz",
    rating: 4.7,
    reviews: 31,
    image: "🔨",
    description: "Complete professional drill set with various bits and accessories. Used but in excellent condition.",
    datePosted: "5 days ago"
  },
  {
    id: 5,
    title: "Electrical Wiring Kit",
    category: "electrical",
    price: 35.00,
    originalPrice: 50.00,
    condition: "new",
    location: "Edinburgh, EH1",
    seller: "David Wilson",
    rating: 4.9,
    reviews: 8,
    image: "⚡",
    description: "Complete electrical wiring kit for home projects. Includes cables, switches, and connectors.",
    datePosted: "1 week ago"
  },
  {
    id: 6,
    title: "Interior Paint - 5L cans",
    category: "paint",
    price: 22.00,
    originalPrice: 35.00,
    condition: "new",
    location: "Glasgow, G1",
    seller: "Sarah Johnson",
    rating: 4.5,
    reviews: 15,
    image: "🎨",
    description: "High-quality interior paint, various colors available. 5L cans, perfect for room renovation.",
    datePosted: "2 weeks ago"
  }
];

export default function MarketplacePage() {
  const [lang, setLang] = useState("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [sortBy, setSortBy] = useState("dateNew");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, selectedCondition, sortBy]);

  const handleBack = () => {
    router.push("/profile");
  };

  const handleSell = () => {
    router.push("/marketplace/sell");
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/marketplace/product/${productId}`);
  };

  const filterAndSortProducts = () => {
    let filtered = mockProducts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by condition
    if (selectedCondition) {
      filtered = filtered.filter(product => product.condition === selectedCondition);
    }

    // Sort products
    switch (sortBy) {
      case "priceLow":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "dateOld":
        filtered.sort((a, b) => new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime());
        break;
      case "dateNew":
      default:
        filtered.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
        break;
    }

    setProducts(filtered);
  };

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
            }}
          >
            <FaArrowLeft />
          </button>
          <h1 style={{ 
            margin: 0, 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].marketplace}
          </h1>
        </div>

        {/* Search Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder={tooltips[lang].search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: "12px 16px",
              background: showFilters ? "#0070f3" : "#e1e5e9",
              color: showFilters ? "#fff" : "#333",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaFilter size={14} />
            {tooltips[lang].filters}
          </button>
          <button
            onClick={handleSell}
            style={{
              padding: "12px 16px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaPlus size={14} />
            {tooltips[lang].sell}
          </button>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ 
            display: "flex", 
            gap: "12px", 
            overflowX: "auto", 
            paddingBottom: "8px",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: "8px 16px",
                  background: selectedCategory === category.id ? "#0070f3" : "#fff",
                  color: selectedCategory === category.id ? "#fff" : "#333",
                  border: `2px solid ${selectedCategory === category.id ? "#0070f3" : "#e1e5e9"}`,
                  borderRadius: "20px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                <span>{category.icon}</span>
                <span>{category.name[lang as keyof typeof category.name]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "12px",
              border: "2px solid #e1e5e9",
              marginBottom: "20px",
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
                  {tooltips[lang].condition}
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#000",
                  }}
                >
                  <option value="">{tooltips[lang].condition}</option>
                  {conditions.map(condition => (
                    <option key={condition.id} value={condition.id}>
                      {condition.name[lang as keyof typeof condition.name]}
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
                  {tooltips[lang].sortBy}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#000",
                  }}
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name[lang as keyof typeof option.name]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div style={{ padding: "20px" }}>
        {products.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px",
            color: "#666",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].noResults}
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onClick={() => handleViewProduct(product.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ fontSize: "48px" }}>{product.image}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: "0 0 8px 0", 
                      color: "#333",
                      fontSize: "18px",
                      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                    }}>
                      {product.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaStar size={14} color="#ffc107" />
                      <span style={{ 
                        color: "#666",
                        fontSize: "14px",
                        fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                      }}>
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <FaMapMarkerAlt size={12} color="#666" />
                    <span style={{ 
                      color: "#666",
                      fontSize: "14px",
                      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                    }}>
                      {product.location}
                    </span>
                  </div>
                  <div style={{ 
                    color: "#666",
                    fontSize: "14px",
                    fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                  }}>
                    {product.seller} • {product.datePosted}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ 
                      color: "#28a745",
                      fontWeight: "bold",
                      fontSize: "20px",
                      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                    }}>
                      <FaPoundSign size={14} style={{ marginRight: "2px" }} />
                      {product.price}
                    </div>
                    {product.originalPrice > product.price && (
                      <div style={{ 
                        color: "#999",
                        fontSize: "14px",
                        textDecoration: "line-through",
                        fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                      }}>
                        <FaPoundSign size={12} style={{ marginRight: "2px" }} />
                        {product.originalPrice}
                      </div>
                    )}
                  </div>
                  
                  <button
                    style={{
                      padding: "8px 16px",
                      background: "#0070f3",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "14px",
                      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                    }}
                  >
                    <FaEye size={14} />
                    {tooltips[lang].viewDetails}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 