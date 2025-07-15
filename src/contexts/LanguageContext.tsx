import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import de from '@/locales/de.json'

const translations = {
  en,
  fr,
  de
}

type Language = 'en' | 'fr' | 'de'

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cyberlab-lang') as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem('cyberlab-lang', lang)
    setLanguage(lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let result: Record<string, unknown> = translations[language]
    for (const k of keys) {
      if (typeof result !== 'object' || result === null) return key
      result = (result as Record<string, unknown>)[k]
      if (result === undefined) {
        // fallback to English
        let fallback: Record<string, unknown> = translations['en']
        for (const k2 of keys) {
          if (typeof fallback !== 'object' || fallback === null) return key
          fallback = (fallback as Record<string, unknown>)[k2]
          if (fallback === undefined) return key
        }
        return fallback as string || key
      }
    }
    return result as string || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}