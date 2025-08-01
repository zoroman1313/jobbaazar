"use client";
import { useState } from "react";

type Props = {
  icon: React.ReactNode;
  label: string; // Text in user's language
  onConfirm: () => void;
};

export default function IconButtonWithConfirm({ icon, label, onConfirm }: Props) {
  const [showText, setShowText] = useState(false);

  const handleClick = () => {
    if (!showText) {
      setShowText(true);
      setTimeout(() => setShowText(false), 2000);
    } else {
      setShowText(false);
      onConfirm();
    }
  };

  return (
    <div style={{ display: "inline-block", position: "relative", margin: 16 }}>
      <button
        aria-label={label}
        style={{
          background: "#fff",
          border: "2px solid #0070f3",
          borderRadius: "50%",
          padding: 20,
          cursor: "pointer",
          fontSize: 32,
        }}
        onClick={handleClick}
        onBlur={() => setShowText(false)}
      >
        {icon}
      </button>
      {showText && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            top: "110%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222",
            color: "#fff",
            padding: "6px 16px",
            borderRadius: 6,
            fontSize: 16,
            whiteSpace: "nowrap",
            zIndex: 10,
            marginTop: 4,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
} 