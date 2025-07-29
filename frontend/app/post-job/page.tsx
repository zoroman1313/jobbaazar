"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaPlus, FaMapMarkerAlt, FaPoundSign, FaCalendar, FaClock, FaFileAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    postJob: "Post Job",
    jobTitle: "Job Title",
    jobType: "Job Type",
    description: "Job Description",
    location: "Location",
    rate: "Rate",
    rateType: "Rate Type",
    availability: "Availability",
    requirements: "Requirements",
    contactInfo: "Contact Information",
    submit: "Post Job",
    preview: "Preview",
    hourly: "Hourly",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    fullTime: "Full Time",
    partTime: "Part Time",
    flexible: "Flexible",
    urgent: "Urgent",
    experience: "Experience Level",
    language: "Preferred Language",
  },
  fa: {
    back: "بازگشت",
    postJob: "ثبت آگهی کار",
    jobTitle: "عنوان کار",
    jobType: "نوع کار",
    description: "توضیحات کار",
    location: "موقعیت",
    rate: "دستمزد",
    rateType: "نوع دستمزد",
    availability: "دسترسی",
    requirements: "نیازمندی‌ها",
    contactInfo: "اطلاعات تماس",
    submit: "ثبت آگهی",
    preview: "پیش‌نمایش",
    hourly: "ساعتی",
    daily: "روزانه",
    weekly: "هفتگی",
    monthly: "ماهانه",
    fullTime: "تمام وقت",
    partTime: "نیمه وقت",
    flexible: "انعطاف‌پذیر",
    urgent: "فوری",
    experience: "سطح تجربه",
    language: "زبان ترجیحی",
  },
  ar: {
    back: "رجوع",
    postJob: "نشر وظيفة",
    jobTitle: "عنوان الوظيفة",
    jobType: "نوع الوظيفة",
    description: "وصف الوظيفة",
    location: "الموقع",
    rate: "المعدل",
    rateType: "نوع المعدل",
    availability: "التوفر",
    requirements: "المتطلبات",
    contactInfo: "معلومات الاتصال",
    submit: "نشر الوظيفة",
    preview: "معاينة",
    hourly: "بالساعة",
    daily: "يومي",
    weekly: "أسبوعي",
    monthly: "شهري",
    fullTime: "دوام كامل",
    partTime: "دوام جزئي",
    flexible: "مرن",
    urgent: "عاجل",
    experience: "مستوى الخبرة",
    language: "اللغة المفضلة",
  },
  tr: {
    back: "Geri",
    postJob: "İş İlanı Ver",
    jobTitle: "İş Başlığı",
    jobType: "İş Türü",
    description: "İş Açıklaması",
    location: "Konum",
    rate: "Ücret",
    rateType: "Ücret Türü",
    availability: "Müsaitlik",
    requirements: "Gereksinimler",
    contactInfo: "İletişim Bilgileri",
    submit: "İş İlanı Ver",
    preview: "Önizleme",
    hourly: "Saatlik",
    daily: "Günlük",
    weekly: "Haftalık",
    monthly: "Aylık",
    fullTime: "Tam Zamanlı",
    partTime: "Yarı Zamanlı",
    flexible: "Esnek",
    urgent: "Acil",
    experience: "Deneyim Seviyesi",
    language: "Tercih Edilen Dil",
  },
};

const jobTypes = [
  { id: "cleaner", name: { en: "Cleaner", fa: "نظافتچی", ar: "منظف", tr: "Temizlikçi" } },
  { id: "builder", name: { en: "Builder", fa: "سازنده", ar: "بناء", tr: "İnşaatçı" } },
  { id: "delivery", name: { en: "Delivery", fa: "تحویل", ar: "توصيل", tr: "Teslimat" } },
  { id: "painter", name: { en: "Painter", fa: "نقاش", ar: "رسام", tr: "Boya" } },
  { id: "gardener", name: { en: "Gardener", fa: "باغبان", ar: "بستاني", tr: "Bahçıvan" } },
  { id: "driver", name: { en: "Driver", fa: "راننده", ar: "سائق", tr: "Şoför" } },
  { id: "cook", name: { en: "Cook", fa: "آشپز", ar: "طباخ", tr: "Aşçı" } },
  { id: "waiter", name: { en: "Waiter", fa: "گارسون", ar: "نادل", tr: "Garson" } },
];

const rateTypes = [
  { id: "hourly", name: { en: "Hourly", fa: "ساعتی", ar: "بالساعة", tr: "Saatlik" } },
  { id: "daily", name: { en: "Daily", fa: "روزانه", ar: "يومي", tr: "Günlük" } },
  { id: "weekly", name: { en: "Weekly", fa: "هفتگی", ar: "أسبوعي", tr: "Haftalık" } },
  { id: "monthly", name: { en: "Monthly", fa: "ماهانه", ar: "شهري", tr: "Aylık" } },
];

const availabilityTypes = [
  { id: "fullTime", name: { en: "Full Time", fa: "تمام وقت", ar: "دوام كامل", tr: "Tam Zamanlı" } },
  { id: "partTime", name: { en: "Part Time", fa: "نیمه وقت", ar: "دوام جزئي", tr: "Yarı Zamanlı" } },
  { id: "flexible", name: { en: "Flexible", fa: "انعطاف‌پذیر", ar: "مرن", tr: "Esnek" } },
  { id: "urgent", name: { en: "Urgent", fa: "فوری", ar: "عاجل", tr: "Acil" } },
];

const experienceLevels = [
  { id: "beginner", name: { en: "Beginner", fa: "مبتدی", ar: "مبتدئ", tr: "Başlangıç" } },
  { id: "intermediate", name: { en: "Intermediate", fa: "متوسط", ar: "متوسط", tr: "Orta" } },
  { id: "experienced", name: { en: "Experienced", fa: "با تجربه", ar: "ذو خبرة", tr: "Deneyimli" } },
  { id: "expert", name: { en: "Expert", fa: "متخصص", ar: "خبير", tr: "Uzman" } },
];

const languages = [
  { id: "fa", name: { en: "Persian", fa: "فارسی", ar: "الفارسية", tr: "Farsça" } },
  { id: "en", name: { en: "English", fa: "انگلیسی", ar: "الإنجليزية", tr: "İngilizce" } },
  { id: "ar", name: { en: "Arabic", fa: "عربی", ar: "العربية", tr: "Arapça" } },
  { id: "tr", name: { en: "Turkish", fa: "ترکی", ar: "التركية", tr: "Türkçe" } },
  { id: "any", name: { en: "Any Language", fa: "هر زبانی", ar: "أي لغة", tr: "Herhangi Bir Dil" } },
];

export default function PostJobPage() {
  const [lang, setLang] = useState("en");
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "",
    description: "",
    location: "",
    rate: "",
    rateType: "hourly",
    availability: "flexible",
    requirements: "",
    experience: "beginner",
    language: "any",
    contactPhone: "",
    contactEmail: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement job posting logic
    console.log("Job posting:", formData);
    // For now, redirect to profile
    router.push("/profile");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            {tooltips[lang].postJob}
          </h1>
        </div>
      </div>

      {/* Job Posting Form */}
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
          {/* Job Title and Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#000",
                fontWeight: "bold",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].jobTitle}
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#000",
                  boxSizing: "border-box",
                }}
                required
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
                value={formData.jobType}
                onChange={(e) => handleInputChange("jobType", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#000",
                  boxSizing: "border-box",
                }}
                required
              >
                <option value="">{tooltips[lang].jobType}</option>
                {jobTypes.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.name[lang as keyof typeof job.name]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#000",
              fontWeight: "bold",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].description}
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
              placeholder="Describe the job requirements, responsibilities, and any specific details..."
              required
            />
          </div>

          {/* Location and Rate */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
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
                  }}
                  placeholder="Enter location or postcode"
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
            
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#000",
                fontWeight: "bold",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].rate}
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <input
                    type="number"
                    value={formData.rate}
                    onChange={(e) => handleInputChange("rate", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      paddingLeft: "40px",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      fontSize: "16px",
                      color: "#000",
                      boxSizing: "border-box",
                    }}
                    placeholder="0"
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
                <select
                  value={formData.rateType}
                  onChange={(e) => handleInputChange("rateType", e.target.value)}
                  style={{
                    padding: "12px 16px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#000",
                    minWidth: "100px",
                  }}
                >
                  {rateTypes.map(rate => (
                    <option key={rate.id} value={rate.id}>
                      {rate.name[lang as keyof typeof rate.name]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Availability and Experience */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#000",
                fontWeight: "bold",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].availability}
              </label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#000",
                  boxSizing: "border-box",
                }}
              >
                {availabilityTypes.map(availability => (
                  <option key={availability.id} value={availability.id}>
                    {availability.name[lang as keyof typeof availability.name]}
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
                {tooltips[lang].experience}
              </label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#000",
                  boxSizing: "border-box",
                }}
              >
                {experienceLevels.map(exp => (
                  <option key={exp.id} value={exp.id}>
                    {exp.name[lang as keyof typeof exp.name]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Language Preference */}
          <div style={{ marginBottom: "20px" }}>
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
              value={formData.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "8px",
                fontSize: "16px",
                color: "#000",
                boxSizing: "border-box",
              }}
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name[lang.id as keyof typeof lang.name]}
                </option>
              ))}
            </select>
          </div>

          {/* Requirements */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#000",
              fontWeight: "bold",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].requirements}
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              rows={3}
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
              placeholder="Any specific requirements, skills, or qualifications needed..."
            />
          </div>

          {/* Contact Information */}
          <div style={{ 
            padding: "20px", 
            background: "#f8f9fa", 
            borderRadius: "12px", 
            marginBottom: "20px" 
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
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#000",
                    boxSizing: "border-box",
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
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#000",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(145deg, #28a745, #1e7e34)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(40, 167, 69, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FaPlus size={18} />
            {tooltips[lang].submit}
          </button>
        </form>
      </div>
    </div>
  );
} 