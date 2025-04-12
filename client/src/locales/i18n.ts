import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import fi from './fi.json';
import ru from './ru.json'

i18n
   .use(initReactI18next)
   .init({
      compatibilityJSON: 'v3',
      resources: {
         en: { translation: en },
         fi: { translation: fi },
         ru: { translation: ru }
      },
      lng: Localization.locale.split('-')[0],
      fallbackLng: 'en',
      interpolation: {
         escapeValue: false,
      },
   });

export default i18n;
