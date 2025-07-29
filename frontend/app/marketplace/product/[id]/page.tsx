"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaPoundSign, FaPhone, FaEnvelope, FaHeart, FaShare, FaEye, FaCreditCard } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    contact: "Contact Seller",
    call: "Call",
    message: "Message",
    share: "Share",
    favorite: "Add to Favorites",
    removeFavorite: "Remove from Favorites",
    condition: "Condition",
    location: "Location",
    seller: "Seller",
    rating: "Rating",
    reviews: "reviews",
    description: "Description",
    originalPrice: "Original Price",
    save: "Save",
    similarItems: "Similar Items",
    report: "Report Item",
    photos: "Photos",
    viewAll: "View All Photos",
    posted: "Posted",
    ago: "ago",
    new: "New",
    used: "Used",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    buyNow: "Buy Now",
    payWithWallet: "Pay with Wallet",
    writeReview: "Write Review",
    rateProduct: "Rate this Product",
  },
  fa: {
    back: "بازگشت",
    contact: "تماس با فروشنده",
    call: "تماس",
    message: "پیام",
    share: "اشتراک‌گذاری",
    favorite: "افزودن به علاقه‌مندی‌ها",
    removeFavorite: "حذف از علاقه‌مندی‌ها",
    condition: "وضعیت",
    location: "موقعیت",
    seller: "فروشنده",
    rating: "امتیاز",
    reviews: "نظر",
    description: "توضیحات",
    originalPrice: "قیمت اصلی",
    save: "ذخیره",
    similarItems: "کالاهای مشابه",
    report: "گزارش کالا",
    photos: "عکس‌ها",
    viewAll: "مشاهده همه عکس‌ها",
    posted: "ثبت شده",
    ago: "قبل",
    new: "نو",
    used: "دست دوم",
    excellent: "عالی",
    good: "خوب",
    fair: "متوسط",
    poor: "ضعیف",
    buyNow: "خرید فوری",
    payWithWallet: "پرداخت با کیف پول",
    writeReview: "نظر بنویس",
    rateProduct: "امتیازدهی به این کالا",
  },
  ar: {
    back: "رجوع",
    contact: "اتصال بالبائع",
    call: "اتصال",
    message: "رسالة",
    share: "مشاركة",
    favorite: "إضافة إلى المفضلة",
    removeFavorite: "إزالة من المفضلة",
    condition: "الحالة",
    location: "الموقع",
    seller: "البائع",
    rating: "التقييم",
    reviews: "مراجعات",
    description: "الوصف",
    originalPrice: "السعر الأصلي",
    save: "حفظ",
    similarItems: "منتجات مماثلة",
    report: "الإبلاغ عن المنتج",
    photos: "الصور",
    viewAll: "عرض جميع الصور",
    posted: "نشر",
    ago: "منذ",
    new: "جديد",
    used: "مستعمل",
    excellent: "ممتاز",
    good: "جيد",
    fair: "مقبول",
    poor: "ضعيف",
    buyNow: "شراء الآن",
    payWithWallet: "الدفع بالمحفظة",
    writeReview: "اكتب مراجعة",
    rateProduct: "قيّم هذا المنتج",
  },
  tr: {
    back: "Geri",
    contact: "Satıcı ile İletişim",
    call: "Ara",
    message: "Mesaj",
    share: "Paylaş",
    favorite: "Favorilere Ekle",
    removeFavorite: "Favorilerden Çıkar",
    condition: "Durum",
    location: "Konum",
    seller: "Satıcı",
    rating: "Değerlendirme",
    reviews: "değerlendirme",
    description: "Açıklama",
    originalPrice: "Orijinal Fiyat",
    save: "Kaydet",
    similarItems: "Benzer Ürünler",
    report: "Ürünü Bildir",
    photos: "Fotoğraflar",
    viewAll: "Tüm Fotoğrafları Gör",
    posted: "Yayınlandı",
    ago: "önce",
    new: "Yeni",
    used: "Kullanılmış",
    excellent: "Mükemmel",
    good: "İyi",
    fair: "Orta",
    poor: "Kötü",
    buyNow: "Şimdi Satın Al",
    payWithWallet: "Cüzdan ile Öde",
    writeReview: "Değerlendirme Yaz",
    rateProduct: "Bu Ürünü Değerlendir",
  },
};

const conditions = {
  new: { en: "New", fa: "نو", ar: "جديد", tr: "Yeni" },
  used: { en: "Used", fa: "دست دوم", ar: "مستعمل", tr: "Kullanılmış" },
  excellent: { en: "Excellent", fa: "عالی", ar: "ممتاز", tr: "Mükemmel" },
  good: { en: "Good", fa: "خوب", ar: "جيد", tr: "İyi" },
  fair: { en: "Fair", fa: "متوسط", ar: "مقبول", tr: "Orta" },
  poor: { en: "Poor", fa: "ضعیف", ar: "ضعيف", tr: "Kötü" },
};

// Mock product data
const mockProducts = {
  1: {
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
    photos: ["🧱", "🏗️", "📦"],
    description: "High-quality Portland cement, perfect for construction projects. 25kg bags, 20 bags available. This cement is suitable for all types of construction work including foundations, walls, and concrete structures. Stored in dry conditions, ready for immediate use.",
    datePosted: "2 hours ago",
    phone: "+44 7911 123456",
    email: "ahmad@example.com",
    sellerRating: 4.9,
    sellerReviews: 156,
    sellerLocation: "London, UK",
    sellerMemberSince: "2022",
  },
  2: {
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
    photos: ["🧱", "🏠", "🔨"],
    description: "Premium red bricks, excellent condition. Perfect for garden walls or small projects. These bricks are high-quality clay bricks with excellent durability and weather resistance. Ideal for both interior and exterior use.",
    datePosted: "1 day ago",
    phone: "+44 7911 654321",
    email: "john@example.com",
    sellerRating: 4.7,
    sellerReviews: 89,
    sellerLocation: "Manchester, UK",
    sellerMemberSince: "2021",
  },
  3: {
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
    photos: ["🔧", "🚰", "📏"],
    description: "PVC pipes, 2 inch diameter, 3 meters each. 10 pieces available. These pipes are suitable for water supply, drainage, and irrigation systems. Made from high-quality PVC material with excellent chemical resistance.",
    datePosted: "3 days ago",
    phone: "+44 7911 789012",
    email: "ali@example.com",
    sellerRating: 4.5,
    sellerReviews: 67,
    sellerLocation: "Birmingham, UK",
    sellerMemberSince: "2023",
  },
  4: {
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
    photos: ["🔨", "⚡", "🛠️"],
    description: "Complete professional drill set with various bits and accessories. Used but in excellent condition. Includes drill, charger, multiple drill bits, and carrying case. Perfect for DIY projects and professional use.",
    datePosted: "5 days ago",
    phone: "+44 7911 345678",
    email: "mehmet@example.com",
    sellerRating: 4.8,
    sellerReviews: 203,
    sellerLocation: "Liverpool, UK",
    sellerMemberSince: "2020",
  },
};

export default function ProductDetailPage() {
  const [lang, setLang] = useState("en");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const product = mockProducts[productId as keyof typeof mockProducts];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  if (!product) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#f8f9fa", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div style={{ textAlign: "center", color: "#666" }}>
          Product not found
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.push("/marketplace");
  };

  const handleCall = () => {
    window.open(`tel:${product.phone}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${product.email}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatDate = (dateString: string) => {
    return dateString;
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
            fontSize: "20px",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {product.title}
          </h1>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Photos Section */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div style={{ 
              fontSize: "120px", 
              textAlign: "center", 
              marginBottom: "16px",
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "20px"
            }}>
              {product.photos[selectedPhoto]}
            </div>
            
            {product.photos.length > 1 && (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                {product.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(index)}
                    style={{
                      fontSize: "40px",
                      padding: "8px",
                      border: selectedPhoto === index ? "3px solid #0070f3" : "3px solid #e1e5e9",
                      borderRadius: "8px",
                      background: selectedPhoto === index ? "#e6f0ff" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {photo}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price and Actions */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <div style={{ 
                color: "#28a745",
                fontWeight: "bold",
                fontSize: "32px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                <FaPoundSign size={24} style={{ marginRight: "4px" }} />
                {product.price}
              </div>
              {product.originalPrice > product.price && (
                <div style={{ 
                  color: "#999",
                  fontSize: "18px",
                  textDecoration: "line-through",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  <FaPoundSign size={16} style={{ marginRight: "2px" }} />
                  {product.originalPrice}
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={toggleFavorite}
                style={{
                  padding: "12px",
                  background: isFavorite ? "#dc3545" : "#e1e5e9",
                  color: isFavorite ? "#fff" : "#333",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaHeart size={16} />
              </button>
              <button
                onClick={handleShare}
                style={{
                  padding: "12px",
                  background: "#e1e5e9",
                  color: "#333",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaShare size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <button
              onClick={handleCall}
              style={{
                flex: 1,
                padding: "16px",
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              <FaPhone size={16} />
              {tooltips[lang].call}
            </button>
            
            <button
              onClick={handleEmail}
              style={{
                flex: 1,
                padding: "16px",
                background: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              <FaEnvelope size={16} />
              {tooltips[lang].message}
            </button>
          </div>

          <button
            onClick={() => router.push(`/wallet?buy=${product.id}&amount=${product.price}`)}
            style={{
              width: "100%",
              padding: "16px",
              background: "#ff6b35",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          >
            <FaCreditCard size={16} />
            {tooltips[lang].payWithWallet}
          </button>
        </div>

        {/* Product Details */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ 
            margin: "0 0 16px 0", 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].description}
          </h3>
          
          <p style={{ 
            color: "#666",
            lineHeight: "1.6",
            marginBottom: "20px",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {product.description}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <span style={{ 
                color: "#999",
                fontSize: "14px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].condition}
              </span>
              <div style={{ 
                color: "#333",
                fontWeight: "bold",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {conditions[product.condition as keyof typeof conditions][lang as keyof typeof conditions.new]}
              </div>
            </div>
            
            <div>
              <span style={{ 
                color: "#999",
                fontSize: "14px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].location}
              </span>
              <div style={{ 
                color: "#333",
                fontWeight: "bold",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {product.location}
              </div>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ 
            margin: "0 0 16px 0", 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].seller}
          </h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
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
              {product.seller.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: "bold",
                color: "#333",
                marginBottom: "4px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {product.seller}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaStar size={14} color="#ffc107" />
                <span style={{ 
                  color: "#666",
                  fontSize: "14px",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {product.sellerRating} ({product.sellerReviews} {tooltips[lang].reviews})
                </span>
              </div>
            </div>
          </div>

          <div style={{ 
            color: "#666",
            fontSize: "14px",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {product.sellerLocation} • Member since {product.sellerMemberSince}
          </div>
        </div>

        {/* Product Rating */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaStar size={20} color="#ffc107" />
              <span style={{ 
                fontSize: "18px",
                fontWeight: "bold",
                color: "#333",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {product.rating}
              </span>
            </div>
            <span style={{ 
              color: "#666",
              fontSize: "14px",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              ({product.reviews} {tooltips[lang].reviews})
            </span>
          </div>
        </div>

        {/* Posted Date */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ 
            color: "#666",
            fontSize: "14px",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].posted} {formatDate(product.datePosted)}
          </div>
        </div>
      </div>
    </div>
  );
} 