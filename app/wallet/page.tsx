"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaWallet, FaPlus, FaMinus, FaHistory, FaCog, FaPoundSign, FaCreditCard, FaUniversity, FaPaypal, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tooltip translations
const tooltips: Record<string, any> = {
  en: {
    // Cleaned: No duplicate keys - Vercel build fix
    back: "Back",
    wallet: "Digital Wallet",
    balance: "Balance",
    deposit: "Deposit",
    withdraw: "Withdraw",
    history: "Transaction History",
    settings: "Settings",
    amount: "Amount",
    paymentMethod: "Payment Method",
    card: "Credit/Debit Card",
    bankTransfer: "Bank Transfer",
    paypal: "PayPal",
    walletBalance: "Wallet Balance",
    submit: "Submit",
    cancel: "Cancel",
    transactionHistory: "Transaction History",
    noTransactions: "No transactions yet",
    type: "Type",
    status: "Status",
    date: "Date",
    reference: "Reference",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    cancelled: "Cancelled",
    withdrawal: "Withdrawal",
    payment: "Payment",
    refund: "Refund",
    transfer: "Transfer",
    showBalance: "Show Balance",
    hideBalance: "Hide Balance",
    quickActions: "Quick Actions",
    recentTransactions: "Recent Transactions",
    viewAll: "View All",
    stats: "Statistics",
    totalSpent: "Total Spent",
    totalReceived: "Total Received",
    monthlySpent: "Monthly Spent",
    monthlyReceived: "Monthly Received",
  },
  fa: {
    // نسخه تمیز بدون کلید تکراری - حل مشکل Vercel
    back: "بازگشت",
    wallet: "کیف پول دیجیتال",
    balance: "موجودی",
    deposit: "شارژ",
    withdraw: "برداشت",
    history: "تاریخچه تراکنش‌ها",
    settings: "تنظیمات",
    amount: "مبلغ",
    paymentMethod: "روش پرداخت",
    card: "کارت اعتباری/دبیت",
    bankTransfer: "انتقال بانکی",
    paypal: "پی‌پال",
    walletBalance: "موجودی کیف پول",
    submit: "ثبت",
    cancel: "لغو",
    transactionHistory: "تاریخچه تراکنش‌ها",
    noTransactions: "هنوز تراکنشی وجود ندارد",
    type: "نوع",
    status: "وضعیت",
    date: "تاریخ",
    reference: "مرجع",
    pending: "در انتظار",
    completed: "تکمیل شده",
    failed: "ناموفق",
    cancelled: "لغو شده",
    withdrawal: "برداشت",
    payment: "پرداخت",
    refund: "بازپرداخت",
    transfer: "انتقال",
    showBalance: "نمایش موجودی",
    hideBalance: "مخفی کردن موجودی",
    quickActions: "عملیات سریع",
    recentTransactions: "تراکنش‌های اخیر",
    viewAll: "مشاهده همه",
    stats: "آمار",
    totalSpent: "کل خرج شده",
    totalReceived: "کل دریافت شده",
    monthlySpent: "خرج ماهانه",
    monthlyReceived: "دریافت ماهانه",
  },
  ar: {
    // نسخة نظيفة بدون مفاتيح مكررة - إصلاح مشكلة Vercel
    back: "رجوع",
    wallet: "المحفظة الرقمية",
    balance: "الرصيد",
    deposit: "إيداع",
    withdraw: "سحب",
    history: "سجل المعاملات",
    settings: "الإعدادات",
    amount: "المبلغ",
    paymentMethod: "طريقة الدفع",
    card: "بطاقة ائتمان/خصم",
    bankTransfer: "تحويل بنكي",
    paypal: "باي بال",
    walletBalance: "رصيد المحفظة",
    submit: "إرسال",
    cancel: "إلغاء",
    transactionHistory: "سجل المعاملات",
    noTransactions: "لا توجد معاملات بعد",
    type: "النوع",
    status: "الحالة",
    date: "التاريخ",
    reference: "المرجع",
    pending: "قيد الانتظار",
    completed: "مكتمل",
    failed: "فشل",
    cancelled: "ملغي",
    withdrawal: "سحب",
    payment: "دفع",
    refund: "استرداد",
    transfer: "تحويل",
    showBalance: "إظهار الرصيد",
    hideBalance: "إخفاء الرصيد",
    quickActions: "إجراءات سريعة",
    recentTransactions: "المعاملات الأخيرة",
    viewAll: "عرض الكل",
    stats: "الإحصائيات",
    totalSpent: "إجمالي المنفق",
    totalReceived: "إجمالي المستلم",
    monthlySpent: "الإنفاق الشهري",
    monthlyReceived: "المستلم الشهري",
  },
  tr: {
    // Temiz sürüm - tekrarlanan anahtarlar yok - Vercel sorunu çözümü
    back: "Geri",
    wallet: "Dijital Cüzdan",
    balance: "Bakiye",
    deposit: "Para Yatır",
    withdraw: "Para Çek",
    history: "İşlem Geçmişi",
    settings: "Ayarlar",
    amount: "Tutar",
    paymentMethod: "Ödeme Yöntemi",
    card: "Kredi/Banka Kartı",
    bankTransfer: "Banka Transferi",
    paypal: "PayPal",
    walletBalance: "Cüzdan Bakiyesi",
    submit: "Gönder",
    cancel: "İptal",
    transactionHistory: "İşlem Geçmişi",
    noTransactions: "Henüz işlem yok",
    type: "Tür",
    status: "Durum",
    date: "Tarih",
    reference: "Referans",
    pending: "Beklemede",
    completed: "Tamamlandı",
    failed: "Başarısız",
    cancelled: "İptal Edildi",
    withdrawal: "Para Çekme",
    payment: "Ödeme",
    refund: "İade",
    transfer: "Transfer",
    showBalance: "Bakiyeyi Göster",
    hideBalance: "Bakiyeyi Gizle",
    quickActions: "Hızlı İşlemler",
    recentTransactions: "Son İşlemler",
    viewAll: "Tümünü Gör",
    stats: "İstatistikler",
    totalSpent: "Toplam Harcanan",
    totalReceived: "Toplam Alınan",
    monthlySpent: "Aylık Harcanan",
    monthlyReceived: "Aylık Alınan",
  },
};

const paymentMethods = [
  { id: "card", name: { en: "Credit/Debit Card", fa: "کارت اعتباری/دبیت", ar: "بطاقة ائتمان/خصم", tr: "Kredi/Banka Kartı" }, icon: <FaCreditCard /> },
  { id: "bank_transfer", name: { en: "Bank Transfer", fa: "انتقال بانکی", ar: "تحويل بنكي", tr: "Banka Transferi" }, icon: <FaUniversity /> },
  { id: "paypal", name: { en: "PayPal", fa: "پی‌پال", ar: "باي بال", tr: "PayPal" }, icon: <FaPaypal /> },
];

// Mock wallet data
const mockWalletData = {
  balance: 1250.75,
  currency: "GBP",
  status: "active",
  stats: {
    totalSpent: 850.50,
    totalReceived: 2100.25,
    monthlySpent: 245.30,
    monthlyReceived: 500.00,
  },
  transactions: [
    {
      id: 1,
      type: "deposit",
      amount: 500.00,
      currency: "GBP",
      status: "completed",
      description: "Deposit via Credit Card",
      reference: "TXN123456789",
      paymentMethod: "card",
      createdAt: "2024-01-15T10:30:00Z",
      completedAt: "2024-01-15T10:32:00Z"
    },
    {
      id: 2,
      type: "payment",
      amount: 85.00,
      currency: "GBP",
      status: "completed",
      description: "Payment for Professional Drill Set",
      reference: "TXN987654321",
      paymentMethod: "wallet_balance",
      createdAt: "2024-01-14T15:45:00Z",
      completedAt: "2024-01-14T15:47:00Z"
    },
    {
      id: 3,
      type: "withdrawal",
      amount: 200.00,
      currency: "GBP",
      status: "pending",
      description: "Withdrawal to Bank Account",
      reference: "TXN456789123",
      paymentMethod: "bank_transfer",
      createdAt: "2024-01-13T09:15:00Z"
    },
    {
      id: 4,
      type: "deposit",
      amount: 300.00,
      currency: "GBP",
      status: "completed",
      description: "Deposit via PayPal",
      reference: "TXN789123456",
      paymentMethod: "paypal",
      createdAt: "2024-01-12T14:20:00Z",
      completedAt: "2024-01-12T14:22:00Z"
    }
  ]
};

export default function WalletPage() {
  // Force Vercel rebuild - Wallet page with fixed TypeScript errors
  // VERSION 3.0 - Latest commit with all fixes applied
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [walletData, setWalletData] = useState(mockWalletData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  const handleBack = () => {
    router.push("/profile");
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // TODO: Integrate with actual API
    const newTransaction = {
      id: Date.now(),
      type: "deposit",
      amount: parseFloat(depositAmount),
      currency: "GBP",
      status: "pending",
      description: `Deposit via ${paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name?.[lang as 'en' | 'fa' | 'ar' | 'tr'] || 'Unknown'}`,
      reference: `TXN${Date.now()}`,
      paymentMethod: selectedPaymentMethod,
      createdAt: new Date().toISOString()
    };

    setWalletData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));

    setDepositAmount("");
    setShowDepositModal(false);
    
    // Simulate successful deposit after 2 seconds
    setTimeout(() => {
      setWalletData(prev => ({
        ...prev,
        balance: prev.balance + parseFloat(depositAmount),
        transactions: prev.transactions.map(t => 
          t.id === newTransaction.id 
            ? { ...t, status: "completed", completedAt: new Date().toISOString() }
            : t
        )
      }));
    }, 2000);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (parseFloat(withdrawAmount) > walletData.balance) {
      alert("Insufficient balance");
      return;
    }

    // TODO: Integrate with actual API
    const newTransaction = {
      id: Date.now(),
      type: "withdrawal",
      amount: parseFloat(withdrawAmount),
      currency: "GBP",
      status: "pending",
      description: `Withdrawal to Bank Account`,
      reference: `TXN${Date.now()}`,
      paymentMethod: "bank_transfer",
      createdAt: new Date().toISOString()
    };

    setWalletData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));

    setWithdrawAmount("");
    setShowWithdrawModal(false);
    
    // Simulate successful withdrawal after 3 seconds
    setTimeout(() => {
      setWalletData(prev => ({
        ...prev,
        balance: prev.balance - parseFloat(withdrawAmount),
        transactions: prev.transactions.map(t => 
          t.id === newTransaction.id 
            ? { ...t, status: "completed", completedAt: new Date().toISOString() }
            : t
        )
      }));
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#28a745";
      case "pending": return "#ffc107";
      case "failed": return "#dc3545";
      case "cancelled": return "#6c757d";
      default: return "#6c757d";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit": return <FaPlus size={16} color="#28a745" />;
      case "withdrawal": return <FaMinus size={16} color="#dc3545" />;
      case "payment": return <FaWallet size={16} color="#0070f3" />;
      case "refund": return <FaPlus size={16} color="#28a745" />;
      case "transfer": return <FaWallet size={16} color="#6f42c1" />;
      default: return <FaWallet size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "fa" ? "fa-IR" : "en-GB");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderBottom: "1px solid #e1e5e9",
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
            }}
          >
            <FaArrowLeft />
          </button>
          <h1 style={{ 
            margin: 0, 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].wallet}
          </h1>
        </div>

        {/* Balance Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #0070f3, #0056b3)",
            borderRadius: "16px",
            padding: "24px",
            color: "#fff",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ 
                fontSize: "14px", 
                opacity: 0.8,
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].balance}
              </div>
              <div style={{ 
                fontSize: "32px", 
                fontWeight: "bold",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {showBalance ? (
                  <>
                    <FaPoundSign size={24} style={{ marginRight: "4px" }} />
                    {walletData.balance.toFixed(2)}
                  </>
                ) : (
                  "••••••"
                )}
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "8px",
                padding: "8px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {showBalance ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Quick Actions */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ 
            margin: "0 0 16px 0", 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].quickActions}
          </h3>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setShowDepositModal(true)}
              style={{
                flex: 1,
                padding: "16px",
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              <FaPlus size={16} />
              {tooltips[lang].deposit}
            </button>
            
            <button
              onClick={() => setShowWithdrawModal(true)}
              style={{
                flex: 1,
                padding: "16px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              <FaMinus size={16} />
              {tooltips[lang].withdraw}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ 
            margin: "0 0 16px 0", 
            color: "#333",
            fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
          }}>
            {tooltips[lang].stats}
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "24px", 
                fontWeight: "bold", 
                color: "#28a745",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                £{walletData.stats.monthlyReceived.toFixed(2)}
              </div>
              <div style={{ 
                fontSize: "14px", 
                color: "#666",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].monthlyReceived}
              </div>
            </div>
            
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "24px", 
                fontWeight: "bold", 
                color: "#dc3545",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                £{walletData.stats.monthlySpent.toFixed(2)}
              </div>
              <div style={{ 
                fontSize: "14px", 
                color: "#666",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].monthlySpent}
              </div>
            </div>
            
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "24px", 
                fontWeight: "bold", 
                color: "#0070f3",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                £{walletData.stats.totalReceived.toFixed(2)}
              </div>
              <div style={{ 
                fontSize: "14px", 
                color: "#666",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].totalReceived}
              </div>
            </div>
            
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "24px", 
                fontWeight: "bold", 
                color: "#ff6b35",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                £{walletData.stats.totalSpent.toFixed(2)}
              </div>
              <div style={{ 
                fontSize: "14px", 
                color: "#666",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].totalSpent}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ 
              margin: 0, 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].recentTransactions}
            </h3>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#0070f3",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}
            >
              {tooltips[lang].viewAll}
            </button>
          </div>
          
          {walletData.transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 0",
                borderBottom: "1px solid #f1f3f4",
              }}
            >
              <div style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "50%", 
                background: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {getTypeIcon(transaction.type)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: "bold",
                  color: "#333",
                  fontSize: "14px",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {transaction.description}
                </div>
                <div style={{ 
                  fontSize: "12px", 
                  color: "#666",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {formatDate(transaction.createdAt)} • {transaction.reference}
                </div>
              </div>
              
              <div style={{ textAlign: "right" }}>
                <div style={{ 
                  fontWeight: "bold",
                  color: transaction.type === "deposit" || transaction.type === "refund" ? "#28a745" : "#dc3545",
                  fontSize: "14px",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {transaction.type === "deposit" || transaction.type === "refund" ? "+" : "-"}
                  £{transaction.amount.toFixed(2)}
                </div>
                <div style={{ 
                  fontSize: "12px", 
                  color: getStatusColor(transaction.status),
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}>
                  {tooltips[lang][transaction.status]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ 
              margin: "0 0 20px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].deposit}
            </h3>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#000",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].amount}
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#000",
                  boxSizing: "border-box",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#000",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].paymentMethod}
              </label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#000",
                  boxSizing: "border-box",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name[lang as keyof typeof method.name]}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleDeposit}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                {tooltips[lang].submit}
              </button>
              <button
                onClick={() => setShowDepositModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                {tooltips[lang].cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ 
              margin: "0 0 20px 0", 
              color: "#333",
              fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
            }}>
              {tooltips[lang].withdraw}
            </h3>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#000",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].amount}
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#000",
                  boxSizing: "border-box",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
                placeholder="0.00"
                min="0"
                max={walletData.balance}
                step="0.01"
              />
              <div style={{ 
                fontSize: "12px", 
                color: "#666",
                marginTop: "4px",
                fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
              }}>
                {tooltips[lang].balance}: £{walletData.balance.toFixed(2)}
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleWithdraw}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                {tooltips[lang].submit}
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: lang === "fa" ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "inherit"
                }}
              >
                {tooltips[lang].cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 