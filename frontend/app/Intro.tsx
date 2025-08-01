'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import GPTSetup from './GPTSetup'

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

const mainLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' }
]

const otherLanguages: Language[] = [
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },      // Punjabi: ~0.5%
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },        // Urdu: ~0.5%
  { code: 'pt', name: 'Português', flag: '🇵🇹' },   // Portuguese: ~0.4%
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },     // Arabic: ~0.4%
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },        // Bengali: ~0.3%
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },      // Turkish: <0.2%
  { code: 'es', name: 'Español', flag: '🇪🇸' },     // Spanish: <0.2%
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },    // Italian: <0.2%
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },       // Tamil: <0.2%
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }      // Russian: <0.2%
]

// Pre-defined translations for common texts
const translations: Translations = {
  'next': {
    'en': 'Next',
    'fa': 'بعدی',
    'ro': 'Următorul',
    'pl': 'Dalej',
    'ar': 'التالي',
    'tr': 'Sonraki',
    'es': 'Siguiente',
    'it': 'Successivo',
    'pt': 'Próximo',
    'ru': 'Далее',
    'bn': 'পরবর্তী',
    'ur': 'اگلا',
    'pa': 'ਅਗਲਾ',
    'ta': 'அடுத்து'
  },
  'back': {
    'en': 'Back',
    'fa': 'بازگشت',
    'ro': 'Înapoi',
    'pl': 'Wstecz',
    'ar': 'رجوع',
    'tr': 'Geri',
    'es': 'Atrás',
    'it': 'Indietro',
    'pt': 'Voltar',
    'ru': 'Назад',
    'bn': 'ফিরে যান',
    'ur': 'واپس',
    'pa': 'ਵਾਪਸ',
    'ta': 'திரும்பு'
  },
  'choose_language': {
    'en': 'Choose Your Language',
    'fa': 'انتخاب زبان',
    'ro': 'Alegeți limba',
    'pl': 'Wybierz język',
    'ar': 'اختر لغتك',
    'tr': 'Dilinizi seçin',
    'es': 'Elige tu idioma',
    'it': 'Scegli la tua lingua',
    'pt': 'Escolha seu idioma',
    'ru': 'Выберите язык',
    'bn': 'আপনার ভাষা নির্বাচন করুন',
    'ur': 'اپنی زبان منتخب کریں',
    'pa': 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    'ta': 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்'
  },
  'other_languages': {
    'en': 'Other Languages',
    'fa': 'زبان‌های دیگر',
    'ro': 'Alte limbi',
    'pl': 'Inne języki',
    'ar': 'لغات أخرى',
    'tr': 'Diğer diller',
    'es': 'Otros idiomas',
    'it': 'Altre lingue',
    'pt': 'Outros idiomas',
    'ru': 'Другие языки',
    'bn': 'অন্যান্য ভাষা',
    'ur': 'دیگر زبانیں',
    'pa': 'ਹੋਰ ਭਾਸ਼ਾਵਾਂ',
    'ta': 'மற்ற மொழிகள்'
  },
  'more_languages': {
    'en': 'More Languages',
    'fa': 'زبان‌های بیشتر',
    'ro': 'Mai multe limbi',
    'pl': 'Więcej języków',
    'ar': 'المزيد من اللغات',
    'tr': 'Daha fazla dil',
    'es': 'Más idiomas',
    'it': 'Più lingue',
    'pt': 'Mais idiomas',
    'ru': 'Больше языков',
    'bn': 'আরও ভাষা',
    'ur': 'مزید زبانیں',
    'pa': 'ਹੋਰ ਭਾਸ਼ਾਵਾਂ',
    'ta': 'மேலும் மொழிகள்'
  },
  'default_english': {
    'en': 'Default: English',
    'fa': 'پیش‌فرض: انگلیسی',
    'ro': 'Implicit: Engleză',
    'pl': 'Domyślnie: Angielski',
    'ar': 'افتراضي: الإنجليزية',
    'tr': 'Varsayılan: İngilizce',
    'es': 'Predeterminado: Inglés',
    'it': 'Predefinito: Inglese',
    'pt': 'Padrão: Inglês',
    'ru': 'По умолчанию: Английский',
    'bn': 'ডিফল্ট: ইংরেজি',
    'ur': 'پہلے سے طے شدہ: انگریزی',
    'pa': 'ਡਿਫੌਲਟ: ਅੰਗਰੇਜ਼ੀ',
    'ta': 'இயல்புநிலை: ஆங்கிலம்'
  }
}

export default function Intro() {
  const router = useRouter()
  const languageSectionRef = useRef<HTMLDivElement>(null)
  const [showOtherLanguages, setShowOtherLanguages] = useState(false)
  const [replacedLanguage, setReplacedLanguage] = useState<string | null>(null)
  const [showLanguageSelect, setShowLanguageSelect] = useState(false)
  const [showGPTSetup, setShowGPTSetup] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [currentLanguage, setCurrentLanguage] = useState<string>('en')

  // Function to get translated text
  const t = (key: string): string => {
    const translation = translations[key]?.[currentLanguage]
    return translation || translations[key]?.['en'] || key
  }

  // Function to translate text using Google Translate (if needed)
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
      // For now, we'll use pre-defined translations
      // In a real app, you could integrate with Google Translate API here
      const translation = translations[text.toLowerCase().replace(/\s+/g, '_')]?.[targetLang]
      return translation || text
    } catch (error) {
      console.error('Translation error:', error)
      return text
    }
  }

  useEffect(() => {
    // Always start with first page
    // User must click "بعدی" to proceed
    setShowLanguageSelect(false)
    setIsFirstVisit(true)
    setSelectedLanguage('en')
    
    console.log('Starting with first page')
  }, [])

  const handleSkipAnimation = () => {
    setShowLanguageSelect(true)
    localStorage.setItem('skipIntro', 'true')
  }

  const handleBackToFirstPage = () => {
    setShowLanguageSelect(false)
  }

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    setCurrentLanguage(languageCode) // Change current language for translations
    localStorage.setItem('language', languageCode)
    localStorage.setItem('firstVisit', 'false')
    
    // Show GPT setup after language selection
    setShowGPTSetup(true)
  }

  const handleOtherLanguageSelect = (language: Language) => {
    // Replace Romanian with the selected other language
    setReplacedLanguage(language.code)
    
    // Close the dropdown menu
    setShowOtherLanguages(false)
    
    // Show GPT setup after language selection
    setShowGPTSetup(true)
  }

  const handleGPTSetupComplete = (aiEnabled: boolean) => {
    setShowGPTSetup(false)
    // Navigate to auth page after GPT setup
    router.push('/auth')
  }

  const getDisplayLanguages = () => {
    if (replacedLanguage) {
      // Find the other language that was selected
      const selectedOtherLang = otherLanguages.find(lang => lang.code === replacedLanguage)
      if (selectedOtherLang) {
        // Keep English and Persian in first two positions, replace Romanian (3rd) with selected language
        return [
          mainLanguages[0], // English
          mainLanguages[1], // Persian
          selectedOtherLang, // Selected language from dropdown
          mainLanguages[3]  // Polish
        ]
      }
    }
    return mainLanguages
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {showGPTSetup ? (
        <GPTSetup onComplete={handleGPTSetupComplete} />
      ) : !showLanguageSelect ? (
        // First Page - Animation Section
        <section className="h-screen flex flex-col items-center justify-center relative px-4 sm:px-6">
          {/* Animation Container */}
          <div className="text-center mb-12 sm:mb-16">
            {/* Contractor Image/Animation */}
            <div className="w-60 h-60 sm:w-80 sm:h-80 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl overflow-hidden">
              <img
                src="/animations/contractor-icon.png"
                alt="Contractor Icon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to emoji if image doesn't load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback emoji if image doesn't load */}
              <div className="hidden text-white text-6xl sm:text-8xl">🏗️</div>
            </div>
            
            {/* GIF Animation - Now on first page */}
            <div className="mb-6 sm:mb-8">
              <img
                src="/animations/contractor-intro.gif"
                alt="Contractor Intro Animation"
                className="w-[280px] sm:w-[400px] max-w-full mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  // Try PNG if GIF doesn't load
                  if (e.currentTarget.src.includes('.gif')) {
                    e.currentTarget.src = '/animations/contractor-intro.png';
                  } else {
                    // Fallback if neither GIF nor PNG loads
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }
                }}
              />
              {/* Fallback placeholder if image doesn't load */}
              <div className="hidden w-[280px] sm:w-[400px] h-[200px] mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-white text-4xl">🏗️</div>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Contractor Assistant</h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">Your digital construction companion</p>
          </div>
          
          {/* Skip Button - Now below animation content */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleSkipAnimation}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 font-semibold shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              {t('next')}
            </button>
          </div>
        </section>
      ) : (
        // Second Page - Language Selection
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative">
          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <button
              onClick={handleBackToFirstPage}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 font-medium shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm"
            >
              {t('back')}
            </button>
          </div>
          
          <div className="text-center w-full max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
              {t('choose_language')}
            </h2>
            
            {/* Main Language Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {getDisplayLanguages().map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`group flex flex-col items-center p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 ${
                    selectedLanguage === language.code
                      ? 'bg-indigo-100 border-2 border-indigo-500 shadow-lg'
                      : 'bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-indigo-200 shadow-md hover:shadow-lg'
                  }`}
                >
                  {/* Flag Icon */}
                  <div className={`mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 ${
                    isFirstVisit ? 'text-5xl sm:text-6xl' : 'text-6xl sm:text-8xl'
                  }`}>
                    {language.flag}
                  </div>
                  
                  {/* Language Name - Only show on first visit */}
                  {isFirstVisit && (
                    <span className={`font-medium text-xs sm:text-sm ${
                      selectedLanguage === language.code
                        ? 'text-indigo-700'
                        : 'text-gray-700'
                    }`}>
                      {language.name}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Other Languages Section */}
            <div className="relative">
              <button
                onClick={() => setShowOtherLanguages(!showOtherLanguages)}
                className="w-full p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-300 hover:bg-white/80 transition-all duration-300 text-gray-600 hover:text-gray-800"
              >
                <div className="flex items-center justify-center">
                  <span className="text-xl sm:text-2xl mr-2">🌐</span>
                  <span className="font-medium text-sm sm:text-base">
                    {isFirstVisit ? t('other_languages') : t('more_languages')}
                  </span>
                  <span className={`ml-2 transition-transform duration-300 ${showOtherLanguages ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {/* Other Languages Dropdown */}
              {showOtherLanguages && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-200 max-h-48 sm:max-h-60 overflow-y-auto z-10">
                  <div className="p-2">
                    {otherLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleOtherLanguageSelect(language)}
                        className="w-full flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span className="text-xl sm:text-2xl mr-3">{language.flag}</span>
                        <span className="text-gray-700 font-medium text-sm sm:text-base">{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Default Language Note - Only show on first visit */}
            {isFirstVisit && (
              <p className="text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8">
                {t('default_english')}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  )
} 