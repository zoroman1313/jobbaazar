"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaUserPlus, FaSync, FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    register: "Register",
    name: "First Name",
    surname: "Last Name",
    phone: "Phone Number",
    postalCode: "Postal Code",
    email: "Email",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    submit: "Register",
    haveAccount: "Already have an account?",
    login: "Login",
    generatePassword: "Generate Password",
    city: "City",
  },
  fa: {
    back: "بازگشت",
    register: "ثبت نام",
    name: "نام",
    surname: "نام خانوادگی",
    phone: "شماره تلفن",
    postalCode: "کد پستی",
    email: "ایمیل",
    username: "نام کاربری",
    password: "رمز عبور",
    confirmPassword: "تایید رمز عبور",
    submit: "ثبت نام",
    haveAccount: "قبلاً حساب کاربری دارید؟",
    login: "ورود",
    generatePassword: "تولید رمز عبور",
    city: "شهر",
  },
  ar: {
    back: "رجوع",
    register: "تسجيل",
    name: "الاسم الأول",
    surname: "اسم العائلة",
    phone: "رقم الهاتف",
    postalCode: "الرمز البريدي",
    email: "البريد الإلكتروني",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    submit: "تسجيل",
    haveAccount: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    generatePassword: "إنشاء كلمة مرور",
    city: "المدينة",
  },
  tr: {
    back: "Geri",
    register: "Kayıt Ol",
    name: "Ad",
    surname: "Soyad",
    phone: "Telefon Numarası",
    postalCode: "Posta Kodu",
    email: "E-posta",
    username: "Kullanıcı Adı",
    password: "Şifre",
    confirmPassword: "Şifre Onayı",
    submit: "Kayıt Ol",
    haveAccount: "Zaten hesabınız var mı?",
    login: "Giriş",
    generatePassword: "Şifre Oluştur",
    city: "Şehir",
  },
};

// Country codes for phone
const countryCodes = [
  { code: "+44", country: "GB", name: "UK" },
  { code: "+98", country: "IR", name: "Iran" },
  { code: "+966", country: "SA", name: "Saudi Arabia" },
  { code: "+90", country: "TR", name: "Turkey" },
  { code: "+1", country: "US", name: "USA" },
  { code: "+49", country: "DE", name: "Germany" },
  { code: "+33", country: "FR", name: "France" },
];

// Function to generate a strong password
const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Function to get city from postal code (mock function)
const getCityFromPostalCode = (postalCode: string) => {
  // This is a mock function - in real app, you'd call an API
  const cities: Record<string, string> = {
    "SW1A": "London",
    "M1": "Manchester",
    "B1": "Birmingham",
    "L1": "Liverpool",
    "EH1": "Edinburgh",
    "G1": "Glasgow",
    "CF1": "Cardiff",
    "LS1": "Leeds",
    "S1": "Sheffield",
    "NG1": "Nottingham",
  };
  
  for (const [prefix, city] of Object.entries(cities)) {
    if (postalCode.toUpperCase().startsWith(prefix)) {
      return city;
    }
  }
  return "";
};

export default function RegisterPage() {
  const [lang, setLang] = useState("en");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCountryCodes, setShowCountryCodes] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+44");
  const [cityName, setCityName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    postalCode: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  const handleBack = () => {
    router.push("/auth");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // TODO: Implement registration logic
    console.log("Registration attempt:", formData);
    // For now, redirect to profile
    router.push("/profile");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update city name when postal code changes
    if (field === "postalCode") {
      const city = getCityFromPostalCode(value);
      setCityName(city);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData(prev => ({ 
      ...prev, 
      password: newPassword,
      confirmPassword: newPassword 
    }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
      }}
    >
      {/* Back button */}
      <button
        onClick={handleBack}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "none",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          color: "#0070f3",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 8,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#e6f0ff";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "none";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <FaArrowLeft />
        <span style={{ fontSize: 16 }}>{tooltips[lang].back}</span>
      </button>

      {/* Register Form */}
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "500px",
          border: "2px solid #e6f0ff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <FaUserPlus size={48} color="#28a745" />
          <h2 style={{ 
            margin: "16px 0 8px 0", 
            color: "#000",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].register}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#000",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].name}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s ease",
                  boxSizing: "border-box",
                  color: "#000",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0070f3";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e1e5e9";
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
                {tooltips[lang].surname}
              </label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => handleInputChange("surname", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s ease",
                  boxSizing: "border-box",
                  color: "#000",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0070f3";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e1e5e9";
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#000",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].phone}
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex" }}>
                  <button
                    type="button"
                    onClick={() => setShowCountryCodes(!showCountryCodes)}
                    style={{
                      padding: "12px 8px",
                      border: "2px solid #e1e5e9",
                      borderRight: "none",
                      borderRadius: "8px 0 0 8px",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "14px",
                      color: "#000",
                      minWidth: "80px",
                    }}
                  >
                    {selectedCountryCode}
                    <FaChevronDown size={12} />
                  </button>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      border: "2px solid #e1e5e9",
                      borderRadius: "0 8px 8px 0",
                      fontSize: "16px",
                      transition: "border-color 0.3s ease",
                      boxSizing: "border-box",
                      color: "#000",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0070f3";
                      const button = e.target.parentElement?.previousElementSibling as HTMLButtonElement;
                      if (button) button.style.borderColor = "#0070f3";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e1e5e9";
                      const button = e.target.parentElement?.previousElementSibling as HTMLButtonElement;
                      if (button) button.style.borderColor = "#e1e5e9";
                    }}
                    required
                  />
                </div>
                {showCountryCodes && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      background: "#fff",
                      border: "2px solid #e1e5e9",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      maxHeight: "200px",
                      overflowY: "auto",
                      width: "100%",
                    }}
                  >
                    {countryCodes.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountryCode(country.code);
                          setShowCountryCodes(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "14px",
                          color: "#000",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f8f9fa";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "none";
                        }}
                      >
                        {country.code} ({country.name})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#000",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].postalCode}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    paddingRight: cityName ? "120px" : "16px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "border-color 0.3s ease",
                    boxSizing: "border-box",
                    color: "#000",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0070f3";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9";
                  }}
                  required
                />
                {cityName && (
                  <div
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "#0070f3",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {cityName}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
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
                transition: "border-color 0.3s ease",
                boxSizing: "border-box",
                color: "#000",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#0070f3";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e1e5e9";
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#000",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].username}
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
                boxSizing: "border-box",
                color: "#000",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#0070f3";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e1e5e9";
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ 
                color: "#000",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].password}
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0070f3",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                <FaSync size={12} />
                {tooltips[lang].generatePassword}
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingRight: "50px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s ease",
                  boxSizing: "border-box",
                  color: "#000",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0070f3";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e1e5e9";
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#000",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].confirmPassword}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingRight: "50px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "border-color 0.3s ease",
                  boxSizing: "border-box",
                  color: "#000",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0070f3";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e1e5e9";
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(145deg, #28a745, #1e7e34)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginBottom: "16px",
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
            {tooltips[lang].submit}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <div style={{ 
            fontSize: "14px", 
            color: "#000",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].haveAccount}{" "}
            <button
              onClick={() => router.push("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#0070f3",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              {tooltips[lang].login}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 