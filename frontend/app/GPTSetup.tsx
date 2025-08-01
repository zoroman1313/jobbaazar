'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from './contexts/LanguageContext'

interface GPTSetupProps {
  onComplete: (aiEnabled: boolean) => void
}

export default function GPTSetup({ onComplete }: GPTSetupProps) {
  const router = useRouter()
  const { currentLanguage, setCurrentLanguage, t, languages } = useLanguage()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSkipTooltip, setShowSkipTooltip] = useState(false)

  const handleBack = () => {
    router.push('/')
  }

  const handleHome = () => {
    router.push('/')
  }

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)
    setShowLanguageDropdown(false)
  }

  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/validateKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      })
      
      if (!response.ok) {
        throw new Error('Invalid API key')
      }
      
      return true
    } catch (error) {
      console.error('API key validation error:', error)
      return false
    }
  }

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      setError(t('api_key_required'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const isValid = await validateApiKey(apiKey)
      
      if (isValid) {
        // Save encrypted API key (in real app, encrypt before saving)
        localStorage.setItem('openai_api_key', apiKey)
        localStorage.setItem('aiEnabled', 'true')
        onComplete(true)
        router.push('/auth')
      } else {
        setError(t('invalid_api_key'))
      }
    } catch (error) {
      setError(t('api_key_error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('aiEnabled', 'false')
    onComplete(false)
    setShowSkipTooltip(true)
    
    setTimeout(() => {
      setShowSkipTooltip(false)
      router.push('/auth')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Back and Home buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-white hover:shadow-md transition-all duration-200 text-sm"
              >
                ← {t('back')}
              </button>
              <button
                onClick={handleHome}
                className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-white hover:shadow-md transition-all duration-200 text-sm"
              >
                🏠 {t('home')}
              </button>
            </div>

            {/* Right side - Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-white hover:shadow-md transition-all duration-200 text-sm flex items-center space-x-2"
              >
                <span>{t('language')}</span>
                <span className="text-lg">
                  {languages.find(lang => lang.code === currentLanguage)?.flag}
                </span>
                <span className={`transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Language Dropdown */}
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="py-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${
                          currentLanguage === language.code ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg mr-3">{language.flag}</span>
                        <span className="font-medium">{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 flex flex-col gap-6">
            {/* Logo and AI Icon */}
            <div className="flex justify-center items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🏗️</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🤖</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {t('enable_ai_features')}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('ai_description')}
              </p>
            </div>

            {/* Step-by-step Guide */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">{t('setup_steps')}</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    {t('step_1')}{' '}
                    <a
                      href="https://platform.openai.com/account/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                    >
                      https://platform.openai.com/account/api-keys
                    </a>
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    {t('step_2')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    {t('step_3')}
                  </p>
                </div>
              </div>
            </div>

            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('openai_api_key')}
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('api_key_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('connecting') : t('connect')}
              </button>
              
              <button
                onClick={handleSkip}
                className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {t('skip')}
              </button>
            </div>

            {/* Skip Tooltip */}
            {showSkipTooltip && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-800">
                  {t('ai_disabled_message')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 