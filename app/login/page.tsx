"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    login: "Login",
    username: "Username or Email",
    password: "Password",
    submit: "Login",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    register: "Register",
  },
  fa: {
    back: "بازگشت",
    login: "ورود",
    username: "نام کاربری یا ایمیل",
    password: "رمز عبور",
    submit: "ورود",
    forgotPassword: "رمز عبور را فراموش کرده‌اید؟",
    noAccount: "حساب کاربری ندارید؟",
    register: "ثبت نام",
  },
  ar: {
    back: "رجوع",
    login: "تسجيل الدخول",
    username: "اسم المستخدم أو البريد الإلكتروني",
    password: "كلمة المرور",
    submit: "تسجيل الدخول",
    forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    register: "تسجيل",
  },
  tr: {
    back: "Geri",
    login: "Giriş",
    username: "Kullanıcı Adı veya E-posta",
    password: "Şifre",
    submit: "Giriş Yap",
    forgotPassword: "Şifremi Unuttum?",
    noAccount: "Hesabınız yok mu?",
    register: "Kayıt Ol",
  },
};

export default function LoginPage() {
  const [lang, setLang] = useState("en");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    // TODO: Implement login logic
    console.log("Login attempt:", formData);
    
    // Check if user is a contractor
    const userType = localStorage.getItem("userType");
    if (userType === "contractor") {
      // Store user as logged in contractor
      localStorage.setItem("user", JSON.stringify({ 
        type: "contractor", 
        username: formData.username 
      }));
      console.log("Contractor logged in, redirecting to profile");
    } else {
      // Store regular user
      localStorage.setItem("user", JSON.stringify({ 
        type: "user", 
        username: formData.username 
      }));
    }
    
    // Redirect to profile page
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
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

      {/* Login Form */}
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #e6f0ff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <FaSignInAlt size={48} color="#0070f3" />
          <h2 style={{ 
            margin: "16px 0 8px 0", 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].login}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#555",
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
              color: "#555",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].password}
            </label>
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

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(145deg, #0070f3, #0056b3)",
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
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 112, 243, 0.3)";
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
          <button
            style={{
              background: "none",
              border: "none",
              color: "#0070f3",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "16px",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}
          >
            {tooltips[lang].forgotPassword}
          </button>
          
          <div style={{ 
            fontSize: "14px", 
            color: "#666",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].noAccount}{" "}
            <button
              onClick={() => router.push("/register")}
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
              {tooltips[lang].register}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 