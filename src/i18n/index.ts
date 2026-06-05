import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/messages/en.json';
import gu from '@/messages/gu.json';

const savedLanguage = localStorage.getItem('orderbook-lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    gu: { translation: gu },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
