"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaComments, 
  FaPaperPlane, 
  FaPlus, 
  FaSearch, 
  FaEllipsisH,
  FaArrowLeft,
  FaUser,
  FaUsers,
  FaBriefcase,
  FaCheck,
  FaCheckDouble,
  FaClock,
  FaSmile,
  FaPaperclip,
  FaMicrophone,
  FaPhone,
  FaVideo,
  FaImage,
  FaFile,
  FaMapMarkerAlt
} from 'react-icons/fa';

interface Chat {
  id: number;
  type: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  participants: string[];
}

interface Message {
  id: number;
  sender: string;
  content: string;
  type: string;
  timestamp: Date;
  status: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);

  // ترجمه‌ها
  const translations = {
    en: {
      title: "Messages",
      newChat: "New Chat",
      search: "Search chats...",
      noChats: "No chats yet",
      startChat: "Start a new conversation",
      typeMessage: "Type a message...",
      send: "Send",
      online: "Online",
      lastSeen: "Last seen",
      today: "Today",
      yesterday: "Yesterday",
      private: "Private",
      group: "Group",
      job: "Job",
      project: "Project",
      back: "Back",
      attachments: "Attachments",
      image: "Image",
      file: "File",
      location: "Location",
      contact: "Contact",
      voiceMessage: "Voice Message",
      call: "Call",
      videoCall: "Video Call",
      more: "More",
      archive: "Archive",
      delete: "Delete",
      mute: "Mute",
      block: "Block"
    },
    fa: {
      title: "پیام‌ها",
      newChat: "چت جدید",
      search: "جستجو در چت‌ها...",
      noChats: "هنوز چتی وجود ندارد",
      startChat: "شروع گفتگوی جدید",
      typeMessage: "پیام خود را بنویسید...",
      send: "ارسال",
      online: "آنلاین",
      lastSeen: "آخرین بازدید",
      today: "امروز",
      yesterday: "دیروز",
      private: "خصوصی",
      group: "گروه",
      job: "کار",
      project: "پروژه",
      back: "بازگشت",
      attachments: "پیوست‌ها",
      image: "عکس",
      file: "فایل",
      location: "موقعیت",
      contact: "مخاطب",
      voiceMessage: "پیام صوتی",
      call: "تماس",
      videoCall: "تماس تصویری",
      more: "بیشتر",
      archive: "آرشیو",
      delete: "حذف",
      mute: "بی‌صدا",
      block: "مسدود"
    },
    ar: {
      title: "الرسائل",
      newChat: "محادثة جديدة",
      search: "البحث في المحادثات...",
      noChats: "لا توجد محادثات بعد",
      startChat: "ابدأ محادثة جديدة",
      typeMessage: "اكتب رسالة...",
      send: "إرسال",
      online: "متصل",
      lastSeen: "آخر ظهور",
      today: "اليوم",
      yesterday: "أمس",
      private: "خاص",
      group: "مجموعة",
      job: "عمل",
      project: "مشروع",
      back: "رجوع",
      attachments: "المرفقات",
      image: "صورة",
      file: "ملف",
      location: "الموقع",
      contact: "جهة اتصال",
      voiceMessage: "رسالة صوتية",
      call: "اتصال",
      videoCall: "اتصال فيديو",
      more: "المزيد",
      archive: "أرشيف",
      delete: "حذف",
      mute: "كتم",
      block: "حظر"
    },
    tr: {
      title: "Mesajlar",
      newChat: "Yeni Sohbet",
      search: "Sohbetlerde ara...",
      noChats: "Henüz sohbet yok",
      startChat: "Yeni konuşma başlat",
      typeMessage: "Mesaj yazın...",
      send: "Gönder",
      online: "Çevrimiçi",
      lastSeen: "Son görülme",
      today: "Bugün",
      yesterday: "Dün",
      private: "Özel",
      group: "Grup",
      job: "İş",
      project: "Proje",
      back: "Geri",
      attachments: "Ekler",
      image: "Resim",
      file: "Dosya",
      location: "Konum",
      contact: "Kişi",
      voiceMessage: "Sesli Mesaj",
      call: "Ara",
      videoCall: "Görüntülü Ara",
      more: "Daha Fazla",
      archive: "Arşivle",
      delete: "Sil",
      mute: "Sustur",
      block: "Engelle"
    }
  };

  const t = translations[lang as keyof typeof translations];

  // داده‌های نمونه چت‌ها
  const mockChats = [
    {
      id: 1,
      type: 'private',
      name: 'Ahmed Hassan',
      avatar: null,
      lastMessage: 'Hello, are you available for work?',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      unreadCount: 2,
      isOnline: true,
      participants: ['user1', 'user2']
    },
    {
      id: 2,
      type: 'job',
      name: 'Construction Project - London',
      avatar: null,
      lastMessage: 'Payment has been sent to your wallet',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 0,
      isOnline: false,
      participants: ['user1', 'employer1']
    },
    {
      id: 3,
      type: 'group',
      name: 'Iranian Workers Group',
      avatar: null,
      lastMessage: 'New job opportunities in Manchester',
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unreadCount: 5,
      isOnline: false,
      participants: ['user1', 'user3', 'user4', 'user5']
    },
    {
      id: 4,
      type: 'private',
      name: 'Mohammed Ali',
      avatar: null,
      lastMessage: 'Thank you for the great work!',
      lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      unreadCount: 0,
      isOnline: false,
      participants: ['user1', 'user6']
    }
  ];

  // داده‌های نمونه پیام‌ها
  const mockMessages = [
    {
      id: 1,
      sender: 'user2',
      content: 'Hello, are you available for work?',
      type: 'text',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'read'
    },
    {
      id: 2,
      sender: 'user1',
      content: 'Yes, I am available. What kind of work?',
      type: 'text',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: 'read'
    },
    {
      id: 3,
      sender: 'user2',
      content: 'Construction work in London. £15 per hour.',
      type: 'text',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      status: 'read'
    },
    {
      id: 4,
      sender: 'user1',
      content: 'That sounds good. When do you need me to start?',
      type: 'text',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'delivered'
    },
    {
      id: 5,
      sender: 'user2',
      content: 'Tomorrow morning at 8 AM. I will send you the address.',
      type: 'text',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: 'sent'
    }
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLang(savedLang);
    
    // شبیه‌سازی بارگذاری داده‌ها
    setTimeout(() => {
      setChats(mockChats);
      setLoading(false);
    }, 1000);
  }, []);

  const getChatIcon = (type: string) => {
    switch (type) {
      case 'private': return <FaUser />;
      case 'group': return <FaUsers />;
      case 'job': return <FaBriefcase />;
      case 'project': return <FaBriefcase />;
      default: return <FaUser />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <FaCheck style={{ color: '#999' }} />;
      case 'delivered': return <FaCheckDouble style={{ color: '#999' }} />;
      case 'read': return <FaCheckDouble style={{ color: '#007bff' }} />;
      default: return <FaClock style={{ color: '#999' }} />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return t.yesterday;
    return `${days}d`;
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now(),
      sender: 'user1',
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // شبیه‌سازی ارسال پیام
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, status: 'sent' } : m)
      );
    }, 1000);
  };

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages(mockMessages);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: lang === 'fa' ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>
          {lang === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      fontFamily: lang === 'fa' ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
    }}>
      {/* Chat List */}
      <div style={{
        width: '350px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
            {t.title}
          </h1>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            style={{
              background: '#007bff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px'
            }}
          >
            <FaPlus />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '16px' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FaSearch style={{
              position: 'absolute',
              left: '12px',
              color: '#999',
              fontSize: '14px'
            }} />
            <input
              type="text"
              placeholder={t.search}
              style={{
                width: '100%',
                padding: '10px 10px 10px 36px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Chat List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#666'
            }}>
              <FaComments size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <div>{t.noChats}</div>
              <button
                onClick={() => setShowNewChat(true)}
                style={{
                  background: '#007bff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: '12px'
                }}
              >
                {t.startChat}
              </button>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  background: selectedChat?.id === chat.id ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px'
                  }}>
                    {getChatIcon(chat.type)}
                  </div>
                  {chat.isOnline && (
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#28a745',
                      border: '2px solid white'
                    }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#333',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {chat.name}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {formatTime(chat.lastMessageTime)}
                    </span>
                  </div>
                  
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '14px',
                    color: '#666',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {chat.lastMessage}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <div style={{
                    background: '#007bff',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#007bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px'
                }}>
                  {getChatIcon(selectedChat.type)}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                    {selectedChat.name}
                  </h2>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    {selectedChat.isOnline ? t.online : `${t.lastSeen} ${formatTime(selectedChat.lastMessageTime)}`}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#666'
                }}>
                  <FaPhone />
                </button>
                <button style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#666'
                }}>
                  <FaVideo />
                </button>
                <button style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#666'
                }}>
                  <FaEllipsisH />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              background: 'rgba(255, 255, 255, 0.9)'
            }}>
              {messages.map(message => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.sender === 'user1' ? 'flex-end' : 'flex-start',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    background: message.sender === 'user1' ? '#007bff' : '#f1f1f1',
                    color: message.sender === 'user1' ? 'white' : '#333',
                    position: 'relative'
                  }}>
                    <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                      {message.content}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px',
                      marginTop: '4px',
                      fontSize: '11px',
                      opacity: 0.7
                    }}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === 'user1' && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div style={{
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderTop: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#666'
                }}>
                  <FaPaperclip />
                </button>
                <button style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#666'
                }}>
                  <FaSmile />
                </button>
                
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={t.typeMessage}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '24px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    background: newMessage.trim() ? '#007bff' : '#ccc',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            opacity: 0.7
          }}>
            {lang === 'fa' ? 'چتی را انتخاب کنید' : 'Select a chat to start messaging'}
          </div>
        )}
      </div>
    </div>
  );
} 