"use client";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "fa", country: "IR", native: "فارسی", aria: "Farsi" },
  { code: "en", country: "GB", native: "English", aria: "English" },
  { code: "ar", country: "SA", native: "العربية", aria: "Arabic" },
  { code: "tr", country: "TR", native: "Türkçe", aria: "Turkish" },
];

export default function LanguageSelection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (code: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", code);
      router.push("/home");
    }
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
      <div 
        style={{ 
          fontSize: 64, 
          marginBottom: 32,
          animation: "rotate 8s linear infinite",
          display: "inline-block",
          transformStyle: "preserve-3d",
        }} 
        role="img" 
        aria-label="Globe"
      >
        🌍
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 96px)",
          gap: 32,
        }}
      >
        {LANGUAGES.map((lang) => (
          <div 
            key={lang.code} 
            style={{ position: "relative" }}
            onMouseEnter={() => setHovered(lang.code)}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              aria-label={lang.aria}
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                border: hovered === lang.code 
                  ? "4px solid #0070f3" 
                  : "3px solid #0070f3",
                background: hovered === lang.code 
                  ? "linear-gradient(145deg, #ffffff, #f0f0f0)"
                  : "linear-gradient(145deg, #f8f9fa, #e9ecef)",
                fontSize: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: hovered === lang.code 
                  ? "0 20px 40px rgba(0, 112, 243, 0.5), 0 8px 16px rgba(0,0,0,0.2), inset 0 4px 8px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.1)"
                  : "0 8px 16px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(0,0,0,0.1)",
                outline: "none",
                transition: "all 0.3s ease",
                transform: hovered === lang.code 
                  ? "scale(1.2) translateY(-8px) rotateX(10deg) rotateY(5deg)" 
                  : "scale(1) translateY(0) rotateX(0deg) rotateY(0deg)",
                transformStyle: "preserve-3d",
                perspective: "1000px",
                position: "relative",
              }}
              onClick={() => handleSelect(lang.code)}
            >
              <div style={{
                transform: hovered === lang.code ? "translateZ(20px)" : "translateZ(0px)",
                transition: "transform 0.3s ease",
              }}>
                <ReactCountryFlag
                  countryCode={lang.country}
                  svg
                  style={{ 
                    width: "2.5em", 
                    height: "2.5em",
                    filter: hovered === lang.code 
                      ? "drop-shadow(0 4px 8px rgba(0,0,0,0.4)) brightness(1.1)" 
                      : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                    transition: "filter 0.3s ease"
                  }}
                  aria-label={lang.aria}
                />
              </div>
            </button>
            {hovered === lang.code && (
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
                  fontFamily: lang.code === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif"
                    : lang.code === "ar" ? "'Noto Naskh Arabic', Tahoma, Arial, sans-serif"
                    : "inherit",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  marginTop: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                {lang.native}
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
        
        @keyframes rotate {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
