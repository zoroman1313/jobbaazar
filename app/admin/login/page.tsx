"use client";
import { useState, useEffect } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [lang, setLang] = useState("en");
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const translations = {
    en: {
      title: "Admin Login",
      subtitle: "Access the admin panel",
      username: "Username",
      password: "Password",
      login: "Login",
      back: "Back to Home",
      error: "Invalid credentials",
      loading: "Logging in..."
    },
    fa: {
      title: "ورود ادمین",
      subtitle: "دسترسی به پنل ادمین",
      username: "نام کاربری",
      password: "رمز عبور",
      login: "ورود",
      back: "بازگشت به خانه",
      error: "اطلاعات نامعتبر",
      loading: "در حال ورود..."
    },
    ar: {
      title: "تسجيل دخول الإدارة",
      subtitle: "الوصول إلى لوحة الإدارة",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      back: "العودة إلى الصفحة الرئيسية",
      error: "بيانات غير صحيحة",
      loading: "جاري تسجيل الدخول..."
    },
    tr: {
      title: "Yönetici Girişi",
      subtitle: "Yönetici paneline erişim",
      username: "Kullanıcı Adı",
      password: "Şifre",
      login: "Giriş",
      back: "Ana Sayfaya Dön",
      error: "Geçersiz bilgiler",
      loading: "Giriş yapılıyor..."
    }
  };

  const t = translations[lang as keyof typeof translations];

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    setLang(savedLang);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store admin data
        localStorage.setItem("admin", JSON.stringify(data.data.admin));
        router.push("/admin");
      } else {
        setError(data.message || t.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center"
      }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)"
          }}>
            <FaShieldAlt size={40} color="#fff" />
          </div>
          <h1 style={{
            margin: "0 0 8px 0",
            color: "#333",
            fontSize: "28px",
            fontWeight: "bold"
          }}>
            {t.title}
          </h1>
          <p style={{
            margin: 0,
            color: "#666",
            fontSize: "16px"
          }}>
            {t.subtitle}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {/* Username Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              {t.username}
            </label>
            <div style={{ position: "relative" }}>
              <FaUser style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666"
              }} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={t.username}
                required
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "10px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              {t.password}
            </label>
            <div style={{ position: "relative" }}>
              <FaLock style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666"
              }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t.password}
                required
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "10px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
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
                  color: "#666",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "#fee",
              color: "#c33",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              border: "1px solid #fcc"
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginBottom: "20px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {loading ? t.loading : t.login}
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none",
            border: "2px solid #667eea",
            color: "#667eea",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#667eea";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#667eea";
          }}
        >
          {t.back}
        </button>

        {/* Test Credentials */}
        <div style={{
          marginTop: "24px",
          padding: "16px",
          background: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#666"
        }}>
          <strong>Test Credentials:</strong><br />
          Username: admin<br />
          Password: admin123
        </div>
      </div>
    </div>
  );
} 