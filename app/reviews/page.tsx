"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaStar, FaThumbsUp, FaThumbsDown, FaFlag, FaReply, FaEdit, FaTrash, FaPlus, FaFilter, FaSort } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    reviews: "Reviews",
    myReviews: "My Reviews",
    receivedReviews: "Reviews Received",
    givenReviews: "Reviews Given",
    writeReview: "Write Review",
    rating: "Rating",
    averageRating: "Average Rating",
    totalReviews: "Total Reviews",
    filter: "Filter",
    sort: "Sort",
    all: "All",
    fiveStar: "5 Star",
    fourStar: "4 Star",
    threeStar: "3 Star",
    twoStar: "2 Star",
    oneStar: "1 Star",
    helpful: "Helpful",
    notHelpful: "Not Helpful",
    report: "Report",
    reply: "Reply",
    edit: "Edit",
    delete: "Delete",
    verified: "Verified",
    verifiedPurchase: "Verified Purchase",
    communication: "Communication",
    quality: "Quality",
    timeliness: "Timeliness",
    professionalism: "Professionalism",
    value: "Value",
    noReviews: "No reviews yet",
    writeFirstReview: "Write your first review",
    reviewStats: "Review Statistics",
    ratingDistribution: "Rating Distribution",
    categoryRatings: "Category Ratings",
    recentReviews: "Recent Reviews",
    viewAll: "View All",
    loadMore: "Load More",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    hidden: "Hidden",
  },
  fa: {
    back: "بازگشت",
    reviews: "نظرات",
    myReviews: "نظرات من",
    receivedReviews: "نظرات دریافتی",
    givenReviews: "نظرات داده شده",
    writeReview: "نظر بنویس",
    rating: "امتیاز",
    averageRating: "میانگین امتیاز",
    totalReviews: "کل نظرات",
    filter: "فیلتر",
    sort: "مرتب‌سازی",
    all: "همه",
    fiveStar: "5 ستاره",
    fourStar: "4 ستاره",
    threeStar: "3 ستاره",
    twoStar: "2 ستاره",
    oneStar: "1 ستاره",
    helpful: "مفید",
    notHelpful: "غیرمفید",
    report: "گزارش",
    reply: "پاسخ",
    edit: "ویرایش",
    delete: "حذف",
    verified: "تأیید شده",
    verifiedPurchase: "خرید تأیید شده",
    communication: "ارتباط",
    quality: "کیفیت",
    timeliness: "به موقع بودن",
    professionalism: "حرفه‌ای بودن",
    value: "ارزش",
    noReviews: "هنوز نظری وجود ندارد",
    writeFirstReview: "اولین نظر خود را بنویسید",
    reviewStats: "آمار نظرات",
    ratingDistribution: "توزیع امتیازات",
    categoryRatings: "امتیازات دسته‌بندی",
    recentReviews: "نظرات اخیر",
    viewAll: "مشاهده همه",
    loadMore: "بارگذاری بیشتر",
    pending: "در انتظار",
    approved: "تأیید شده",
    rejected: "رد شده",
    hidden: "مخفی",
  },
  ar: {
    back: "رجوع",
    reviews: "المراجعات",
    myReviews: "مراجعاتي",
    receivedReviews: "المراجعات المستلمة",
    givenReviews: "المراجعات المقدمة",
    writeReview: "اكتب مراجعة",
    rating: "التقييم",
    averageRating: "متوسط التقييم",
    totalReviews: "إجمالي المراجعات",
    filter: "تصفية",
    sort: "ترتيب",
    all: "الكل",
    fiveStar: "5 نجوم",
    fourStar: "4 نجوم",
    threeStar: "3 نجوم",
    twoStar: "2 نجوم",
    oneStar: "نجمة واحدة",
    helpful: "مفيد",
    notHelpful: "غير مفيد",
    report: "إبلاغ",
    reply: "رد",
    edit: "تعديل",
    delete: "حذف",
    verified: "متحقق",
    verifiedPurchase: "شراء متحقق",
    communication: "التواصل",
    quality: "الجودة",
    timeliness: "المواعيد",
    professionalism: "الاحترافية",
    value: "القيمة",
    noReviews: "لا توجد مراجعات بعد",
    writeFirstReview: "اكتب مراجعتك الأولى",
    reviewStats: "إحصائيات المراجعات",
    ratingDistribution: "توزيع التقييمات",
    categoryRatings: "تقييمات الفئات",
    recentReviews: "المراجعات الأخيرة",
    viewAll: "عرض الكل",
    loadMore: "تحميل المزيد",
    pending: "قيد الانتظار",
    approved: "موافق عليه",
    rejected: "مرفوض",
    hidden: "مخفي",
  },
  tr: {
    back: "Geri",
    reviews: "Değerlendirmeler",
    myReviews: "Değerlendirmelerim",
    receivedReviews: "Alınan Değerlendirmeler",
    givenReviews: "Verilen Değerlendirmeler",
    writeReview: "Değerlendirme Yaz",
    rating: "Değerlendirme",
    averageRating: "Ortalama Değerlendirme",
    totalReviews: "Toplam Değerlendirme",
    filter: "Filtre",
    sort: "Sırala",
    all: "Tümü",
    fiveStar: "5 Yıldız",
    fourStar: "4 Yıldız",
    threeStar: "3 Yıldız",
    twoStar: "2 Yıldız",
    oneStar: "1 Yıldız",
    helpful: "Yardımcı",
    notHelpful: "Yardımcı Değil",
    report: "Bildir",
    reply: "Yanıtla",
    edit: "Düzenle",
    delete: "Sil",
    verified: "Doğrulanmış",
    verifiedPurchase: "Doğrulanmış Satın Alma",
    communication: "İletişim",
    quality: "Kalite",
    timeliness: "Zamanında",
    professionalism: "Profesyonellik",
    value: "Değer",
    noReviews: "Henüz değerlendirme yok",
    writeFirstReview: "İlk değerlendirmenizi yazın",
    reviewStats: "Değerlendirme İstatistikleri",
    ratingDistribution: "Değerlendirme Dağılımı",
    categoryRatings: "Kategori Değerlendirmeleri",
    recentReviews: "Son Değerlendirmeler",
    viewAll: "Tümünü Gör",
    loadMore: "Daha Fazla Yükle",
    pending: "Beklemede",
    approved: "Onaylandı",
    rejected: "Reddedildi",
    hidden: "Gizli",
  },
};

// Mock review data
const mockReviews = [
  {
    id: 1,
    reviewer: {
      name: "احمد محمدی",
      avatar: "https://via.placeholder.com/40"
    },
    reviewedUser: {
      name: "علی رضایی",
      avatar: "https://via.placeholder.com/40"
    },
    product: {
      title: "Professional Drill Set",
      photos: ["https://via.placeholder.com/100"]
    },
    rating: 5,
    title: "کیفیت عالی و قیمت مناسب",
    content: "این محصول واقعاً کیفیت بالایی دارد. بسته‌بندی خوب و قیمت مناسبی هم داشت. حتماً دوباره خرید خواهم کرد.",
    categoryRatings: {
      communication: 5,
      quality: 5,
      timeliness: 4,
      professionalism: 5,
      value: 5
    },
    reviewType: "buyer_to_seller",
    status: "approved",
    verified: true,
    verifiedPurchase: true,
    helpful: 12,
    notHelpful: 1,
    createdAt: "2024-01-15T10:30:00Z",
    photos: [
      {
        url: "https://via.placeholder.com/200x150",
        caption: "تصویر محصول"
      }
    ],
    replies: [
      {
        user: {
          name: "علی رضایی",
          avatar: "https://via.placeholder.com/30"
        },
        content: "ممنون از نظر شما. خوشحالم که راضی بودید.",
        createdAt: "2024-01-16T09:15:00Z"
      }
    ]
  },
  {
    id: 2,
    reviewer: {
      name: "فاطمه احمدی",
      avatar: "https://via.placeholder.com/40"
    },
    reviewedUser: {
      name: "محمد کریمی",
      avatar: "https://via.placeholder.com/40"
    },
    product: {
      title: "Construction Safety Helmet",
      photos: ["https://via.placeholder.com/100"]
    },
    rating: 4,
    title: "محصول خوب اما کمی گران",
    content: "کیفیت محصول خوب است اما فکر می‌کنم کمی گران بود. در کل راضی هستم.",
    categoryRatings: {
      communication: 4,
      quality: 4,
      timeliness: 5,
      professionalism: 4,
      value: 3
    },
    reviewType: "buyer_to_seller",
    status: "approved",
    verified: true,
    verifiedPurchase: true,
    helpful: 8,
    notHelpful: 2,
    createdAt: "2024-01-14T15:45:00Z",
    photos: [],
    replies: []
  },
  {
    id: 3,
    reviewer: {
      name: "حسین نوری",
      avatar: "https://via.placeholder.com/40"
    },
    reviewedUser: {
      name: "رضا صادقی",
      avatar: "https://via.placeholder.com/40"
    },
    rating: 3,
    title: "متوسط بود",
    content: "کار انجام شد اما کیفیت مورد انتظار نبود. قیمت مناسب بود.",
    categoryRatings: {
      communication: 3,
      quality: 3,
      timeliness: 4,
      professionalism: 3,
      value: 4
    },
    reviewType: "employer_to_worker",
    status: "approved",
    verified: false,
    verifiedPurchase: false,
    helpful: 3,
    notHelpful: 5,
    createdAt: "2024-01-13T12:20:00Z",
    photos: [],
    replies: []
  }
];

const mockStats = {
  totalReviews: 15,
  averageRating: 4.2,
  ratingDistribution: {
    5: 8,
    4: 4,
    3: 2,
    2: 1,
    1: 0
  },
  categoryStats: {
    communication: 4.3,
    quality: 4.1,
    timeliness: 4.5,
    professionalism: 4.0,
    value: 3.8
  }
};

export default function ReviewsPage() {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("received");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [reviews, setReviews] = useState(mockReviews);
  const [stats, setStats] = useState(mockStats);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  const handleBack = () => {
    router.push("/profile");
  };

  const handleWriteReview = () => {
    setShowWriteReview(true);
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={size}
            color={star <= rating ? "#ffc107" : "#e1e5e9"}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
    );
  };

  const renderRatingBar = (rating: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <span style={{ 
          fontSize: "12px", 
          color: "#666",
          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
        }}>
          {rating} {tooltips[lang].rating}
        </span>
        <div style={{ 
          flex: 1, 
          height: "8px", 
          background: "#e1e5e9", 
          borderRadius: "4px",
          overflow: "hidden"
        }}>
          <div style={{ 
            width: `${percentage}%`, 
            height: "100%", 
            background: "#ffc107",
            borderRadius: "4px"
          }} />
        </div>
        <span style={{ 
          fontSize: "12px", 
          color: "#666",
          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
        }}>
          {count}
        </span>
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    if (filterRating === "all") return true;
    return review.rating === parseInt(filterRating);
  });

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
            {tooltips[lang].reviews}
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("received")}
            style={{
              padding: "12px 20px",
              background: activeTab === "received" ? "#0070f3" : "#f8f9fa",
              color: activeTab === "received" ? "#fff" : "#333",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          >
            {tooltips[lang].receivedReviews}
          </button>
          <button
            onClick={() => setActiveTab("given")}
            style={{
              padding: "12px 20px",
              background: activeTab === "given" ? "#0070f3" : "#f8f9fa",
              color: activeTab === "given" ? "#fff" : "#333",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          >
            {tooltips[lang].givenReviews}
          </button>
        </div>

        {/* Write Review Button */}
        <button
          onClick={handleWriteReview}
          style={{
            padding: "12px 20px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}
        >
          <FaPlus size={14} />
          {tooltips[lang].writeReview}
        </button>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Statistics Card */}
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
            {tooltips[lang].reviewStats}
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            {/* Overall Rating */}
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "32px", 
                fontWeight: "bold", 
                color: "#ffc107",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {stats.averageRating}
              </div>
              {renderStars(stats.averageRating, 20)}
              <div style={{ 
                fontSize: "14px", 
                color: "#666",
                marginTop: "8px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].averageRating}
              </div>
            </div>
            
            {/* Total Reviews */}
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "32px", 
                fontWeight: "bold", 
                color: "#0070f3",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {stats.totalReviews}
              </div>
              <div style={{ 
                fontSize: "14px", 
                color: "#666",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].totalReviews}
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div style={{ marginTop: "20px" }}>
            <h4 style={{ 
              margin: "0 0 12px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].ratingDistribution}
            </h4>
            <div style={{ maxWidth: "300px" }}>
              {renderRatingBar(5, stats.ratingDistribution[5], stats.totalReviews)}
              {renderRatingBar(4, stats.ratingDistribution[4], stats.totalReviews)}
              {renderRatingBar(3, stats.ratingDistribution[3], stats.totalReviews)}
              {renderRatingBar(2, stats.ratingDistribution[2], stats.totalReviews)}
              {renderRatingBar(1, stats.ratingDistribution[1], stats.totalReviews)}
            </div>
          </div>

          {/* Category Ratings */}
          <div style={{ marginTop: "20px" }}>
            <h4 style={{ 
              margin: "0 0 12px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].categoryRatings}
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
              {Object.entries(stats.categoryStats).map(([category, rating]) => (
                <div key={category} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ 
                    fontSize: "14px", 
                    color: "#666",
                    fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                  }}>
                    {tooltips[lang][category]}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ 
                      fontSize: "14px", 
                      fontWeight: "bold",
                      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                    }}>
                      {rating}
                    </span>
                    {renderStars(rating, 12)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Rating Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaFilter size={16} color="#666" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                <option value="all">{tooltips[lang].all}</option>
                <option value="5">{tooltips[lang].fiveStar}</option>
                <option value="4">{tooltips[lang].fourStar}</option>
                <option value="3">{tooltips[lang].threeStar}</option>
                <option value="2">{tooltips[lang].twoStar}</option>
                <option value="1">{tooltips[lang].oneStar}</option>
              </select>
            </div>

            {/* Sort */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaSort size={16} color="#666" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="mostHelpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ 
            margin: "0 0 16px 0", 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].recentReviews}
          </h3>
          
          {filteredReviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ 
                fontSize: "18px", 
                color: "#666",
                marginBottom: "12px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].noReviews}
              </div>
              <button
                onClick={handleWriteReview}
                style={{
                  padding: "12px 24px",
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                {tooltips[lang].writeFirstReview}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    border: "1px solid #e1e5e9",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >
                  {/* Review Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={review.reviewer.avatar}
                        alt={review.reviewer.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                      <div>
                        <div style={{ 
                          fontWeight: "bold",
                          color: "#333",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}>
                          {review.reviewer.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {renderStars(review.rating, 14)}
                          <span style={{ 
                            fontSize: "12px", 
                            color: "#666",
                            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                          }}>
                            {new Date(review.createdAt).toLocaleDateString(lang === "fa" ? "fa-IR" : "en-GB")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "8px" }}>
                      {review.verified && (
                        <span style={{ 
                          fontSize: "12px", 
                          color: "#28a745",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}>
                          {tooltips[lang].verified}
                        </span>
                      )}
                      {review.verifiedPurchase && (
                        <span style={{ 
                          fontSize: "12px", 
                          color: "#0070f3",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}>
                          {tooltips[lang].verifiedPurchase}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  {review.product && (
                    <div style={{ 
                      background: "#f8f9fa", 
                      padding: "12px", 
                      borderRadius: "8px", 
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <img
                        src={review.product.photos[0]}
                        alt={review.product.title}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "6px",
                          objectFit: "cover"
                        }}
                      />
                      <span style={{ 
                        fontSize: "14px",
                        color: "#333",
                        fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                      }}>
                        {review.product.title}
                      </span>
                    </div>
                  )}

                  {/* Review Content */}
                  <div style={{ marginBottom: "12px" }}>
                    <h4 style={{ 
                      margin: "0 0 8px 0", 
                      color: "#333",
                      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                    }}>
                      {review.title}
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      color: "#666",
                      lineHeight: "1.5",
                      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                    }}>
                      {review.content}
                    </p>
                  </div>

                  {/* Category Ratings */}
                  {review.categoryRatings && (
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px" }}>
                        {Object.entries(review.categoryRatings).map(([category, rating]) => (
                          <div key={category} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ 
                              fontSize: "12px", 
                              color: "#666",
                              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                            }}>
                              {tooltips[lang][category]}
                            </span>
                            {renderStars(rating, 10)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                        {review.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo.url}
                            alt={photo.caption || "Review photo"}
                            style={{
                              width: "80px",
                              height: "60px",
                              borderRadius: "6px",
                              objectFit: "cover",
                              flexShrink: 0
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {review.replies && review.replies.length > 0 && (
                    <div style={{ marginBottom: "12px" }}>
                      {review.replies.map((reply, index) => (
                        <div
                          key={index}
                          style={{
                            background: "#f8f9fa",
                            padding: "12px",
                            borderRadius: "8px",
                            marginLeft: "20px"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <img
                              src={reply.user.avatar}
                              alt={reply.user.name}
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                objectFit: "cover"
                              }}
                            />
                            <span style={{ 
                              fontSize: "12px", 
                              fontWeight: "bold",
                              color: "#333",
                              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                            }}>
                              {reply.user.name}
                            </span>
                            <span style={{ 
                              fontSize: "12px", 
                              color: "#666",
                              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                            }}>
                              {new Date(reply.createdAt).toLocaleDateString(lang === "fa" ? "fa-IR" : "en-GB")}
                            </span>
                          </div>
                          <p style={{ 
                            margin: 0, 
                            fontSize: "14px",
                            color: "#666",
                            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                          }}>
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Review Actions */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#666",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}
                      >
                        <FaThumbsUp size={12} />
                        {review.helpful} {tooltips[lang].helpful}
                      </button>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#666",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}
                      >
                        <FaThumbsDown size={12} />
                        {review.notHelpful} {tooltips[lang].notHelpful}
                      </button>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#666",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}
                      >
                        <FaReply size={12} />
                        {tooltips[lang].reply}
                      </button>
                    </div>
                    
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#666",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                        }}
                      >
                        <FaFlag size={12} />
                        {tooltips[lang].report}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 