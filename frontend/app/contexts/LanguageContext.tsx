'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Language {
  code: string
  name: string
  flag: string
}

interface Translations {
  [key: string]: {
    [langCode: string]: string
  }
}

interface LanguageContextType {
  currentLanguage: string
  setCurrentLanguage: (lang: string) => void
  t: (key: string) => string
  languages: Language[]
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' }
]

const translations: Translations = {
  // Navigation
  'back': {
    'en': 'Back',
    'fa': 'بازگشت',
    'ro': 'Înapoi',
    'pl': 'Wstecz'
  },
  'home': {
    'en': 'Home',
    'fa': 'خانه',
    'ro': 'Acasă',
    'pl': 'Strona główna'
  },
  'language': {
    'en': 'Language',
    'fa': 'زبان',
    'ro': 'Limba',
    'pl': 'Język'
  },

  // Auth Forms
  'login': {
    'en': 'Login',
    'fa': 'ورود',
    'ro': 'Autentificare',
    'pl': 'Zaloguj się'
  },
  'register': {
    'en': 'Register',
    'fa': 'ثبت نام',
    'ro': 'Înregistrare',
    'pl': 'Zarejestruj się'
  },
  'send_verification': {
    'en': 'Send Verification Code',
    'fa': 'ارسال کد تایید',
    'ro': 'Trimite codul de verificare',
    'pl': 'Wyślij kod weryfikacyjny'
  },
  'register_info': {
    'en': 'After filling out this form and clicking "Send Verification Code", a 6-digit code will be sent to your email or phone. You will then need to enter that code to complete your registration.',
    'fa': 'پس از پر کردن این فرم و کلیک روی "ارسال کد تایید"، کد 6 رقمی به ایمیل یا تلفن شما ارسال می‌شود. سپس باید آن کد را وارد کنید تا ثبت‌نام خود را کامل کنید.',
    'ro': 'După completarea acestui formular și apăsarea "Trimite codul de verificare", vă va fi trimis un cod de 6 cifre la email-ul sau telefonul dvs. Apoi va trebui să introduceți acel cod pentru a vă completa înregistrarea.',
    'pl': 'Po wypełnieniu tego formularza i kliknięciu "Wyślij kod weryfikacyjny", zostanie wysłany do Ciebie 6-cyfrowy kod na Twój email lub telefon. Następnie będziesz musiał wprowadzić ten kod, aby ukończyć rejestrację.'
  },
  'email': {
    'en': 'Email',
    'fa': 'ایمیل',
    'ro': 'Email',
    'pl': 'Email'
  },
  'password': {
    'en': 'Password',
    'fa': 'رمز عبور',
    'ro': 'Parolă',
    'pl': 'Hasło'
  },
  'confirm_password': {
    'en': 'Confirm Password',
    'fa': 'تأیید رمز عبور',
    'ro': 'Confirmă parola',
    'pl': 'Potwierdź hasło'
  },
  'full_name': {
    'en': 'Full Name',
    'fa': 'نام کامل',
    'ro': 'Nume complet',
    'pl': 'Pełne imię'
  },
  'email_placeholder': {
    'en': 'Enter your email',
    'fa': 'ایمیل خود را وارد کنید',
    'ro': 'Introduceți email-ul',
    'pl': 'Wprowadź swój email'
  },
  'password_placeholder': {
    'en': 'Enter your password',
    'fa': 'رمز عبور خود را وارد کنید',
    'ro': 'Introduceți parola',
    'pl': 'Wprowadź swoje hasło'
  },
  'confirm_password_placeholder': {
    'en': 'Confirm your password',
    'fa': 'رمز عبور خود را تأیید کنید',
    'ro': 'Confirmați parola',
    'pl': 'Potwierdź swoje hasło'
  },
  'full_name_placeholder': {
    'en': 'Enter your full name',
    'fa': 'نام کامل خود را وارد کنید',
    'ro': 'Introduceți numele complet',
    'pl': 'Wprowadź swoje pełne imię'
  },

  // Toggle Links
  'dont_have_account': {
    'en': "Don't have an account?",
    'fa': 'حساب کاربری ندارید؟',
    'ro': 'Nu aveți cont?',
    'pl': 'Nie masz konta?'
  },
  'already_have_account': {
    'en': 'Already have an account?',
    'fa': 'قبلاً حساب کاربری دارید؟',
    'ro': 'Aveți deja cont?',
    'pl': 'Masz już konto?'
  },
  'register_link': {
    'en': 'Register',
    'fa': 'ثبت نام',
    'ro': 'Înregistrare',
    'pl': 'Zarejestruj się'
  },
  'login_link': {
    'en': 'Login',
    'fa': 'ورود',
    'ro': 'Autentificare',
    'pl': 'Zaloguj się'
  },

  // Validation Messages
  'email_required': {
    'en': 'Email is required',
    'fa': 'ایمیل الزامی است',
    'ro': 'Email-ul este obligatoriu',
    'pl': 'Email jest wymagany'
  },
  'email_invalid': {
    'en': 'Please enter a valid email',
    'fa': 'لطفاً ایمیل معتبر وارد کنید',
    'ro': 'Vă rugăm să introduceți un email valid',
    'pl': 'Wprowadź poprawny email'
  },
  'password_required': {
    'en': 'Password is required',
    'fa': 'رمز عبور الزامی است',
    'ro': 'Parola este obligatorie',
    'pl': 'Hasło jest wymagane'
  },
  'password_min': {
    'en': 'Password must be at least 6 characters',
    'fa': 'رمز عبور باید حداقل 6 کاراکتر باشد',
    'ro': 'Parola trebuie să aibă cel puțin 6 caractere',
    'pl': 'Hasło musi mieć co najmniej 6 znaków'
  },
  'name_required': {
    'en': 'Full name is required',
    'fa': 'نام کامل الزامی است',
    'ro': 'Numele complet este obligatoriu',
    'pl': 'Pełne imię jest wymagane'
  },
  'passwords_dont_match': {
    'en': 'Passwords do not match',
    'fa': 'رمزهای عبور مطابقت ندارند',
    'ro': 'Parolele nu se potrivesc',
    'pl': 'Hasła nie pasują'
  },
  'phone': {
    'en': 'Phone',
    'fa': 'شماره تلفن',
    'ro': 'Telefon',
    'pl': 'Telefon'
  },
  'phone_required': {
    'en': 'Phone number is required',
    'fa': 'شماره تلفن الزامی است',
    'ro': 'Numărul de telefon este obligatoriu',
    'pl': 'Numer telefonu jest wymagany'
  },
  'phone_invalid': {
    'en': 'Please enter a valid UK mobile number (11 digits starting with 07)',
    'fa': 'لطفاً شماره موبایل معتبر انگلیس وارد کنید (11 رقم که با 07 شروع شود)',
    'ro': 'Vă rugăm să introduceți un număr de telefon mobil valid din UK (11 cifre care încep cu 07)',
    'pl': 'Wprowadź poprawny numer telefonu komórkowego UK (11 cyfr zaczynających się od 07)'
  },
  'phone_placeholder': {
    'en': 'e.g. 07760339457',
    'fa': 'مثال: 07760339457',
    'ro': 'ex: 07760339457',
    'pl': 'np. 07760339457'
  },
  'phone_uk_format': {
    'en': 'UK mobile numbers must start with 07 (11 digits)',
    'fa': 'شماره موبایل انگلیس باید با 07 شروع شود (11 رقم)',
    'ro': 'Numerele de telefon mobil din UK trebuie să înceapă cu 07 (11 cifre)',
    'pl': 'Numery telefonów komórkowych w UK muszą zaczynać się od 07 (11 cyfr)'
  },
  'phone_format_hint': {
    'en': 'Format: 07XXXXXXXXX (11 digits)',
    'fa': 'فرمت: 07XXXXXXXXX (11 رقم)',
    'ro': 'Format: 07XXXXXXXXX (11 cifre)',
    'pl': 'Format: 07XXXXXXXXX (11 cyfr)'
  },

  // Success Messages
  'login_success': {
    'en': 'Login successful!',
    'fa': 'ورود موفقیت‌آمیز بود!',
    'ro': 'Autentificare reușită!',
    'pl': 'Logowanie udane!'
  },
  'register_success': {
    'en': 'Registration successful!',
    'fa': 'ثبت نام موفقیت‌آمیز بود!',
    'ro': 'Înregistrare reușită!',
    'pl': 'Rejestracja udana!'
  },
  'verification_success': {
    'en': 'Registration completed successfully! You can now login.',
    'fa': 'ثبت نام با موفقیت تکمیل شد! حالا می‌توانید وارد شوید.',
    'ro': 'Înregistrarea a fost finalizată cu succes! Acum vă puteți autentifica.',
    'pl': 'Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.'
  },
  'code_sent': {
    'en': 'Verification code sent!',
    'fa': 'کد تایید ارسال شد!',
    'ro': 'Cod de verificare trimis!',
    'pl': 'Kod weryfikacyjny wysłany!'
  },
  'verification': {
    'en': 'Verification',
    'fa': 'تایید',
    'ro': 'Verificare',
    'pl': 'Weryfikacja'
  },
  'verification_info': {
    'en': 'Enter the 6-digit verification code sent to your email or phone to complete your registration.',
    'fa': 'کد تایید 6 رقمی ارسال شده به ایمیل یا تلفن خود را وارد کنید تا ثبت‌نام خود را کامل کنید.',
    'ro': 'Introduceți codul de verificare de 6 cifre trimis la email-ul sau telefonul dvs. pentru a vă completa înregistrarea.',
    'pl': 'Wprowadź 6-cyfrowy kod weryfikacyjny wysłany na Twój email lub telefon, aby ukończyć rejestrację.'
  },
  'demo_code': {
    'en': 'Demo Code (for testing):',
    'fa': 'کد آزمایشی (برای تست):',
    'ro': 'Cod demo (pentru testare):',
    'pl': 'Kod demo (do testowania):'
  },
  'verification_sent_to': {
    'en': 'Verification code sent to:',
    'fa': 'کد تایید ارسال شد به:',
    'ro': 'Cod de verificare trimis la:',
    'pl': 'Kod weryfikacyjny wysłany na:'
  },
  'verification_note': {
    'en': 'Note: Enter the number without the leading 0 (e.g., 7760339457 instead of 07760339457)',
    'fa': 'توجه: شماره را بدون صفر ابتدایی وارد کنید (مثال: 7760339457 به جای 07760339457)',
    'ro': 'Notă: Introduceți numărul fără 0-ul de la început (ex: 7760339457 în loc de 07760339457)',
    'pl': 'Uwaga: Wprowadź numer bez początkowego 0 (np. 7760339457 zamiast 07760339457)'
  },
  'verification_code': {
    'en': 'Verification Code',
    'fa': 'کد تایید',
    'ro': 'Cod de verificare',
    'pl': 'Kod weryfikacyjny'
  },
  'code_required': {
    'en': 'Verification code is required',
    'fa': 'کد تایید الزامی است',
    'ro': 'Codul de verificare este obligatoriu',
    'pl': 'Kod weryfikacyjny jest wymagany'
  },
  'code_invalid': {
    'en': 'Please enter a valid 6-digit code',
    'fa': 'لطفاً کد 6 رقمی معتبر وارد کنید',
    'ro': 'Vă rugăm să introduceți un cod valid de 6 cifre',
    'pl': 'Wprowadź poprawny 6-cyfrowy kod'
  },
  'code_placeholder': {
    'en': 'Enter 6-digit code',
    'fa': 'کد 6 رقمی را وارد کنید',
    'ro': 'Introduceți codul de 6 cifre',
    'pl': 'Wprowadź 6-cyfrowy kod'
  },
  'verify': {
    'en': 'Verify',
    'fa': 'تایید',
    'ro': 'Verifică',
    'pl': 'Zweryfikuj'
  },
  'complete_registration': {
    'en': 'Complete Registration',
    'fa': 'تکمیل ثبت نام',
    'ro': 'Finalizează înregistrarea',
    'pl': 'Zakończ rejestrację'
  },
  'verifying': {
    'en': 'Verifying...',
    'fa': 'در حال تایید...',
    'ro': 'Se verifică...',
    'pl': 'Weryfikowanie...'
  },
  'resend_code': {
    'en': 'Resend Code',
    'fa': 'ارسال مجدد کد',
    'ro': 'Retrimite codul',
    'pl': 'Wyślij kod ponownie'
  },
  'logging_in': {
    'en': 'Logging in...',
    'fa': 'در حال ورود...',
    'ro': 'Se autentifică...',
    'pl': 'Logowanie...'
  },
  'registering': {
    'en': 'Registering...',
    'fa': 'در حال ثبت نام...',
    'ro': 'Se înregistrează...',
    'pl': 'Rejestracja...'
  },
  'login_error': {
    'en': 'Login failed. Please try again.',
    'fa': 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.',
    'ro': 'Autentificarea a eșuat. Vă rugăm să încercați din nou.',
    'pl': 'Logowanie nie powiodło się. Spróbuj ponownie.'
  },
  'register_error': {
    'en': 'Registration failed. Please try again.',
    'fa': 'ثبت نام ناموفق بود. لطفاً دوباره تلاش کنید.',
    'ro': 'Înregistrarea a eșuat. Vă rugăm să încercați din nou.',
    'pl': 'Rejestracja nie powiodła się. Spróbuj ponownie.'
  },
  'verification_error': {
    'en': 'Verification failed. Please try again.',
    'fa': 'تایید ناموفق بود. لطفاً دوباره تلاش کنید.',
    'ro': 'Verificarea a eșuat. Vă rugăm să încercați din nou.',
    'pl': 'Weryfikacja nie powiodła się. Spróbuj ponownie.'
  },
  'code_send_error': {
    'en': 'Failed to send code. Please try again.',
    'fa': 'ارسال کد ناموفق بود. لطفاً دوباره تلاش کنید.',
    'ro': 'Trimiterea codului a eșuat. Vă rugăm să încercați din nou.',
    'pl': 'Wysyłanie kodu nie powiodło się. Spróbuj ponownie.'
  },

  // GPT Setup
  'enable_ai_features': {
    'en': 'Enable AI Features',
    'fa': 'فعال‌سازی قابلیت‌های هوش مصنوعی',
    'ro': 'Activează funcțiile AI',
    'pl': 'Włącz funkcje AI'
  },
  'ai_description': {
    'en': 'This app uses ChatGPT for translations, image analysis, and Q&A. To activate AI features, enter your OpenAI API Key. Without it, AI features are disabled.',
    'fa': 'این برنامه از ChatGPT برای ترجمه، تحلیل تصاویر و پرسش و پاسخ استفاده می‌کند. برای فعال‌سازی قابلیت‌های هوش مصنوعی، کلید API OpenAI خود را وارد کنید. بدون آن، قابلیت‌های هوش مصنوعی غیرفعال خواهند بود.',
    'ro': 'Această aplicație folosește ChatGPT pentru traduceri, analiza imaginilor și întrebări și răspunsuri. Pentru a activa funcțiile AI, introduceți cheia API OpenAI. Fără ea, funcțiile AI sunt dezactivate.',
    'pl': 'Ta aplikacja używa ChatGPT do tłumaczeń, analizy obrazów i pytań i odpowiedzi. Aby aktywować funkcje AI, wprowadź swój klucz API OpenAI. Bez niego funkcje AI są wyłączone.'
  },
  'setup_steps': {
    'en': 'Setup Steps:',
    'fa': 'مراحل تنظیم:',
    'ro': 'Pași de configurare:',
    'pl': 'Kroki konfiguracji:'
  },
  'step_1': {
    'en': 'Go to OpenAI Platform',
    'fa': 'به پلتفرم OpenAI بروید',
    'ro': 'Mergeți la Platforma OpenAI',
    'pl': 'Przejdź do Platformy OpenAI'
  },
  'step_2': {
    'en': 'Click "Create new secret key"',
    'fa': 'روی "ایجاد کلید جدید" کلیک کنید',
    'ro': 'Faceți clic pe "Creați o cheie secretă nouă"',
    'pl': 'Kliknij "Utwórz nowy klucz tajny"'
  },
  'step_3': {
    'en': 'Copy & paste the key below',
    'fa': 'کلید را کپی کرده و در زیر وارد کنید',
    'ro': 'Copiați și lipiți cheia de mai jos',
    'pl': 'Skopiuj i wklej klucz poniżej'
  },
  'openai_api_key': {
    'en': 'OpenAI API Key',
    'fa': 'کلید API OpenAI',
    'ro': 'Cheia API OpenAI',
    'pl': 'Klucz API OpenAI'
  },
  'api_key_placeholder': {
    'en': 'sk-...',
    'fa': 'sk-...',
    'ro': 'sk-...',
    'pl': 'sk-...'
  },
  'api_key_required': {
    'en': 'API key is required',
    'fa': 'کلید API الزامی است',
    'ro': 'Cheia API este obligatorie',
    'pl': 'Klucz API jest wymagany'
  },
  'invalid_api_key': {
    'en': 'Invalid API key. Please check and try again.',
    'fa': 'کلید API نامعتبر است. لطفاً بررسی کرده و دوباره تلاش کنید.',
    'ro': 'Cheie API invalidă. Vă rugăm să verificați și să încercați din nou.',
    'pl': 'Nieprawidłowy klucz API. Sprawdź i spróbuj ponownie.'
  },
  'api_key_error': {
    'en': 'Error validating API key. Please try again.',
    'fa': 'خطا در اعتبارسنجی کلید API. لطفاً دوباره تلاش کنید.',
    'ro': 'Eroare la validarea cheii API. Vă rugăm să încercați din nou.',
    'pl': 'Błąd walidacji klucza API. Spróbuj ponownie.'
  },
  'connect': {
    'en': 'Connect',
    'fa': 'اتصال',
    'ro': 'Conectare',
    'pl': 'Połącz'
  },
  'connecting': {
    'en': 'Connecting...',
    'fa': 'در حال اتصال...',
    'ro': 'Se conectează...',
    'pl': 'Łączenie...'
  },
  'skip': {
    'en': 'Skip',
    'fa': 'رد کردن',
    'ro': 'Omite',
    'pl': 'Pomiń'
  },
  'ai_disabled_message': {
    'en': 'AI disabled. You can enable it later in Settings.',
    'fa': 'هوش مصنوعی غیرفعال شد. می‌توانید بعداً در تنظیمات آن را فعال کنید.',
    'ro': 'AI dezactivat. Îl puteți activa mai târziu în Setări.',
    'pl': 'AI wyłączone. Możesz je włączyć później w Ustawieniach.'
  },
  'continue_with_google': {
    'en': 'Continue with Google',
    'fa': 'ادامه با گوگل',
    'ro': 'Continuă cu Google',
    'pl': 'Kontynuuj z Google'
  },
  'or': {
    'en': 'or',
    'fa': 'یا',
    'ro': 'sau',
    'pl': 'lub'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const t = (key: string): string => {
    const translation = translations[key]?.[currentLanguage]
    return translation || translations[key]?.['en'] || key
  }

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage: handleLanguageChange,
        t,
        languages
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
} 