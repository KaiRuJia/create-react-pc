import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './locales/zh/translation.json'
import en from './locales/en/translation.json'


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      }
    },
    debug: true,
    lng: 'zh', // 默认语言
    fallbackLng: 'zh', // 回退语言
    interpolation: {
      escapeValue: false, // React 已经防止 XSS 攻击
    },
  })

export default i18n
