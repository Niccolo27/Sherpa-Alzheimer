import { useState, useEffect } from 'react';
import { Language } from '../utils/translations';


export function useLanguage() {
  const [lang, setLang] = useState<Language>('it');

  useEffect(() => {
    const savedLang = localStorage.getItem('user_preferred_lang') as Language;
    
    if (savedLang) {
      setLang(savedLang);
      document.documentElement.lang = savedLang;
    } else {
      const browserLang = navigator.language.split('-')[0];
      const detected = (browserLang === 'it' ? 'it' : 'en') as Language;
      setLang(detected);
      document.documentElement.lang = detected;
    }
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('user_preferred_lang', newLang);
    document.documentElement.lang = newLang;
  };

  return { lang, changeLanguage };
}