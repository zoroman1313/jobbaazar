"use client";
import { useState, useEffect } from "react";
import { FaSignInAlt, FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    login: "Login",
    register: "Register",
    back: "Back",
  },
  fa: {
    login: "ورود",
    register: "ثبت نام",
    back: "بازگشت",
  },
  ar: {
    login: "تسجيل الدخول",
    register: "تسجيل",
    back: "رجوع",
  },
  tr: {
    login: "Giriş",
    register: "Kayıt Ol",
    back: "Geri",
  },
};

const actions = [
  {
    key: "login",
    icon: <FaSignInAlt size={56} color="#0070f3" />, // آبی
    route: "/login",
    bg: "#e6f0ff",
  },
  {
    key: "register", 
    icon: <FaUserPlus size={56} color="#28a745" />, // سبز
    route: "/register",
    bg: "#e6ffe6",
  },
];

export default function AuthPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
      
      // Check if user came from contractor selection
      const userType = localStorage.getItem("userType");
      if (userType === "contractor") {
        // Show contractor-specific message or styling
        console.log("Contractor user accessing auth page");
      }
    }
  }, []);

  const handleBack = () => {
    router.push("/home");
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

      <div
        style={{
          display: "flex",
          gap: 64,
        }}
      >
        {actions.map((action) => (
          <div key={action.key} style={{ position: "relative" }}>
            <button
              aria-label={tooltips[lang][action.key]}
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "2px solid #0070f3",
                background: action.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: hovered === action.key 
                  ? "0 20px 40px rgba(0, 112, 243, 0.4), 0 8px 16px rgba(0,0,0,0.15), inset 0 4px 8px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.1)"
                  : "0 8px 16px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(0,0,0,0.1)",
                outline: "none",
                transition: "all 0.3s ease",
                transform: hovered === action.key 
                  ? "scale(1.2) translateY(-8px) rotateX(10deg) rotateY(5deg)" 
                  : "scale(1) translateY(0) rotateX(0deg) rotateY(0deg)",
                transformStyle: "preserve-3d",
                perspective: "1000px",
                position: "relative",
              }}
              onMouseEnter={() => setHovered(action.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(action.key)}
              onBlur={() => setHovered(null)}
              onClick={() => router.push(action.route)}
            >
              <div style={{
                transform: hovered === action.key ? "translateZ(20px)" : "translateZ(0px)",
                transition: "transform 0.3s ease",
              }}>
                {action.icon}
              </div>
            </button>
            {hovered === action.key && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#222",
                  color: "#fff",
                  padding: "8px 20px",
                  borderRadius: 12,
                  fontSize: 20,
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif"
                    : lang === "ar" ? "'Noto Naskh Arabic', Tahoma, Arial, sans-serif"
                    : "inherit",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  marginTop: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                {tooltips[lang][action.key]}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
} 