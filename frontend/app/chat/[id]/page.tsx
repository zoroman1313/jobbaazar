"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaPaperPlane, FaPhone, FaVideo, FaEllipsisV } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    back: "Back",
    chat: "Chat",
    typeMessage: "Type a message...",
    send: "Send",
    call: "Call",
    video: "Video Call",
    more: "More",
    online: "Online",
    offline: "Offline",
    lastSeen: "Last seen",
  },
  fa: {
    back: "بازگشت",
    chat: "چت",
    typeMessage: "پیام بنویسید...",
    send: "ارسال",
    call: "تماس",
    video: "تماس تصویری",
    more: "بیشتر",
    online: "آنلاین",
    offline: "آفلاین",
    lastSeen: "آخرین بازدید",
  },
  ar: {
    back: "رجوع",
    chat: "دردشة",
    typeMessage: "اكتب رسالة...",
    send: "إرسال",
    call: "اتصال",
    video: "اتصال فيديو",
    more: "المزيد",
    online: "متصل",
    offline: "غير متصل",
    lastSeen: "آخر ظهور",
  },
  tr: {
    back: "Geri",
    chat: "Sohbet",
    typeMessage: "Mesaj yazın...",
    send: "Gönder",
    call: "Ara",
    video: "Görüntülü Ara",
    more: "Daha Fazla",
    online: "Çevrimiçi",
    offline: "Çevrimdışı",
    lastSeen: "Son görülme",
  },
};

// Mock worker data
const mockWorker = {
  id: 1,
  name: "احمد محمدی",
  jobType: "cleaner",
  rating: 4.8,
  isOnline: true,
  lastSeen: "2 minutes ago",
  image: "👨‍💼"
};

// Mock messages
const mockMessages = [
  {
    id: 1,
    sender: "worker",
    text: "سلام، من برای کار نظافت در دسترس هستم",
    timestamp: "10:30 AM",
    isRead: true
  },
  {
    id: 2,
    sender: "user",
    text: "سلام، چه ساعتی می‌توانید بیایید؟",
    timestamp: "10:32 AM",
    isRead: true
  },
  {
    id: 3,
    sender: "worker",
    text: "امروز بعد از ظهر ساعت 2 می‌توانم بیایم",
    timestamp: "10:33 AM",
    isRead: true
  },
  {
    id: 4,
    sender: "user",
    text: "عالی، آدرس را برایتان ارسال می‌کنم",
    timestamp: "10:35 AM",
    isRead: false
  }
];

export default function ChatPage() {
  const [lang, setLang] = useState("en");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [worker, setWorker] = useState(mockWorker);
  const router = useRouter();
  const params = useParams();
  const workerId = params.id;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
    // TODO: Fetch worker data and messages based on workerId
    console.log("Chat with worker:", workerId);
  }, [workerId]);

  const handleBack = () => {
    router.push("/search");
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // TODO: Send message to backend
      console.log("Sending message:", newMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCall = () => {
    // TODO: Implement call functionality
    console.log("Calling worker:", workerId);
  };

  const handleVideoCall = () => {
    // TODO: Implement video call functionality
    console.log("Video calling worker:", workerId);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8f9fa",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "16px 20px",
          borderBottom: "1px solid #e1e5e9",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: "#0070f3",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaArrowLeft />
        </button>
        
        <div style={{ fontSize: "32px" }}>{worker.image}</div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: "0 0 4px 0", 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {worker.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: worker.isOnline ? "#28a745" : "#dc3545",
              }}
            />
            <span style={{ 
              fontSize: "12px", 
              color: worker.isOnline ? "#28a745" : "#666",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {worker.isOnline ? tooltips[lang].online : tooltips[lang].lastSeen}
            </span>
            {!worker.isOnline && (
              <span style={{ 
                fontSize: "12px", 
                color: "#666",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {worker.lastSeen}
              </span>
            )}
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleCall}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#0070f3",
              padding: "8px",
              borderRadius: "50%",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e6f0ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            <FaPhone />
          </button>
          
          <button
            onClick={handleVideoCall}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#0070f3",
              padding: "8px",
              borderRadius: "50%",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e6f0ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            <FaVideo />
          </button>
          
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#666",
              padding: "8px",
              borderRadius: "50%",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8f9fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.sender === "user" ? "#0070f3" : "#fff",
                color: msg.sender === "user" ? "#fff" : "#333",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
              }}
            >
              <div style={{
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit",
                lineHeight: "1.4",
                wordWrap: "break-word",
              }}>
                {msg.text}
              </div>
              <div style={{
                fontSize: "11px",
                opacity: 0.7,
                marginTop: "4px",
                textAlign: msg.sender === "user" ? "right" : "left",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {msg.timestamp}
                {msg.sender === "user" && (
                  <span style={{ marginLeft: "4px" }}>
                    {msg.isRead ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div
        style={{
          background: "#fff",
          padding: "16px 20px",
          borderTop: "1px solid #e1e5e9",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={tooltips[lang].typeMessage}
              rows={1}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "24px",
                fontSize: "16px",
                color: "#000",
                resize: "none",
                outline: "none",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit",
                minHeight: "48px",
                maxHeight: "120px",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#0070f3";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e1e5e9";
              }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            style={{
              background: message.trim() ? "#0070f3" : "#e1e5e9",
              color: message.trim() ? "#fff" : "#666",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              cursor: message.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (message.trim()) {
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
      </div>
    </div>
  );
} 