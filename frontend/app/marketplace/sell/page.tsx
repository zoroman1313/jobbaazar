"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaCamera, FaMapMarkerAlt, FaPoundSign, FaSave, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    sellItem: "Sell Item",
    title: "Item Title",
    category: "Category",
    description: "Description",
    price: "Price",
    originalPrice: "Original Price (Optional)",
    condition: "Condition",
    location: "Location",
    contactInfo: "Contact Information",
    phone: "Phone",
    email: "Email",
    photos: "Photos",
    addPhoto: "Add Photo",
    removePhoto: "Remove",
    submit: "List Item",
    cancel: "Cancel",
    itemListed: "Item listed successfully!",
    selectCategory: "Select Category",
    new: "New",
    used: "Used",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    uploadPhoto: "Upload Photo",
    maxPhotos: "Maximum 5 photos",
    dragDrop: "Drag & drop photos here or click to browse",
  },
  fa: {
    back: "بازگشت",
    sellItem: "فروش کالا",
    title: "عنوان کالا",
    category: "دسته‌بندی",
    description: "توضیحات",
    price: "قیمت",
    originalPrice: "قیمت اصلی (اختیاری)",
    condition: "وضعیت",
    location: "موقعیت",
    contactInfo: "اطلاعات تماس",
    phone: "تلفن",
    email: "ایمیل",
    photos: "عکس‌ها",
    addPhoto: "افزودن عکس",
    removePhoto: "حذف",
    submit: "ثبت کالا",
    cancel: "لغو",
    itemListed: "کالا با موفقیت ثبت شد!",
    selectCategory: "انتخاب دسته‌بندی",
    new: "نو",
    used: "دست دوم",
    excellent: "عالی",
    good: "خوب",
    fair: "متوسط",
    poor: "ضعیف",
    uploadPhoto: "آپلود عکس",
    maxPhotos: "حداکثر 5 عکس",
    dragDrop: "عکس‌ها را اینجا بکشید یا کلیک کنید",
  },
  ar: {
    back: "رجوع",
    sellItem: "بيع منتج",
    title: "عنوان المنتج",
    category: "الفئة",
    description: "الوصف",
    price: "السعر",
    originalPrice: "السعر الأصلي (اختياري)",
    condition: "الحالة",
    location: "الموقع",
    contactInfo: "معلومات الاتصال",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    photos: "الصور",
    addPhoto: "إضافة صورة",
    removePhoto: "حذف",
    submit: "إدراج المنتج",
    cancel: "إلغاء",
    itemListed: "تم إدراج المنتج بنجاح!",
    selectCategory: "اختر الفئة",
    new: "جديد",
    used: "مستعمل",
    excellent: "ممتاز",
    good: "جيد",
    fair: "مقبول",
    poor: "ضعيف",
    uploadPhoto: "رفع صورة",
    maxPhotos: "الحد الأقصى 5 صور",
    dragDrop: "اسحب وأفلت الصور هنا أو انقر للتصفح",
  },
  tr: {
    back: "Geri",
    sellItem: "Ürün Sat",
    title: "Ürün Başlığı",
    category: "Kategori",
    description: "Açıklama",
    price: "Fiyat",
    originalPrice: "Orijinal Fiyat (İsteğe Bağlı)",
    condition: "Durum",
    location: "Konum",
    contactInfo: "İletişim Bilgileri",
    phone: "Telefon",
    email: "E-posta",
    photos: "Fotoğraflar",
    addPhoto: "Fotoğraf Ekle",
    removePhoto: "Kaldır",
    submit: "Ürünü Listele",
    cancel: "İptal",
    itemListed: "Ürün başarıyla listelendi!",
    selectCategory: "Kategori Seç",
    new: "Yeni",
    used: "Kullanılmış",
    excellent: "Mükemmel",
    good: "İyi",
    fair: "Orta",
    poor: "Kötü",
    uploadPhoto: "Fotoğraf Yükle",
    maxPhotos: "Maksimum 5 fotoğraf",
    dragDrop: "Fotoğrafları buraya sürükleyin veya tıklayın",
  },
};

const categories = [
  { id: "cement", name: { en: "Cement", fa: "سیمان", ar: "الأسمنت", tr: "Çimento" } },
  { id: "bricks", name: { en: "Bricks", fa: "آجر", ar: "الطوب", tr: "Tuğla" } },
  { id: "pipes", name: { en: "Pipes", fa: "لوله", ar: "الأنابيب", tr: "Boru" } },
  { id: "tools", name: { en: "Tools", fa: "ابزار", ar: "الأدوات", tr: "Aletler" } },
  { id: "electrical", name: { en: "Electrical", fa: "برقی", ar: "الكهربائية", tr: "Elektrik" } },
  { id: "plumbing", name: { en: "Plumbing", fa: "لوله‌کشی", ar: "السباكة", tr: "Su Tesisatı" } },
  { id: "paint", name: { en: "Paint", fa: "رنگ", ar: "الطلاء", tr: "Boya" } },
  { id: "wood", name: { en: "Wood", fa: "چوب", ar: "الخشب", tr: "Ahşap" } },
  { id: "metal", name: { en: "Metal", fa: "فلز", ar: "المعادن", tr: "Metal" } },
  { id: "other", name: { en: "Other", fa: "سایر", ar: "أخرى", tr: "Diğer" } },
];

const conditions = [
  { id: "new", name: { en: "New", fa: "نو", ar: "جديد", tr: "Yeni" } },
  { id: "used", name: { en: "Used", fa: "دست دوم", ar: "مستعمل", tr: "Kullanılmış" } },
  { id: "excellent", name: { en: "Excellent", fa: "عالی", ar: "ممتاز", tr: "Mükemmel" } },
  { id: "good", name: { en: "Good", fa: "خوب", ar: "جيد", tr: "İyi" } },
  { id: "fair", name: { en: "Fair", fa: "متوسط", ar: "مقبول", tr: "Orta" } },
  { id: "poor", name: { en: "Poor", fa: "ضعیف", ar: "ضعيف", tr: "Kötü" } },
];

export default function SellPage() {
  const [lang, setLang] = useState("en");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    originalPrice: "",
    condition: "",
    location: "",
    phone: "",
    email: "",
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  const handleBack = () => {
    router.push("/marketplace");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && photos.length < 5) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title || !formData.category || !formData.price || !formData.condition || !formData.location) {
      alert("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // TODO: Implement actual submission logic
    console.log("Submitting item:", { ...formData, photos });
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(tooltips[lang].itemListed);
      router.push("/marketplace");
    }, 2000);
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
            }}
          >
            <FaArrowLeft />
          </button>
          <h1 style={{ 
            margin: 0, 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].sellItem}
          </h1>
        </div>
      </div>

      {/* Sell Form */}
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ 
              margin: "0 0 20px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              Basic Information
            </h3>
            
            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#000",
                  fontWeight: "bold",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang].title} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
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
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    color: "#000",
                    fontWeight: "bold",
                    fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                  }}>
                    {tooltips[lang].category} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
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
                    required
                  >
                    <option value="">{tooltips[lang].selectCategory}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name[lang as keyof typeof category.name]}
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
                    {tooltips[lang].condition} *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange("condition", e.target.value)}
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
                    required
                  >
                    <option value="">{tooltips[lang].condition}</option>
                    {conditions.map(condition => (
                      <option key={condition.id} value={condition.id}>
                        {condition.name[lang as keyof typeof condition.name]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#000",
                  fontWeight: "bold",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang].description} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#000",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                  }}
                  placeholder="Describe your item in detail..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ 
              margin: "0 0 20px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              Pricing
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#000",
                  fontWeight: "bold",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang].price} *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      paddingLeft: "40px",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "16px",
                      color: "#000",
                      boxSizing: "border-box",
                      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                    }}
                    placeholder="0.00"
                    required
                  />
                  <FaPoundSign 
                    size={16} 
                    color="#666" 
                    style={{ 
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)" 
                    }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#000",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang].originalPrice}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      paddingLeft: "40px",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "16px",
                      color: "#000",
                      boxSizing: "border-box",
                      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                    }}
                    placeholder="0.00"
                  />
                  <FaPoundSign 
                    size={16} 
                    color="#666" 
                    style={{ 
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)" 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ 
              margin: "0 0 20px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].location}
            </h3>
            
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingLeft: "40px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#000",
                  boxSizing: "border-box",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
                placeholder="Enter your location or postcode"
                required
              />
              <FaMapMarkerAlt 
                size={16} 
                color="#666" 
                style={{ 
                  position: "absolute", 
                  left: "12px", 
                  top: "50%", 
                  transform: "translateY(-50%)" 
                }} 
              />
            </div>
          </div>

          {/* Photos */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ 
              margin: "0 0 20px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].photos}
            </h3>
            
            <div style={{ 
              border: "2px dashed #e1e5e9", 
              borderRadius: "12px", 
              padding: "40px", 
              textAlign: "center",
              background: "#f8f9fa",
              marginBottom: "20px"
            }}>
              <FaCamera size={48} color="#666" style={{ marginBottom: "16px" }} />
              <p style={{ 
                margin: "0 0 8px 0", 
                color: "#666",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].dragDrop}
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: "14px", 
                color: "#999",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].maxPhotos}
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                style={{
                  display: "inline-block",
                  marginTop: "16px",
                  padding: "12px 24px",
                  background: "#0070f3",
                  color: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                {tooltips[lang].uploadPhoto}
              </label>
            </div>

            {photos.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px" }}>
                {photos.map((photo, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                      }}
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div style={{ 
            padding: "20px", 
            background: "#f8f9fa", 
            borderRadius: "12px", 
            marginBottom: "32px" 
          }}>
            <h3 style={{ 
              margin: "0 0 16px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].contactInfo}
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#000",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang].phone}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
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
                  required
                />
              </div>
              
              <div>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#000",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang].email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "16px",
                background: isSubmitting ? "#6c757d" : "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              <FaSave size={18} />
              {isSubmitting ? "Submitting..." : tooltips[lang].submit}
            </button>
            
            <button
              type="button"
              onClick={handleBack}
              style={{
                flex: 1,
                padding: "16px",
                background: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              <FaTimes size={18} />
              {tooltips[lang].cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 