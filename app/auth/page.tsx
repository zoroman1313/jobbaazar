'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext'

interface LoginFormData {
  email: string
  password: string
}

interface RegisterFormData {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface VerificationFormData {
  code: string
}

type AuthStep = 'login' | 'register' | 'verify-email' | 'verify-phone'

const AuthPageContent = () => {
  const router = useRouter()
  const { currentLanguage, setCurrentLanguage, t, languages } = useLanguage()
  const [authStep, setAuthStep] = useState<AuthStep>('login')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [verificationPhone, setVerificationPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [demoCode, setDemoCode] = useState('')

  const loginForm = useForm<LoginFormData>()
  const registerForm = useForm<RegisterFormData>()
  const verificationForm = useForm<VerificationFormData>()

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

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // Mock Google Sign-In - in real app, implement Google OAuth here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert(t('login_success'))
      router.push('/role-selection')
    } catch (error) {
      alert(t('login_error'))
    } finally {
      setIsLoading(false)
    }
  }

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      console.log('Login data:', data)
      // Mock login - in real app, call your API here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert(t('login_success'))
      router.push('/role-selection')
    } catch (error) {
      alert(t('login_error'))
    } finally {
      setIsLoading(false)
    }
  }

  const onRegisterSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      alert(t('passwords_dont_match'))
      return
    }

    setIsLoading(true)
    try {
      console.log('Register data:', data)
      // Mock sending verification code - in real app, call your API here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Generate demo code for testing
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setDemoCode(code)
      
      // Set verification data and move to verification step
      setVerificationEmail(data.email)
      setVerificationPhone(data.phone)
      setAuthStep('verify-email')
      alert(`${t('code_sent')}\n\nDemo Code: ${code}`)
    } catch (error) {
      alert(t('code_send_error'))
    } finally {
      setIsLoading(false)
    }
  }

  const onVerificationSubmit = async (data: VerificationFormData) => {
    setIsLoading(true)
    try {
      console.log('Verification code:', data.code)
      // Mock verification - in real app, call your API here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert(t('verification_success'))
      // After successful verification, switch to login form
      setAuthStep('login')
      verificationForm.reset()
    } catch (error) {
      alert(t('verification_error'))
    } finally {
      setIsLoading(false)
    }
  }

  const sendVerificationCode = async (type: 'email' | 'phone') => {
    setIsLoading(true)
    try {
      const contact = type === 'email' ? verificationEmail : verificationPhone
      console.log(`Sending verification code to ${type}:`, contact)
      // Mock sending code - in real app, call your API here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert(t('code_sent'))
    } catch (error) {
      alert(t('code_send_error'))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleForm = () => {
    setAuthStep(authStep === 'login' ? 'register' : 'login')
    loginForm.reset()
    registerForm.reset()
  }

  const switchToPhoneVerification = () => {
    setAuthStep('verify-phone')
  }

  const switchToEmailVerification = () => {
    setAuthStep('verify-email')
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
            {/* Contractor Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🏗️</span>
              </div>
            </div>

            {/* Form Toggle */}
            <AnimatePresence mode="wait">
              {authStep === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {t('login')}
                  </h2>

                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        {...loginForm.register('email', {
                          required: t('email_required'),
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t('email_invalid')
                          }
                        })}
                        placeholder={t('email_placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('password')}
                      </label>
                      <input
                        type="password"
                        {...loginForm.register('password', {
                          required: t('password_required'),
                          minLength: {
                            value: 6,
                            message: t('password_min')
                          }
                        })}
                        placeholder={t('password_placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? t('logging_in') : t('login')}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="mt-6 flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">{t('or')}</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Google Sign-In Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full mt-4 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {t('continue_with_google')}
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      {t('dont_have_account')}{' '}
                      <button
                        onClick={toggleForm}
                        className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                      >
                        {t('register_link')}
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {authStep === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {t('register')}
                  </h2>

                  {/* Registration Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-800">
                          {t('register_info')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('full_name')}
                      </label>
                      <input
                        type="text"
                        {...registerForm.register('fullName', {
                          required: t('name_required')
                        })}
                        placeholder={t('full_name_placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      {registerForm.formState.errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        {...registerForm.register('email', {
                          required: t('email_required'),
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t('email_invalid')
                          }
                        })}
                        placeholder={t('email_placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('phone')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500 text-sm font-medium">+44</span>
                        </div>
                        <input
                          type="tel"
                          {...registerForm.register('phone', {
                            required: t('phone_required'),
                            pattern: {
                              value: /^[0-9]{11}$/,
                              message: t('phone_invalid')
                            },
                            validate: (value) => {
                              if (!value.startsWith('07')) {
                                return t('phone_uk_format')
                              }
                              return true
                            }
                          })}
                          placeholder={t('phone_placeholder')}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      {registerForm.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.phone.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {t('phone_format_hint')}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('password')}
                      </label>
                      <input
                        type="password"
                        {...registerForm.register('password', {
                          required: t('password_required'),
                          minLength: {
                            value: 6,
                            message: t('password_min')
                          }
                        })}
                        placeholder={t('password_placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('confirm_password')}
                      </label>
                      <input
                        type="password"
                        {...registerForm.register('confirmPassword', {
                          required: t('password_required'),
                          validate: (value) => value === registerForm.getValues('password') || t('passwords_dont_match')
                        })}
                        placeholder={t('confirm_password_placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {registerForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? t('registering') : t('send_verification')}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      {t('already_have_account')}{' '}
                      <button
                        onClick={toggleForm}
                        className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                      >
                        {t('login_link')}
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {(authStep === 'verify-email' || authStep === 'verify-phone') && (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {t('verification')}
                  </h2>

                  {/* Verification Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-800">
                          {t('verification_info')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-gray-600 mb-2">
                      {t('verification_sent_to')}
                    </p>
                    <p className="font-medium text-gray-800">
                      {authStep === 'verify-email' ? verificationEmail : verificationPhone}
                    </p>
                    {authStep === 'verify-phone' && (
                      <p className="text-xs text-gray-500 mt-2">
                        {t('verification_note')}
                      </p>
                    )}
                    
                    {/* Demo Code Display */}
                    {demoCode && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 mb-1">
                          {t('demo_code')}
                        </p>
                        <p className="text-lg font-mono font-bold text-yellow-900">
                          {demoCode}
                        </p>
                      </div>
                    )}
                  </div>

                  <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('verification_code')}
                      </label>
                      <input
                        type="text"
                        {...verificationForm.register('code', {
                          required: t('code_required'),
                          pattern: {
                            value: /^\d{6}$/,
                            message: t('code_invalid')
                          }
                        })}
                        placeholder={t('code_placeholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                      {verificationForm.formState.errors.code && (
                        <p className="text-red-500 text-sm mt-1">
                          {verificationForm.formState.errors.code.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? t('verifying') : t('complete_registration')}
                    </button>
                  </form>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => sendVerificationCode(authStep === 'verify-email' ? 'email' : 'phone')}
                      disabled={isLoading}
                      className="w-full px-4 py-2 text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('resend_code')}
                    </button>

                    <div className="flex space-x-2">
                      <button
                        onClick={switchToEmailVerification}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          authStep === 'verify-email'
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                            : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        📧 {t('email')}
                      </button>
                      <button
                        onClick={switchToPhoneVerification}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          authStep === 'verify-phone'
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                            : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        📱 {t('phone')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <LanguageProvider>
      <AuthPageContent />
    </LanguageProvider>
  )
} 