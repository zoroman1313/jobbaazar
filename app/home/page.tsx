"use client";
import { useState, useEffect } from "react";
import { FaStore, FaShoppingCart, FaUserTie, FaHammer, FaUserCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    seller: "Sellers",
    jobseeker: "Job Seekers",
    contractor: "Contractors",
    jobprovider: "Job Providers",
  },
  fa: {
    seller: "فروشندگان",
    jobseeker: "متقاضیان کار",
    contractor: "پیمانکاران",
    jobprovider: "متقاضیان نیرو",
  },
  ar: {
    seller: "البائعون",
    jobseeker: "الباحثون عن عمل",
    contractor: "المقاولون",
    jobprovider: "مقدمو العمل",
  },
  tr: {
    seller: "Satıcılar",
    jobseeker: "İş Arayanlar",
    contractor: "Müteahhitler",
    jobprovider: "İş Verenler",
  },
};

const actions = [
  {
    key: "seller",
    icon: <FaStore size={56} color="#0070f3" />, // آبی
    route: "/auth",
    bg: "#e6f0ff",
  },
  {
    key: "jobseeker", 
    icon: <FaUserTie size={56} color="#28a745" />, // سبز
    route: "/auth",
    bg: "#e6ffe6",
  },
  {
    key: "contractor",
    icon: <FaHammer size={56} color="#ff6b35" />, // نارنجی
    route: "/auth", 
    bg: "#fff2e6",
  },
  {
    key: "jobprovider",
    icon: <FaUserCheck size={56} color="#6f42c1" />, // بنفش
    route: "/auth",
    bg: "#f3e8ff",
  },
];

export default function HomeMenu() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  const handleActionClick = (action: any) => {
    // Store user type for contractor
    if (action.key === "contractor") {
      localStorage.setItem("userType", "contractor");
    }
    router.push(action.route);
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
      }}
    >
      <div style={{ display: "flex", gap: 64 }}>
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
                  ? "0 8px 25px rgba(0, 112, 243, 0.3), 0 2px 8px rgba(0,0,0,0.06)"
                  : "0 2px 8px rgba(0,0,0,0.06)",
                outline: "none",
                fontSize: 56,
                transition: "all 0.3s ease",
                transform: hovered === action.key ? "scale(1.1)" : "scale(1)",
              }}
              onMouseEnter={() => setHovered(action.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(action.key)}
              onBlur={() => setHovered(null)}
              onClick={() => handleActionClick(action)}
            >
              {action.icon}
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
                  borderRadius: 8,
                  fontSize: 20,
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  marginTop: 8,
                }}
              >
                {tooltips[lang][action.key]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
