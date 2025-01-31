import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import HttpBackend from 'i18next-http-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'

const savedLanguage = localStorage.getItem('i18nextLng') || 'en'

i18n.use(LanguageDetector)
    .use(Backend)
    .use(initReactI18next)
    .init({
        backend: {
            backends: [LocalStorageBackend, HttpBackend],
            loadPath: '/locales/{{lng}}/translation.json',
            backendOptions: [
                {
                    expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
                },
                {
                    loadPath: './locales/{{lng}}/translation.json',
                },
            ],
        },
        lng: savedLanguage, // default language
        fallbackLng: 'en', // if key is missing show Arabic
        returnObjects: true,
        debug: process.env.NODE_ENV === 'development',

        ns: ['translations'],
        defaultNS: 'translations',
    })
